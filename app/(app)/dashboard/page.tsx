"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import DashboardScreen from "@/components/screens/Dashboard";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";
import type { UserEvaluation } from "@/types/ui";

function readStoredEvaluation(): UserEvaluation | null {
  try {
    const raw = localStorage.getItem("fixeth.evaluation");
    return raw ? (JSON.parse(raw) as UserEvaluation) : null;
  } catch {
    return null;
  }
}

function subscribeEvaluation(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function DashboardPage() {
  const router = useRouter();
  const { T, t, lang, user, preferences } = useAppTheme();
  const { modules, activeLessonId, learnHref } = useCourse();
  const evaluation = useSyncExternalStore(
    subscribeEvaluation,
    readStoredEvaluation,
    () => null
  );

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
