import { createClient } from "@/lib/supabase/server";
import type { Enrollment, Track } from "@/types";

export type EnrollmentWithTrack = Enrollment & { track: Track | null };

export async function getUserEnrollments(userId: string): Promise<EnrollmentWithTrack[]> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
