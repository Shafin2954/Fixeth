import { createClient } from "@/lib/supabase/server";

export async function getCompletedLessonIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
