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
 * Returns true when the stored chunks already carry meaningful per-segment
 * timing (more than one chunk with distinct, non-zero start_times).
 */
function hasRealTiming(chunks: TranscriptChunk[]): boolean {
  if (chunks.length <= 1) return false;
  const starts = chunks.map((c) => c.start_time ?? 0);
  const distinct = new Set(starts);
  return distinct.size > 1 && Math.max(...starts) > 0;
}

/**
 * Many lessons store the full transcript as a single chunk with start_time = 0,
 * so every citation collapses to 0:00. When real per-segment timing is missing,
 * we rebuild evenly-timed virtual segments by splitting the transcript into
 * word windows and mapping each window's position onto the real video duration.
 *
 * This gives Chat-with-Video and the Transcript tab plausible, clickable
 * timestamps (e.g. "git branch" near 40% of the video -> ~3:47 for a 10m clip).
 */
export function buildTimedSegments(
  chunks: TranscriptChunk[],
  durationSec: number,
  wordsPerSegment = 28
): TranscriptChunk[] {
  if (hasRealTiming(chunks)) return chunks;

  const full = chunks
    .map((c) => c.chunk_text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!full) return chunks;

  // Fall back to chunk end_time (or 0) when the player duration isn't known yet.
  const total =
    durationSec && durationSec > 0
      ? durationSec
      : Math.max(0, ...chunks.map((c) => c.end_time ?? 0));

  const lessonId = chunks[0]?.lesson_id ?? "lesson";
  const words = full.split(" ");
  const totalWords = words.length;

  if (totalWords === 0 || total <= 0) return chunks;

  const segments: TranscriptChunk[] = [];
  for (let i = 0; i < totalWords; i += wordsPerSegment) {
    const slice = words.slice(i, i + wordsPerSegment);
    const start = (i / totalWords) * total;
    const end = (Math.min(i + wordsPerSegment, totalWords) / totalWords) * total;
    segments.push({
      id: `${lessonId}-seg-${i}`,
      lesson_id: lessonId,
      chunk_text: slice.join(" "),
      start_time: start,
      end_time: end
    });
  }
  return segments;
}

/** Parse "m:ss" / "h:mm:ss" back into seconds. */
export function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map((p) => Number(p.trim()));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
