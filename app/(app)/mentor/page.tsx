"use client";

import AIMentorScreen from "@/components/screens/AIMentor";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";

export default function MentorPage() {
  const { T, t, lang } = useAppTheme();
  const { aiMsgs, setAiMsgs } = useCourse();

  return (
    <AIMentorScreen T={T} t={t} lang={lang} aiMsgs={aiMsgs} setAiMsgs={setAiMsgs} />
  );
}
