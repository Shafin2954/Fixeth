"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileSettingsScreen from "@/components/screens/ProfileSettings";
import {
  useAppTheme,
  type UserPreferences
} from "@/components/providers/app-theme-provider";

function ProfileSettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam === "profile" ||
    tabParam === "account" ||
    tabParam === "preferences" ||
    tabParam === "codespace" ||
    tabParam === "mentor" ||
    tabParam === "credentials" ||
    tabParam === "data"
      ? tabParam === "account"
        ? "profile"
        : tabParam
      : "profile";

  const {
    T,
    t,
    lang,
    isDark,
    user,
    setUser,
    preferences,
    setPreferences,
    setLang,
    setIsDark,
    DEFAULT_USER,
    DEFAULT_PREFERENCES,
    normalizePreferences
  } = useAppTheme();

  return (
    <ProfileSettingsScreen
      T={T}
      t={t}
      lang={lang}
      isDark={isDark}
      user={user}
      preferences={preferences}
      initialTab={initialTab}
      onBack={() => router.push("/dashboard")}
      onSaveUser={setUser}
      onSavePreferences={(nextPrefs) =>
        setPreferences(normalizePreferences(nextPrefs) as UserPreferences)
      }
      onResetPreferences={() => setPreferences(DEFAULT_PREFERENCES)}
      onExportProfileData={() => {
        const payload = { user, preferences, exportedAt: new Date().toISOString() };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `fixeth-profile-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }}
      onClearProfileData={() => {
        localStorage.removeItem("fixeth.userProfile");
        localStorage.removeItem("fixeth.userPreferences");
        setUser(DEFAULT_USER);
        setPreferences(DEFAULT_PREFERENCES);
      }}
      onSetLang={setLang}
      onToggleTheme={() => setIsDark((prev) => !prev)}
    />
  );
}

export default function ProfileSettingsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] text-[#EEEEF8]">
          <div className="text-sm font-semibold text-[#00C896]">Loading...</div>
        </main>
      }
    >
      <ProfileSettingsContent />
    </Suspense>
  );
}
