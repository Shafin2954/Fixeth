"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";
import { useParams, useRouter } from "next/navigation";
import type { ChatMessage, Module } from "@/types/ui";
import { CORE_MODULES, DEFAULT_LESSON_ID } from "@/lib/course/constants";

type CourseContextValue = {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  activeLessonId: number;
  setActiveLessonId: (id: number) => void;
  openMods: Record<number, boolean>;
  setOpenMods: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  aiMsgs: ChatMessage[];
  setAiMsgs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handlePreviousLesson: () => void;
  handleNextLesson: () => void;
  activeModule: Module | undefined;
  activeLesson: Module["lessons"][number] | undefined;
  learnHref: string;
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function useCourse() {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error("useCourse must be used within CourseProvider");
  return ctx;
}

function parseLessonId(lessonParam: string | string[] | undefined): number {
  const raw = Array.isArray(lessonParam) ? lessonParam[0] : lessonParam;
  const parsed = raw ? Number(raw) : DEFAULT_LESSON_ID;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_LESSON_ID;
}

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const params = useParams();
  const activeLessonId = parseLessonId(params?.lessonId);

  const [baseModules, setBaseModules] = useState<Module[]>(CORE_MODULES);
  const [openMods, setOpenMods] = useState<Record<number, boolean>>({ 1: true, 2: false });
  const [aiMsgs, setAiMsgs] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "I am your Fixeth companion tutor. Let us review the Python Scope blocks!"
    }
  ]);

  const modules = useMemo(
    () =>
      baseModules.map((mod) => ({
        ...mod,
        lessons: mod.lessons.map((les) => ({
          ...les,
          active: les.id === activeLessonId
        }))
      })),
    [activeLessonId, baseModules]
  );

  const setModules: React.Dispatch<React.SetStateAction<Module[]>> = setBaseModules;

  const setActiveLessonId = useCallback(
    (id: number) => {
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/learn")) {
        router.replace(`/learn/${id}`);
      } else {
        router.push(`/learn/${id}`);
      }
    },
    [router]
  );

  const handlePreviousLesson = useCallback(() => {
    const allLessons: { id: number; modId: number }[] = [];
    modules.forEach((m) => {
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
  }, [activeLessonId, modules, setActiveLessonId]);

  const handleNextLesson = useCallback(() => {
    const allLessons: { id: number; modId: number }[] = [];
    modules.forEach((m) => {
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
  }, [activeLessonId, modules, setActiveLessonId]);

  const activeModule =
    modules.find((mod) => mod.lessons.some((lesson) => lesson.id === activeLessonId)) ?? modules[0];
  const activeLesson =
    activeModule?.lessons.find((lesson) => lesson.id === activeLessonId) ?? activeModule?.lessons[0];

  const value = useMemo(
    () => ({
      modules,
      setModules,
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
      learnHref: `/learn/${activeLessonId}`
    }),
    [
      modules,
      setModules,
      activeLessonId,
      setActiveLessonId,
      openMods,
      setOpenMods,
      aiMsgs,
      setAiMsgs,
      handlePreviousLesson,
      handleNextLesson,
      activeModule,
      activeLesson
    ]
  );

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}
