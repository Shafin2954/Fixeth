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

/** Parse "m:ss" / "h:mm:ss" back into seconds. */
export function parseTimestamp(ts: string): number {
  const parts = ts.split(":").map((p) => Number(p.trim()));
  if (parts.some((n) => Number.isNaN(n))) return 0;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}
