import { createClient } from "@/lib/supabase/server";
import type { Lesson } from "@/types";

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index");

  if (error) {
    console.error("[getLessonsByModule]", error.message);
    return [];
  }
  return (data as Lesson[]) || [];
}

export async function getLessonById(id: string): Promise<Lesson | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getLessonById]", error.message);
    return null;
  }
  return data as Lesson | null;
}

export async function getLessonWithTrack(
  lessonId: string
): Promise<{ lesson: Lesson; trackId: string } | null> {
  const supabase = await createClient();
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*, module:modules(track_id)")
    .eq("id", lessonId)
    .maybeSingle();

  if (error || !lesson) {
    if (error) console.error("[getLessonWithTrack]", error.message);
    return null;
  }

  const mod = lesson.module as { track_id: string } | { track_id: string }[] | null;
  const trackId = Array.isArray(mod) ? mod[0]?.track_id : mod?.track_id;
  if (!trackId) return null;

  const { module, ...lessonRow } = lesson;
  void module;
  return { lesson: lessonRow as Lesson, trackId };
}
