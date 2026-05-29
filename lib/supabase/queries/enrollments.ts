import { createClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Enrollment, Track } from "@/types";

export type EnrollmentWithTrack = Enrollment & { track: Track | null };

export async function getUserEnrollments(userId: string): Promise<EnrollmentWithTrack[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, track:tracks(*)")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("[getUserEnrollments]", error.message);
    return [];
  }

  return (data || []).map((row) => {
    const r = row as Enrollment & { track: Track | Track[] | null };
    const track = Array.isArray(r.track) ? r.track[0] : r.track;
    return { ...r, track: track ?? null };
  });
}

export async function getActiveEnrollment(userId: string): Promise<EnrollmentWithTrack | null> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, track:tracks(*)")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[getActiveEnrollment]", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Enrollment & { track: Track | Track[] | null };
  const track = Array.isArray(row.track) ? row.track[0] : row.track;
  return { ...row, track: track ?? null };
}

export async function createEnrollment(
  userId: string,
  trackId: string,
  currentLessonId: string | null
): Promise<Enrollment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .upsert(
      {
        user_id: userId,
        track_id: trackId,
        current_lesson_id: currentLessonId,
        progress_percent: 0
      },
      { onConflict: "user_id,track_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("[createEnrollment]", error.message);
    return null;
  }
  return data as Enrollment;
}

export async function updateEnrollmentProgress(
  userId: string,
  trackId: string,
  progressPercent: number,
  currentLessonId?: string | null
): Promise<void> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {
    progress_percent: Math.min(100, Math.max(0, progressPercent))
  };
  if (currentLessonId !== undefined) {
    payload.current_lesson_id = currentLessonId;
  }

  const { error } = await supabase
    .from("enrollments")
    .update(payload)
    .eq("user_id", userId)
    .eq("track_id", trackId);

  if (error) console.error("[updateEnrollmentProgress]", error.message);
}
