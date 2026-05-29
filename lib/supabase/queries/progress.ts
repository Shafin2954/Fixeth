import { createClient } from "@/lib/supabase/client";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { updateEnrollmentProgress } from "@/lib/supabase/queries/enrollments";

async function countLessonsInTrackClient(supabase: ReturnType<typeof createClient>, trackId: string) {
  const { data: modules } = await supabase.from("modules").select("id").eq("track_id", trackId);
  if (!modules?.length) return 0;
  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .in(
      "module_id",
      modules.map((m) => m.id)
    );
  return count ?? 0;
}

export async function getCompletedLessonIds(userId: string): Promise<string[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    console.error("[getCompletedLessonIds]", error.message);
    return [];
  }
  return (data || []).map((r) => r.lesson_id as string);
}

export async function getCompletedLessonCount(userId: string): Promise<number> {
  const supabase = await createServerClient();
  const { count, error } = await supabase
    .from("progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    console.error("[getCompletedLessonCount]", error.message);
    return 0;
  }
  return count ?? 0;
}

export async function markLessonComplete(
  userId: string,
  lessonId: string,
  trackId: string
): Promise<{ error?: string }> {
  const supabase = createClient();
  const now = new Date().toISOString();

  const { error: progressError } = await supabase.from("progress").upsert(
    {
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: now,
      watch_pct: 100
    },
    { onConflict: "user_id,lesson_id" }
  );

  if (progressError) {
    return { error: progressError.message };
  }

  const total = await countLessonsInTrackClient(supabase, trackId);

  const { data: modules } = await supabase.from("modules").select("id").eq("track_id", trackId);
  const moduleIds = (modules || []).map((m) => m.id);
  let lessonIds: string[] = [];
  if (moduleIds.length) {
    const { data: lessons } = await supabase
      .from("lessons")
      .select("id")
      .in("module_id", moduleIds);
    lessonIds = (lessons || []).map((l) => l.id as string);
  }

  let completedInTrack = 0;
  if (lessonIds.length) {
    const { count: completedCount, error: countError } = await supabase
      .from("progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("completed", true)
      .in("lesson_id", lessonIds);

    if (countError) {
      return { error: countError.message };
    }
    completedInTrack = completedCount ?? 0;
  }

  const pct = total > 0 ? Math.round((completedInTrack / total) * 100) : 0;
  await updateEnrollmentProgress(userId, trackId, pct, lessonId);

  return {};
}
