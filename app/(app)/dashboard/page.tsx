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
  const { T, t, lang, user, preferences, profileRow } = useAppTheme();
  const { modules, activeLessonId, dashboardStats, loading } = useCourse();
  const evaluation = useSyncExternalStore(
    subscribeEvaluation,
    readStoredEvaluation,
    () => null
  );

  const continueHref = dashboardStats?.currentLessonId
    ? `/learn/${dashboardStats.currentLessonId}`
    : activeLessonId
      ? `/learn/${activeLessonId}`
      : "/learn";

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
      dashboardStats={dashboardStats}
      streak={profileRow?.streak ?? dashboardStats?.streak ?? 0}
      loading={loading}
      onContinue={() => router.push(continueHref)}
      onStartAssessment={() => router.push("/onboarding")}
      onMyTracks
      onTrackLibrary
    />
  );
}
