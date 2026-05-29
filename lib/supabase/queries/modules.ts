import { createClient } from "@/lib/supabase/server";
import type { Lesson, Module } from "@/types";

export type ModuleWithLessons = Module & { lessons: Lesson[] };

export async function getModulesWithLessonsByTrack(
  trackId: string
): Promise<ModuleWithLessons[]> {
  const supabase = await createClient();

  const { data: modules, error: modErr } = await supabase
    .from("modules")
    .select("*")
    .eq("track_id", trackId)
    .order("order_index");

  if (modErr || !modules?.length) {
    if (modErr) console.error("[getModulesWithLessonsByTrack]", modErr.message);
    return [];
  }

  const moduleIds = modules.map((m) => m.id);
  const { data: lessons, error: lesErr } = await supabase
    .from("lessons")
    .select("*")
    .in("module_id", moduleIds)
    .order("order_index");

  if (lesErr) {
    console.error("[getModulesWithLessonsByTrack lessons]", lesErr.message);
    return modules.map((m) => ({ ...(m as Module), lessons: [] }));
  }

  const byModule = new Map<string, Lesson[]>();
  for (const lesson of (lessons || []) as Lesson[]) {
    const list = byModule.get(lesson.module_id) || [];
    list.push(lesson);
    byModule.set(lesson.module_id, list);
  }

  return (modules as Module[]).map((m) => ({
    ...m,
    lessons: byModule.get(m.id) || []
  }));
}

export async function getFirstLessonIdForTrack(trackId: string): Promise<string | null> {
  const modules = await getModulesWithLessonsByTrack(trackId);
  for (const mod of modules) {
    if (mod.lessons.length > 0) {
      return mod.lessons[0].id;
    }
  }
  return null;
}

export async function countLessonsInTrack(trackId: string): Promise<number> {
  const modules = await getModulesWithLessonsByTrack(trackId);
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}
