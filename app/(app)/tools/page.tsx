"use client";

import ToolsScreen from "@/components/screens/Tools";
import { useAppTheme } from "@/components/providers/app-theme-provider";

export default function ToolsPage() {
  const { T, t } = useAppTheme();
  return <ToolsScreen T={T} t={t} />;
}
