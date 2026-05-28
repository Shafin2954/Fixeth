"use client";

import QuizScreen from "@/components/screens/Quiz";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";

export default function QuizPage() {
  const { T, t, lang } = useAppTheme();
  const {
    modules,
    openMods,
    setOpenMods,
    activeLessonId,
    setActiveLessonId,
    handlePreviousLesson,
    handleNextLesson,
    aiMsgs,
    setAiMsgs
  } = useCourse();

  return (
    <QuizScreen
      T={T}
      t={t}
      modules={modules}
      openMods={openMods}
      setOpenMods={setOpenMods}
      activeLessonId={activeLessonId}
      setActiveLessonId={setActiveLessonId}
      onPrevious={handlePreviousLesson}
      onNext={handleNextLesson}
      aiMsgs={aiMsgs}
      setAiMsgs={setAiMsgs}
      lang={lang}
    />
  );
}
