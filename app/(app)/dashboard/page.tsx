"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardScreen from "@/components/screens/Dashboard";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";
import type { UserEvaluation } from "@/types/ui";

export default function DashboardPage() {
  const router = useRouter();
  const { T, t, lang, user, preferences } = useAppTheme();
  const { modules, activeLessonId, learnHref } = useCourse();
  const [evaluation, setEvaluation] = useState<UserEvaluation | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("fixeth.evaluation");
      if (raw) setEvaluation(JSON.parse(raw) as UserEvaluation);
    } catch {
      setEvaluation(null);
    }
  }, []);

  return (
    <DashboardScreen
      T={T}
      t={t}
      lang={lang}
      user={user}
      evaluation={evaluation}
      modules={modules}
      activeLessonId={activeLessonId}
      weeklyGoal={preferences.weeklyGoal}
      onContinue={() => router.push(learnHref)}
      onStartAssessment={() => router.push("/onboarding")}
    />
  );
}
