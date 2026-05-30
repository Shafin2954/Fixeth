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

export function buildContext(chunks: TranscriptChunk[]): string {
  return chunks
    .map((c) => `[${formatSeconds(c.start_time)}] ${c.chunk_text}`)
    .join("\n");
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
    "You are given timestamped transcript excerpts from the video.",
    "Answer the learner's question using ONLY that transcript when possible.",
    "When you reference a moment in the video, cite it inline using the exact",
    "format [m:ss] (for example [12:05]) so the learner can jump there.",
    "If the transcript does not cover the question, say so briefly and give a short general answer.",
    langLine,
    personaLine
  ].join(" ");
}

export function buildUserPrompt(question: string, context: string): string {
  return `Transcript excerpts:\n${context}\n\nLearner question: ${question}`;
}

export type AnswerSegment = { type: "text"; value: string } | { type: "time"; value: string; seconds: number };

/** Split an answer into text + clickable [m:ss] timestamp tokens. */
export function parseAnswerSegments(answer: string): AnswerSegment[] {
  const segments: AnswerSegment[] = [];
  const re = /\[(\d{1,2}:\d{2}(?::\d{2})?)\]/g;
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
