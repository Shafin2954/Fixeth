"use client";

import JobsScreen from "@/components/screens/Jobs";
import { useAppTheme } from "@/components/providers/app-theme-provider";

export default function JobsPage() {
  const { T, t, lang } = useAppTheme();
  return <JobsScreen T={T} t={t} lang={lang} />;
}
