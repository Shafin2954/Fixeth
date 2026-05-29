import { createClient } from "@/lib/supabase/client";
import { normalizeUiTier, type UiTier } from "@/lib/tier/config";
import type { Enrollment, Track } from "@/types";
import { fetchFirstLessonIdClient } from "@/lib/supabase/queries/curriculum-client";

export type EnrollmentWithTrack = Enrollment & { track: Track | null };

export async function fetchUserEnrollmentsClient(
  userId: string
): Promise<EnrollmentWithTrack[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, track:tracks(*)")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("enrolled_at", { ascending: false });

  if (error) {
    console.error("[fetchUserEnrollmentsClient]", error.message);
    return [];
  }

  return (data || []).map((row) => {
    const r = row as Enrollment & { track: Track | Track[] | null };
    const track = Array.isArray(r.track) ? r.track[0] : r.track;
    return { ...r, track: track ?? null };
  });
}

export async function fetchAllTracksClient(): Promise<Track[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("tier")
    .order("title_en");

  if (error) {
    console.error("[fetchAllTracksClient]", error.message);
    return [];
  }
  return (data as Track[]) || [];
}

export async function fetchTrackIdForLessonClient(
  lessonId: string
): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("module:modules(track_id)")
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !data) return null;
  const mod = data.module as { track_id: string } | { track_id: string }[] | null;
  const trackId = Array.isArray(mod) ? mod[0]?.track_id : mod?.track_id;
  return trackId ?? null;
}

export async function fetchEnrollmentForTrackClient(
  userId: string,
  trackId: string
): Promise<EnrollmentWithTrack | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, track:tracks(*)")
    .eq("user_id", userId)
    .eq("track_id", trackId)
    .maybeSingle();

  if (error) {
    console.error("[fetchEnrollmentForTrackClient]", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Enrollment & { track: Track | Track[] | null };
  const track = Array.isArray(row.track) ? row.track[0] : row.track;
  return { ...row, track: track ?? null };
}

export type EnrollResult =
  | { ok: true; enrollment: Enrollment; firstLessonId: string | null }
  | { ok: false; error: string };

export async function enrollInTrackClient(
  userId: string,
  trackId: string,
  options?: { setUiTier?: boolean; trackTier?: UiTier }
): Promise<EnrollResult> {
  const supabase = createClient();

  const { data: track, error: trackErr } = await supabase
    .from("tracks")
    .select("id, tier, published")
    .eq("id", trackId)
    .maybeSingle();

  if (trackErr || !track) {
    return { ok: false, error: trackErr?.message || "Track not found." };
  }

  if (!track.published) {
    return { ok: false, error: "This track is not open for enrollment yet." };
  }

  const firstLessonId = await fetchFirstLessonIdClient(trackId);

  const existing = await fetchEnrollmentForTrackClient(userId, trackId);
  if (existing) {
    const lessonId = existing.current_lesson_id ?? firstLessonId;
    if (!existing.current_lesson_id && lessonId) {
      await supabase
        .from("enrollments")
        .update({ current_lesson_id: lessonId })
        .eq("id", existing.id);
    }
    if (options?.setUiTier !== false) {
      const tier = normalizeUiTier(options?.trackTier ?? track.tier);
      await supabase.from("users").update({ ui_tier: tier }).eq("id", userId);
    }
    return { ok: true, enrollment: existing, firstLessonId: lessonId };
  }

  const { data: enrollment, error: enrollErr } = await supabase
    .from("enrollments")
    .insert({
      user_id: userId,
      track_id: trackId,
      current_lesson_id: firstLessonId,
      progress_percent: 0
    })
    .select()
    .single();

  if (enrollErr || !enrollment) {
    return { ok: false, error: enrollErr?.message || "Could not create enrollment." };
  }

  if (options?.setUiTier !== false) {
    const tier = normalizeUiTier(options?.trackTier ?? track.tier);
    const { error: userErr } = await supabase
      .from("users")
      .update({ ui_tier: tier, last_active: new Date().toISOString() })
      .eq("id", userId);
    if (userErr) {
      console.error("[enrollInTrackClient] ui_tier update", userErr.message);
    }
  }

  return {
    ok: true,
    enrollment: enrollment as Enrollment,
    firstLessonId
  };
}
