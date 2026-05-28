"use client";

import CodeSpaceScreen from "@/components/screens/Codespace";
import { useAppTheme } from "@/components/providers/app-theme-provider";

export default function CodespacePage() {
  const { T, t, preferences } = useAppTheme();
  return <CodeSpaceScreen T={T} t={t} preferences={preferences} />;
}
