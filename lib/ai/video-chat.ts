import type { TranscriptChunk } from "@/lib/supabase/queries/transcript";
import { formatSeconds } from "@/lib/supabase/queries/transcript";

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "to", "of", "and", "or", "in",
  "on", "for", "with", "what", "how", "why", "when", "does", "do", "this", "that",
  "it", "i", "you", "me", "about", "can", "explain", "tell", "video", "lesson"
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u0980-\u09FF\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/**
 * Lightweight lexical retrieval over a single lesson's transcript.
 * No embeddings required (keeps the feature fully BYOA / zero-server).
 */
export function retrieveRelevantChunks(
  question: string,
  chunks: TranscriptChunk[],
  k = 4
): TranscriptChunk[] {
  const qTokens = tokenize(question);
  if (!qTokens.length || !chunks.length) return chunks.slice(0, k);

  const scored = chunks.map((chunk) => {
    const tokens = tokenize(chunk.chunk_text);
    const set = new Set(tokens);
    let score = 0;
    for (const t of qTokens) if (set.has(t)) score += 1;
    // small boost for term frequency
    for (const t of tokens) if (qTokens.includes(t)) score += 0.1;
    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, k).map((s) => s.chunk);
  return top.length ? top : chunks.slice(0, k);
}

/**
 * Render the transcript as timestamped lines using the exact [ts:MM:SS] marker
 * format we expect the model to copy back verbatim into its answer.
 */
export function buildContext(chunks: TranscriptChunk[]): string {
  return chunks
    .map((c) => `[ts:${formatSeconds(c.start_time)}] ${c.chunk_text}`)
    .join("\n");
}

/**
 * Build context grouped by topics when topic-anchored retrieval is available.
 * Each topic is prefixed with its label and contains its chunks in order.
 */
export function buildTopicContext(topics: Array<{
  topic_label: string;
  topic_label_bn: string | null;
  chunks: TranscriptChunk[]
}>): string {
  return topics
    .map(topic => {
      const topicHeader = topic.topic_label_bn || topic.topic_label;
      const chunksText = topic.chunks
        .map(c => `[ts:${formatSeconds(c.start_time)}] ${c.chunk_text}`)
        .join("\n");
      return `${topicHeader}\n${chunksText}`;
    })
    .join("\n\n");
}

export function buildSystemPrompt(
  lessonTitle: string,
  lang: string,
  persona?: string
): string {
  const langLine =
    lang === "bn"
      ? "Respond in Bengali (বাংলা)."
      : "Respond in clear English.";
  const personaLine =
    persona === "socratic"
      ? "Use a Socratic tone: guide with questions."
      : persona === "rpg"
        ? "Use an encouraging, gamified mentor tone."
        : "Be concise, friendly and concrete.";

  return [
    `You are Fixeth's in-video tutor for the lesson "${lessonTitle}".`,
    "You are given the lesson transcript as lines that each begin with a",
    "timestamp marker in the exact form [ts:MM:SS].",
    "When you reference a moment in the video, you MUST cite it by copying the",
    "EXACT [ts:MM:SS] marker from the transcript line you are drawing from —",
    "never invent or reformat a timestamp, and never write [ts:0:00] unless that",
    "specific line is the relevant one. Place the marker right after the",
    "sentence it supports, e.g. \"Branches let you work in isolation [ts:3:47].\"",
    "Prefer answering from the transcript; if it does not cover the question,",
    "say so briefly, then give a short general answer without a marker.",
    langLine,
    personaLine
  ].join(" ");
}

export function buildUserPrompt(question: string, context: string): string {
  return `Lesson transcript (each line starts with its [ts:MM:SS] marker):\n${context}\n\nLearner question: ${question}\n\nAnswer, citing the exact [ts:MM:SS] marker(s) from the transcript above.`;
}

export type AnswerSegment = { type: "text"; value: string } | { type: "time"; value: string; seconds: number };

/**
 * Split an answer into text + clickable timestamp tokens.
 * Accepts the canonical [ts:MM:SS] form and also tolerates a bare [MM:SS]
 * (or [H:MM:SS]) in case the model drops the "ts:" prefix.
 */
export function parseAnswerSegments(answer: string): AnswerSegment[] {
  const segments: AnswerSegment[] = [];
  const re = /\[(?:ts:)?(\d{1,2}:\d{2}(?::\d{2})?)\]/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(answer)) !== null) {
    if (m.index > last) {
      segments.push({ type: "text", value: answer.slice(last, m.index) });
    }
    const ts = m[1];
    const parts = ts.split(":").map(Number);
    const seconds =
      parts.length === 3
        ? parts[0] * 3600 + parts[1] * 60 + parts[2]
        : parts[0] * 60 + parts[1];
    segments.push({ type: "time", value: ts, seconds });
    last = re.lastIndex;
  }
  if (last < answer.length) {
    segments.push({ type: "text", value: answer.slice(last) });
  }
  return segments;
}
