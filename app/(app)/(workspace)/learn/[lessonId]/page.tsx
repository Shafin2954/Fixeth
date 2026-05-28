"use client";

import GuidedVideoScreen from "@/components/screens/GuidedVideo";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";

export default function LearnPage() {
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
    <GuidedVideoScreen
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
