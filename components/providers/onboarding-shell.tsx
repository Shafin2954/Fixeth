"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import {
  completeUserOnboarding,
  ensureUserProfileRow,
  ProfileQueryError,
  type OnboardingPayload
} from "@/lib/supabase/queries/profile";
import { themes } from "@/lib/ui/themes";
import { i18n } from "@/lib/i18n/messages";
import Onboarding from "@/components/screens/Onboarding";
import { DEFAULT_LESSON_ID } from "@/lib/course/constants";

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 6 ? normalized : "00C896";
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function OnboardingShell() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState("en");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) return;
      const user = data.session?.user ?? null;
      if (!user) {
        router.replace("/login");
        return;
      }
      setAuthUser(user);
      const row = await ensureUserProfileRow(user);
      if (row?.onboarding_complete) {
        router.replace("/dashboard");
        return;
      }
      if (row?.preferred_language) setLang(row.preferred_language);
      if (row?.preferred_theme) setIsDark(row.preferred_theme === "dark");
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const handleComplete = useCallback(
    async (data: OnboardingPayload) => {
      if (!authUser || isSaving) return;
      setSaveError(null);
      setIsSaving(true);
      if (data.lang) setLang(data.lang);

      try {
        await completeUserOnboarding(authUser, data);

        let lessonId = DEFAULT_LESSON_ID;
        if (typeof data.assessmentScore === "number") {
          lessonId = data.assessmentScore >= 2 ? 5 : data.assessmentScore === 1 ? 3 : 1;
        }

        router.replace("/dashboard");
        router.refresh();
        router.prefetch(`/learn/${lessonId}`);
      } catch (err) {
        const message =
          err instanceof ProfileQueryError
            ? err.message
            : "Could not save onboarding. Try again or check the browser console.";
        setSaveError(message);
        setIsSaving(false);
      }
    },
    [authUser, isSaving, router]
  );

  if (isLoading || !authUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0B0B0F] text-[#EEEEF8]">
        <div className="text-sm font-semibold text-[#00C896]">Loading Fixeth...</div>
      </main>
    );
  }

  const baseTheme = themes[isDark ? "dark" : "light"];
  const accent = "#00C896";
  const T = {
    ...baseTheme,
    accent,
    accentHi: accent,
    accentDim: toRgba(accent, 0.16)
  };
  const parentT = i18n[lang] || i18n.en;

  return (
    <>
      {saveError && (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            maxWidth: 480,
            padding: "10px 14px",
            borderRadius: 8,
            background: "#FF5B5B22",
            border: "1px solid #FF5B5B",
            color: "#FF5B5B",
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          {saveError}
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 500, color: T.txt1 }}>
            Apply migration{" "}
            <code style={{ fontSize: 10 }}>20260528_users_rls.sql</code> in Supabase if this
            persists.
          </div>
        </div>
      )}
      <Onboarding
        T={T}
        parentT={parentT}
        isDark={isDark}
        onComplete={(data) => void handleComplete(data)}
      />
    </>
  );
}
