"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useParams, useRouter } from "next/navigation";
import type { ChatMessage, DashboardStats, Module } from "@/types/ui";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import {
  fetchActiveEnrollmentClient,
  fetchCompletedLessonIdsClient,
  fetchCurriculumForTrack
} from "@/lib/supabase/queries/curriculum-client";
import {
  fetchEnrollmentForTrackClient,
  fetchTrackIdForLessonClient
} from "@/lib/supabase/queries/enroll-client";
import { normalizeUiTier, type UiTier } from "@/lib/tier/config";

type CourseContextValue = {
  modules: Module[];
  loading: boolean;
  enrollmentTrackId: string | null;
  activeTrackTier: UiTier;
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  openMods: Record<string, boolean>;
  setOpenMods: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  aiMsgs: ChatMessage[];
  setAiMsgs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handlePreviousLesson: () => void;
  handleNextLesson: () => void;
  activeModule: Module | undefined;
  activeLesson: Module["lessons"][number] | undefined;
  learnHref: string;
  dashboardStats: DashboardStats | null;
  refreshCurriculum: () => Promise<void>;
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
}

function parseLessonId(lessonParam: string | string[] | undefined): string | null {
  const raw = Array.isArray(lessonParam) ? lessonParam[0] : lessonParam;
  return raw && raw.length > 0 ? raw : null;
}

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const { authUser, profileRow, lang } = useAppTheme();

  const routeLessonId = parseLessonId(params?.lessonId);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentTrackId, setEnrollmentTrackId] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonIdState] = useState<string>("");
  const [openMods, setOpenMods] = useState<Record<string, boolean>>({});
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [activeTrackTier, setActiveTrackTier] = useState<UiTier>(1);
  const [aiMsgs, setAiMsgs] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "I am your Fixeth companion tutor. Ask me about this lesson!"
    }
  ]);

  const refreshCurriculum = useCallback(async () => {
    setLoading(true);

    let enrollment = await fetchActiveEnrollmentClient(authUser.id);
    if (routeLessonId) {
      const trackId = await fetchTrackIdForLessonClient(routeLessonId);
      if (trackId) {
        const byLesson = await fetchEnrollmentForTrackClient(authUser.id, trackId);
        if (byLesson) enrollment = byLesson;
      }
    }

    const completed = await fetchCompletedLessonIdsClient(authUser.id);
    setCompletedIds(completed);

    if (!enrollment?.track_id) {
      setModules([]);
      setEnrollmentTrackId(null);
      setActiveTrackTier(1);
      setDashboardStats(null);
      setLoading(false);
      return;
    }

    setEnrollmentTrackId(enrollment.track_id);
    setActiveTrackTier(
      normalizeUiTier(enrollment.track?.tier ?? 1)
    );
    const curriculum = await fetchCurriculumForTrack(
      enrollment.track_id,
      completed,
      lang
    );
    setModules(curriculum);

    const firstOpen: Record<string, boolean> = {};
    if (curriculum[0]) firstOpen[curriculum[0].id] = true;
    setOpenMods((prev) => ({ ...firstOpen, ...prev }));

    const totalLessons = curriculum.reduce((n, m) => n + m.lessons.length, 0);
    const trackTitle =
      lang === "bn" && enrollment.track?.title_bn
        ? enrollment.track.title_bn
        : enrollment.track?.title_en || "Your track";

    setDashboardStats({
      progressPercent: Number(enrollment.progress_percent) || 0,
      lessonsCompleted: completed.length,
      totalLessons,
      streak: profileRow?.streak ?? 0,
      trackTitle,
      currentLessonId: enrollment.current_lesson_id ?? null
    });

    const defaultLesson =
      routeLessonId ||
      enrollment.current_lesson_id ||
      curriculum[0]?.lessons[0]?.id ||
      "";
    setActiveLessonIdState(defaultLesson);
    setLoading(false);
  }, [authUser.id, lang, profileRow?.streak, routeLessonId]);

  useEffect(() => {
    void refreshCurriculum();
  }, [refreshCurriculum]);

  useEffect(() => {
    if (routeLessonId && routeLessonId !== activeLessonId) {
      setActiveLessonIdState(routeLessonId);
    }
  }, [routeLessonId, activeLessonId]);

  const modulesWithActive = useMemo(
    () =>
      modules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((les) => ({
          ...les,
          active: les.id === activeLessonId,
          done: completedIds.includes(les.id)
        }))
      })),
    [modules, activeLessonId, completedIds]
  );

  const setActiveLessonId = useCallback(
    (id: string) => {
      setActiveLessonIdState(id);
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/learn")) {
        router.replace(`/learn/${id}`);
      } else {
        router.push(`/learn/${id}`);
      }
    },
    [router]
  );

  const handlePreviousLesson = useCallback(() => {
    const allLessons: { id: string; modId: string }[] = [];
    modulesWithActive.forEach((m) => {
      m.lessons.forEach((l) => {
        allLessons.push({ id: l.id, modId: m.id });
      });
    });
    const currIdx = allLessons.findIndex((item) => item.id === activeLessonId);
    if (currIdx > 0) {
      const prevItem = allLessons[currIdx - 1];
      setActiveLessonId(prevItem.id);
      setOpenMods((prev) => ({ ...prev, [prevItem.modId]: true }));
    }
  }, [activeLessonId, modulesWithActive, setActiveLessonId]);

  const handleNextLesson = useCallback(() => {
    const allLessons: { id: string; modId: string }[] = [];
    modulesWithActive.forEach((m) => {
      m.lessons.forEach((l) => {
        allLessons.push({ id: l.id, modId: m.id });
      });
    });
    const currIdx = allLessons.findIndex((item) => item.id === activeLessonId);
    if (currIdx < allLessons.length - 1) {
      const nextItem = allLessons[currIdx + 1];
      setActiveLessonId(nextItem.id);
      setOpenMods((prev) => ({ ...prev, [nextItem.modId]: true }));
    }
  }, [activeLessonId, modulesWithActive, setActiveLessonId]);

  const activeModule =
    modulesWithActive.find((mod) =>
      mod.lessons.some((lesson) => lesson.id === activeLessonId)
    ) ?? modulesWithActive[0];
  const activeLesson =
    activeModule?.lessons.find((lesson) => lesson.id === activeLessonId) ??
    activeModule?.lessons[0];

  const learnHref = activeLessonId ? `/learn/${activeLessonId}` : "/learn";

  const value = useMemo(
    () => ({
      modules: modulesWithActive,
      loading,
      enrollmentTrackId,
      activeTrackTier,
      activeLessonId,
      setActiveLessonId,
      openMods,
      setOpenMods,
      aiMsgs,
      setAiMsgs,
      handlePreviousLesson,
      handleNextLesson,
      activeModule,
      activeLesson,
      learnHref,
      dashboardStats,
      refreshCurriculum
    }),
    [
      modulesWithActive,
      loading,
      enrollmentTrackId,
      activeTrackTier,
      activeLessonId,
      setActiveLessonId,
      openMods,
      aiMsgs,
      handlePreviousLesson,
      handleNextLesson,
      activeModule,
      activeLesson,
      learnHref,
      dashboardStats,
      refreshCurriculum
    ]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}
