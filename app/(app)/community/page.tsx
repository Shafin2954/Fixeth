"use client";

import CommunityScreen from "@/components/screens/Community";
import { useAppTheme } from "@/components/providers/app-theme-provider";

export default function CommunityPage() {
  const { T, t, lang } = useAppTheme();
  return <CommunityScreen T={T} t={t} lang={lang} />;
}
