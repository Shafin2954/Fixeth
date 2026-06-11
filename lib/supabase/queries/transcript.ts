import { createClient } from "@/lib/supabase/client";

export type TranscriptChunk = {
  id: string;
  lesson_id: string;
  chunk_text: string;
  start_time: number | null;
  end_time: number | null;
};

/**
 * Fetch the ordered transcript for a lesson. Used both for the Transcript tab
 * (clickable timestamps) and as the retrieval corpus for Chat with Video.
 */
export async function fetchTranscriptChunks(
  lessonId: string
): Promise<TranscriptChunk[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("transcript_chunks")
    .select("id, lesson_id, chunk_text, start_time, end_time")
    .eq("lesson_id", lessonId)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("[fetchTranscriptChunks]", error.message);
    return [];
  }
  return (data || []) as TranscriptChunk[];
}

/** Format seconds as m:ss (or h:mm:ss for long videos). */
export function formatSeconds(total: number | null | undefined): string {
  const s = Math.max(0, Math.floor(total ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
}

/**
 * Builds fine-grained, individually-timed transcript segments for citation.
 *
 * Each stored chunk carries a real time window [start_time, end_time] that the
 * chunk text was spoken over (e.g. 0 -> 97.6s). A single chunk can hold many
 * sentences, so citing the chunk's start_time alone collapses everything to one
 * timestamp. Here we split each chunk into small word windows and distribute
 * them proportionally across that chunk's own [start, end] range, producing
 * accurate, clickable timestamps without needing the player duration.
 *
 * Falls back to the player duration (or a ~0.4s/word estimate) only when a
 * chunk is missing a usable end_time.
 */
export function buildTimedSegments(
  chunks: TranscriptChunk[],
  durationSec = 0,
  wordsPerSegment = 16
): TranscriptChunk[] {
  if (!chunks.length) return chunks;

  const segments: TranscriptChunk[] = [];

  for (let ci = 0; ci < chunks.length; ci++) {
    const chunk = chunks[ci];
    const text = (chunk.chunk_text || "").replace(/\s+/g, " ").trim();
    if (!text) continue;

    const words = text.split(" ");
    const start = Math.max(0, chunk.start_time ?? 0);

    // Resolve a sensible end for this chunk's window.
    let end = chunk.end_time ?? 0;
    if (!end || end <= start) {
      const nextStart = chunks[ci + 1]?.start_time ?? 0;
      if (nextStart > start) end = nextStart;
      else if (durationSec > start) end = durationSec;
      else end = start + words.length * 0.4; // ~150 wpm estimate
    }

    const span = Math.max(1, end - start);

    // Short chunk: keep as a single segment.
    if (words.length <= wordsPerSegment) {
      segments.push({ ...chunk, start_time: start, end_time: end });
      continue;
    }

    for (let i = 0; i < words.length; i += wordsPerSegment) {
      const slice = words.slice(i, i + wordsPerSegment);
      const segStart = start + (i / words.length) * span;
      const segEnd =
        start + (Math.min(i + wordsPerSegment, words.length) / words.length) * span;
      segments.push({
        id: `${chunk.id}-${i}`,
        lesson_id: chunk.lesson_id,
        chunk_text: slice.join(" "),
        start_time: segStart,
        end_time: segEnd
      });
    }
  }

  return segments.length ? segments : chunks;
}

/** Parse "m:ss" / "h:mm:ss" back into seconds. */
export function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map((p) => Number(p.trim()));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

/**
 * Fetch topics with their associated transcript chunks for a lesson.
 * Uses the RPC function `get_lesson_topics_with_chunks` to get a flat list
 * of (topic, chunk) pairs, then groups by topic.
 */
export async function getTopicsWithChunks(
  lessonId: string
): Promise<Array<{
  topic_id: string;
  topic_label: string;
  topic_label_bn: string | null;
  start_time: number;
  end_time: number;
  order_index: number;
  chunks: TranscriptChunk[]
}>> {
  const supabase = createClient();
  const { data, error } = await supabase
    .rpc('get_lesson_topics_with_chunks', { p_lesson_id: lessonId });

  if (error) {
    console.error("[getTopicsWithChunks]", error.message);
    return [];
  }

  const rows = (data || []) as Array<{
    topic_id: string;
    topic_label: string;
    topic_label_bn: string | null;
    start_time: number;
    end_time: number;
    order_index: number;
    chunk_id: string;
    chunk_text: string;
    chunk_start: number;
    chunk_end: number;
  }>;

  // Group by topic_id
  const topicMap = new Map<string, Array<typeof rows[0]>>();
  for (const row of rows) {
    if (!topicMap.has(row.topic_id)) {
      topicMap.set(row.topic_id, []);
    }
    topicMap.get(row.topic_id)!.push(row);
  }

  const result: Array<{
    topic_id: string;
    topic_label: string;
    topic_label_bn: string | null;
    start_time: number;
    end_time: number;
    order_index: number;
    chunks: TranscriptChunk[]
  }> = [];

  for (const [topicId, topicRows] of topicMap) {
    // Sort chunks by chunk_start within the topic
    const sortedRows = topicRows.slice().sort((a, b) => a.chunk_start - b.chunk_start);
    const first = sortedRows[0];
    const chunks: TranscriptChunk[] = sortedRows.map(row => ({
      id: row.chunk_id,
      lesson_id: lessonId, // we know the lesson_id from the argument
      chunk_text: row.chunk_text,
      start_time: row.chunk_start,
      end_time: row.chunk_end
    }));

    result.push({
      topic_id: topicId,
      topic_label: first.topic_label,
      topic_label_bn: first.topic_label_bn,
      start_time: first.start_time,
      end_time: first.end_time,
      order_index: first.order_index,
      chunks
    });
  }

  // Sort topics by order_index
  result.sort((a, b) => a.order_index - b.order_index);
  return result;
}
