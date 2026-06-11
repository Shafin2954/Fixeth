import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { runServerFallbackChat, AiFallbackUnavailableError } from "@/lib/ai/server-fallback";
import {
  fetchTranscriptChunks,
  formatSeconds,
  buildTimedSegments,
  getTopicsWithChunks,
  type TranscriptChunk
} from "@/lib/supabase/queries/transcript";
import {
  buildContext,
  buildSystemPrompt,
  buildUserPrompt,
  parseAnswerSegments,
  buildTopicContext
} from "@/lib/ai/video-chat";

// In-memory cache for chat responses (5-minute TTL)
interface ChatCacheEntry {
  timestamp: number;
  response: {
    answer: string;
    language: string;
    sources: Array<{
      topic_id: string;
      topic_label: string;
      topic_label_bn: string | null;
      start_time: number;
      end_time: number;
      order_index: number;
      chunks: TranscriptChunk[]
    }>;
    action: string;
  };
}

const chatCache = new Map<string, ChatCacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Clean up old cache entries (called periodically)
function cleanChatCache() {
  const now = Date.now();
  for (const [key, entry] of chatCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      chatCache.delete(key);
    }
  }
}

// Clean cache every minute
setInterval(cleanChatCache, 60 * 1000);

const ChatSchema = z.object({
  question: z.string().trim().min(1).max(1000),
  lesson_id: z.string().uuid(),
  language: z.enum(["en", "bn"]).default("en"),
  current_timestamp_sec: z.number().optional(),
  persona: z.string().optional()
});

async function fetchLessonContext(lessonId: string) {
  const supabase = await createClient();
  const [{ data: lesson }, { data: chunks, error: chunksError }] = await Promise.all([
    supabase
      .from("lessons")
      .select("id, title_en, title_bn")
      .eq("id", lessonId)
      .maybeSingle(),
    supabase
      .from("transcript_chunks")
      .select("id, lesson_id, chunk_text, start_time, end_time")
      .eq("lesson_id", lessonId)
      .order("start_time", { ascending: true })
  ]);

  if (chunksError) throw chunksError;

  return {
    lessonTitle: lesson?.title_en || "this lesson",
    chunks: (chunks || []) as TranscriptChunk[]
  };
}

export async function POST(req: Request) {
  // IP rate limit: 30 requests per minute
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    req.url; // fallback to url if headers not available (not ideal but works)
  const now = Date.now();
  const rateLimitWindow = 60 * 1000; // 1 minute
  const maxRequests = 30;

  // Initialize rate limit map if not exists
  // @ts-ignore - global variable augmentation
  if (!global.chatRateLimitMap) {
    // @ts-ignore - global variable augmentation
    global.chatRateLimitMap = new Map<string, { count: number; resetTime: number }>();
  }

  // Clean old entries
  // @ts-ignore - global variable augmentation
  for (const [key, data] of global.chatRateLimitMap.entries()) {
    if (now - data.resetTime > rateLimitWindow) {
      // @ts-ignore - global variable augmentation
      global.chatRateLimitMap.delete(key);
    }
  }

  // Get or create entry for this IP
  // @ts-ignore - global variable augmentation
  const ipData = global.chatRateLimitMap.get(ip) || { count: 0, resetTime: now + rateLimitWindow };
  if (now > ipData.resetTime) {
    // Reset the window
    ipData.count = 0;
    ipData.resetTime = now + rateLimitWindow;
  }

  // Increment count and check limit
  ipData.count++;
  if (ipData.count > maxRequests) {
    return NextResponse.json(
      { data: null, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  // @ts-ignore - global variable augmentation
  global.chatRateLimitMap.set(ip, ipData);

  try {
    const parsed = ChatSchema.parse(await req.json());
    const { lessonTitle, chunks } = await fetchLessonContext(parsed.lesson_id);
    if (!chunks.length) {
      return NextResponse.json({
        data: null,
        error: "Transcript is not available for this lesson yet."
      }, { status: 404 });
    }

    // Generate cache key based on request parameters
    const cacheKey = `${parsed.question}|${parsed.lesson_id}|${parsed.language}|${parsed.persona ?? ""}`;
    const cachedEntry = chatCache.get(cacheKey);
    if (cachedEntry && now - cachedEntry.timestamp < CACHE_TTL_MS) {
      // Return cached response
      return NextResponse.json({
        data: {
          answer: cachedEntry.response.answer,
          language: cachedEntry.response.language,
          sources: cachedEntry.response.sources,
          action: cachedEntry.response.action
        },
        error: null
      });
    }

    // Try to fetch topics for topic-anchored retrieval
    let context: string;
    let topics: Array<{
      topic_id: string;
      topic_label: string;
      topic_label_bn: string | null;
      start_time: number;
      end_time: number;
      order_index: number;
      chunks: TranscriptChunk[]
    }> | null = null;
    try {
      const fetchedTopics = await getTopicsWithChunks(parsed.lesson_id);
      if (fetchedTopics && fetchedTopics.length > 0) {
        topics = fetchedTopics;
        context = buildTopicContext(topics);
      } else {
        // Fallback to flat timed transcript
        // Compute max end_time for better estimation in buildTimedSegments
        const maxEndTime = chunks.reduce((max, chunk) => {
          const end = chunk.end_time ?? 0;
          return end > max ? end : max;
        }, 0);
        const timed = buildTimedSegments(chunks, maxEndTime);
        context = buildContext(timed);
      }
    } catch (e) {
      console.warn("Failed to fetch topics, falling back to flat transcript", e);
      // Fallback to flat timed transcript
      const maxEndTime = chunks.reduce((max, chunk) => {
        const end = chunk.end_time ?? 0;
        return end > max ? end : max;
      }, 0);
      const timed = buildTimedSegments(chunks, maxEndTime);
      context = buildContext(timed);
    }

    const system = buildSystemPrompt(lessonTitle, parsed.language, parsed.persona);
    const prompt = buildUserPrompt(parsed.question, context);
    const answer = await runServerFallbackChat(system, prompt);

    // Determine sources based on whether we used topics or not
    let sources: Array<{
      topic_id: string;
      topic_label: string;
      topic_label_bn: string | null;
      start_time: number;
      end_time: number;
      order_index: number;
      chunks: TranscriptChunk[]
    }> | [] = [];

    // We need to know if we used topics or not to set sources correctly.
    // We'll re-check the topics status (we could store it in a variable, but for simplicity we'll recompute)
    let usedTopics = false;
    try {
      const topicsCheck = await getTopicsWithChunks(parsed.lesson_id);
      if (topicsCheck && topicsCheck.length > 0) {
        usedTopics = true;
        sources = topicsCheck;
      }
    } catch (e) {
      // If we fail to fetch topics, we consider it as not using topics
      usedTopics = false;
    }

    // If we didn't use topics, sources remain empty array (as before)
    // If we used topics, sources is the topics array.

    // Store in cache
    chatCache.set(cacheKey, {
      timestamp: now,
      response: {
        answer,
        language: parsed.language,
        sources,
        action: "seek_video"
      }
    });

    return NextResponse.json({
      data: {
        answer,
        language: parsed.language,
        sources,
        action: "seek_video"
      },
      error: null
    });
  } catch (error) {
    const status =
      error instanceof z.ZodError
        ? 400
        : error instanceof AiFallbackUnavailableError
          ? 503
          : 500;

    return NextResponse.json({
      data: null,
      error: error instanceof Error ? error.message : "Chat failed."
    }, { status });
  }
}
