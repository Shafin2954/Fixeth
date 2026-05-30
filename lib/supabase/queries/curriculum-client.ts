import { createClient } from "@/lib/supabase/client";
import type { Module } from "@/types/ui";
import type { Enrollment, Track } from "@/types";

export type ClientEnrollment = Enrollment & { track: Track | null };

function formatDuration(mins: number | null | undefined): string {
  const m = mins ?? 15;
  return `${m}:00`;
}

export async function fetchActiveEnrollmentClient(
  userId: string
): Promise<ClientEnrollment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("enrollments")
    .select("*, track:tracks(*)")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("enrolled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchActiveEnrollmentClient]", error.message);
    return null;
  }
  if (!data) return null;

  const row = data as Enrollment & { track: Track | Track[] | null };
  const track = Array.isArray(row.track) ? row.track[0] : row.track;
  return { ...row, track: track ?? null };
}

export async function fetchCurriculumForTrack(
  trackId: string,
  completedLessonIds: string[],
  lang: string
): Promise<Module[]> {
  const supabase = createClient();

  const { data: modules, error: modErr } = await supabase
    .from("modules")
    .select("*")
    .eq("track_id", trackId)
    .order("order_index");

  if (modErr || !modules?.length) {
    if (modErr) console.error("[fetchCurriculumForTrack]", modErr.message);
    return [];
  }

  const moduleIds = modules.map((m) => m.id as string);
  const { data: lessons, error: lesErr } = await supabase
    .from("lessons")
    .select("*")
    .in("module_id", moduleIds)
    .order("order_index");

  if (lesErr) {
    console.error("[fetchCurriculumForTrack lessons]", lesErr.message);
    return [];
  }

  const byModule = new Map<string, typeof lessons>();
  for (const lesson of lessons || []) {
    const mid = lesson.module_id as string;
    const list = byModule.get(mid) || [];
    list.push(lesson);
    byModule.set(mid, list);
  }

  return modules.map((mod) => {
    const modLessons = byModule.get(mod.id as string) || [];
    return {
      id: mod.id as string,
      title:
        lang === "bn" && mod.title_bn
          ? (mod.title_bn as string)
          : (mod.title_en as string),
      lessons: modLessons.map((les) => ({
        id: les.id as string,
        title:
          lang === "bn" && les.title_bn
            ? (les.title_bn as string)
            : (les.title_en as string),
        done: completedLessonIds.includes(les.id as string),
        dur: formatDuration(les.estimated_mins as number | null),
        youtubeVideoId: les.youtube_video_id as string | null
      }))
    } satisfies Module;
  });
}

export async function fetchCompletedLessonIdsClient(userId: string): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("completed", true);

  if (error) {
    console.error("[fetchCompletedLessonIdsClient]", error.message);
    return [];
  }
  return (data || []).map((r) => r.lesson_id as string);
}

export type CompletedProgressRow = {
  lesson_id: string;
  completed_at: string;
};

export async function fetchCompletedProgressInRangeClient(
  userId: string,
  sinceIso: string
): Promise<CompletedProgressRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("progress")
    .select("lesson_id,completed_at")
    .eq("user_id", userId)
    .eq("completed", true)
    .not("completed_at", "is", null)
    .gte("completed_at", sinceIso)
    .order("completed_at", { ascending: true });

  if (error) {
    console.error("[fetchCompletedProgressInRangeClient]", error.message);
    return [];
  }

  return (data || []) as CompletedProgressRow[];
}

export async function fetchFirstLessonIdClient(trackId: string): Promise<string | null> {
  const supabase = createClient();
  const { data: modules } = await supabase
    .from("modules")
    .select("id")
    .eq("track_id", trackId)
    .order("order_index")
    .limit(1);

  if (!modules?.[0]) return null;

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("module_id", modules[0].id)
    .order("order_index")
    .limit(1)
    .maybeSingle();

  return (lesson?.id as string) ?? null;
}
