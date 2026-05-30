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
import { fetchFirstLessonIdClient } from "@/lib/supabase/queries/curriculum-client";
import { themes } from "@/lib/ui/themes";
import { i18n } from "@/lib/i18n/messages";
import Onboarding from "@/components/screens/Onboarding";
import LoadingCanvas from "@/components/ui/loading-canvas";
import type { Track } from "@/types";
import type { UiTier } from "@/lib/tier/config";

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 6 ? normalized : "00C896";
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const TRACK_ICONS: Record<string, string> = {
  "digital-literacy": "💻",
  "data-science": "📊",
  "git-vcs": "🔀",
  "python-foundations": "🐍",
  "git-version-control": "🔀",
  "backend-development": "⚙️",
  "devops-cloud": "☁️",
  "fullstack-mern": "🚀"
};

export function OnboardingShell() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [publishedTracks, setPublishedTracks] = useState<Track[]>([]);
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

      const { data: tracks, error } = await supabase
        .from("tracks")
        .select("*")
        .eq("published", true)
        .order("tier")
        .order("title_en");

      if (!error && tracks?.length) {
        setPublishedTracks(tracks as Track[]);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router, supabase]);

  const handleComplete = useCallback(
    async (data: {
      lang: string;
      trackId: string;
      trackTier: UiTier;
      goal: string;
      level: string;
      assessmentScore?: number;
      assessmentPercentage?: number;
      skippedAssessment?: boolean;
    }) => {
      if (!authUser || isSaving) return;
      setSaveError(null);
      setIsSaving(true);
      if (data.lang) setLang(data.lang);

      try {
        const firstLessonId = await fetchFirstLessonIdClient(data.trackId);
        const payload: OnboardingPayload = {
          lang: data.lang,
          trackId: data.trackId,
          trackTier: data.trackTier,
          goal: data.goal,
          level: data.level,
          assessmentScore: data.assessmentScore,
          skippedAssessment: data.skippedAssessment,
          firstLessonId
        };

        await completeUserOnboarding(authUser, payload);

        if (typeof window !== "undefined") {
          const evaluation = {
            skipped: Boolean(data.skippedAssessment),
            score: data.assessmentScore,
            percentage: data.skippedAssessment ? undefined : data.assessmentPercentage ?? 0,
            completedAt: new Date().toISOString()
          };

          try {
            window.localStorage.setItem("fixeth.evaluation", JSON.stringify(evaluation));
          } catch {
            // Ignore localStorage write failures and continue the completion flow.
          }

          window.dispatchEvent(new Event("fixeth:evaluation-changed"));
        }

        router.replace("/dashboard");
        router.refresh();
        if (firstLessonId) {
          router.prefetch(`/learn/${firstLessonId}`);
        }
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
    return <LoadingCanvas variant="auth" />;
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

  const trackCards = publishedTracks.map((tr) => ({
    id: tr.id,
    slug: tr.slug,
    icon: TRACK_ICONS[tr.slug] || "📖",
    titleEn: tr.title_en,
    titleBn: tr.title_bn || tr.title_en,
    priceBdt: tr.price_bdt,
    isFree: tr.is_free,
    tier: tr.tier,
    completed: false
  }));

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
            Run migrations <code style={{ fontSize: 10 }}>20260529</code> and{" "}
            <code style={{ fontSize: 10 }}>20260530</code> in Supabase if this persists.
          </div>
        </div>
      )}
      <Onboarding
        T={T}
        parentT={parentT}
        isDark={isDark}
        tracks={trackCards}
        onComplete={(data) => void handleComplete(data)}
      />
    </>
  );
}
