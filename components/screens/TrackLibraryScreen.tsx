"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import type { Track } from "@/types";
import { enrollInTrackClient } from "@/lib/supabase/queries/enroll-client";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import type { UiTier } from "@/lib/tier/config";
import LoadingCanvas from "@/components/ui/loading-canvas";

const TRACK_ICONS: Record<string, string> = {
  "digital-literacy": "💻",
  "data-science": "📊",
  "git-vcs": "🔀",
  "python-foundations": "🐍",
  "git-version-control": "🔀",
  "backend-development": "⚙️",
  "devops-cloud": "☁️",
  "fullstack-mern": "🚀",
  "basic-computer-skills": "🖥️",
  "internet-online-safety": "🔒",
  "smartphone-apps": "📱"
};

const TIER_LABEL: Record<number, { en: string; bn: string }> = {
  1: { en: "Tier 1", bn: "টিয়ার ১" },
  2: { en: "Tier 2", bn: "টিয়ার ২" },
  3: { en: "Tier 3", bn: "টিয়ার ৩" }
};

export default function TrackLibraryScreen({
  T,
  lang,
  tracks,
  enrolledTrackIds,
  userId,
  loading = false,
  onEnrolled
}: {
  T: Record<string, string>;
  lang: string;
  tracks: Track[];
  enrolledTrackIds: Set<string>;
  userId: string;
  loading?: boolean;
  onEnrolled: () => void;
}) {
  const router = useRouter();
  const { refreshProfile } = useAppTheme();
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (loading) {
    return <LoadingCanvas variant="library" />;
  }

  const handleEnroll = async (track: Track) => {
    if (!track.published) return;
    setEnrollingId(track.id);
    setMessage(null);

    const result = await enrollInTrackClient(userId, track.id, {
      trackTier: (track.tier ?? 1) as UiTier,
      setUiTier: true
    });

    setEnrollingId(null);

    if (!result.ok) {
      setMessage({ type: "err", text: result.error });
      return;
    }

    setMessage({
      type: "ok",
      text:
        lang === "bn"
          ? "সফলভাবে ভর্তি হয়েছে! শেখা শুরু করুন।"
          : "Enrolled successfully! Start learning."
    });
    await refreshProfile();
    onEnrolled();

    if (result.firstLessonId) {
      router.push(`/learn/${result.firstLessonId}`);
    } else {
      router.push("/my-tracks");
    }
  };

  const published = tracks.filter((t) => t.published);
  const comingSoon = tracks.filter((t) => !t.published);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 16px 48px" }}>
        <Link
          href="/dashboard"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: T.txt1,
            fontSize: 12,
            fontWeight: 600,
            textDecoration: "none",
            marginBottom: 16
          }}
        >
          <ArrowLeft size={14} />
          {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
        </Link>

        <h1 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 900, color: T.txt0 }}>
          {lang === "bn" ? "ট্র্যাক লাইব্রেরি" : "Track library"}
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: T.txt1, maxWidth: 560 }}>
          {lang === "bn"
            ? "উপলব্ধ সব কোর্স দেখুন এবং যেকোনো প্রকাশিত ট্র্যাকে ভর্তি হন।"
            : "Browse all available courses and enroll in any published track."}
        </p>

        {message && (
          <div
            style={{
              marginBottom: 16,
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              background: message.type === "ok" ? `${T.accent}22` : "#FF5B5B22",
              border: `1px solid ${message.type === "ok" ? T.accent : "#FF5B5B"}`,
              color: message.type === "ok" ? T.accent : "#FF5B5B"
            }}
          >
            {message.text}
          </div>
        )}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: T.txt0, marginBottom: 12 }}>
            {lang === "bn" ? "ভর্তির জন্য উন্মুক্ত" : "Open for enrollment"} ({published.length})
          </h2>
          {published.length === 0 ? (
            <p style={{ color: T.txt1, fontSize: 13 }}>
              {lang === "bn" ? "কোনো প্রকাশিত ট্র্যাক নেই।" : "No published tracks yet."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14
              }}
            >
              {published.map((track) => (
                <TrackCard
                  key={track.id}
                  T={T}
                  lang={lang}
                  track={track}
                  isEnrolled={enrolledTrackIds.has(track.id)}
                  isEnrolling={enrollingId === track.id}
                  onEnroll={() => void handleEnroll(track)}
                />
              ))}
            </div>
          )}
        </section>

        {comingSoon.length > 0 && (
          <section>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: T.txt1, marginBottom: 12 }}>
              {lang === "bn" ? "শীঘ্রই আসছে" : "Coming soon"} ({comingSoon.length})
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 14,
                opacity: 0.75
              }}
            >
              {comingSoon.map((track) => (
                <TrackCard
                  key={track.id}
                  T={T}
                  lang={lang}
                  track={track}
                  isEnrolled={enrolledTrackIds.has(track.id)}
                  isEnrolling={false}
                  disabled
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function TrackCard({
  T,
  lang,
  track,
  isEnrolled,
  isEnrolling,
  onEnroll,
  disabled
}: {
  T: Record<string, string>;
  lang: string;
  track: Track;
  isEnrolled: boolean;
  isEnrolling: boolean;
  onEnroll?: () => void;
  disabled?: boolean;
}) {
  const title = lang === "bn" && track.title_bn ? track.title_bn : track.title_en;
  const desc =
    lang === "bn" && track.description_bn ? track.description_bn : track.description_en || "";
  const tier = track.tier ?? 1;
  const tierLabel = TIER_LABEL[tier] || TIER_LABEL[1];
  const priceLabel = track.is_free
    ? lang === "bn"
      ? "বিনামূল্যে"
      : "Free"
    : `৳${(track.price_bdt ?? 0).toLocaleString("en-BD")}`;
  const icon = TRACK_ICONS[track.slug] || "📖";
  const skillsLabel = (track.skills || []).slice(0, 3).join(" · ");

  return (
    <article
      style={{
        background: T.bg1,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 18,
        boxShadow: T.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: T.accent,
            background: (T as { accentDim?: string }).accentDim ?? T.bg3,
            padding: "3px 8px",
            borderRadius: 6
          }}
        >
          {lang === "bn" ? tierLabel.bn : tierLabel.en}
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: T.txt0, lineHeight: 1.35 }}>
        {title}
      </h3>
      {desc ? (
        <p style={{ margin: 0, fontSize: 12, color: T.txt1, lineHeight: 1.45 }}>{desc}</p>
      ) : null}
      {skillsLabel ? (
        <p style={{ margin: "8px 0 0", fontSize: 11, color: T.txt2, lineHeight: 1.4 }}>
          {lang === "bn" ? "দক্ষতা: " : "Skills: "}
          {skillsLabel}
        </p>
      ) : null}
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.accent }}>{priceLabel}</p>

      {disabled ? (
        <span
          style={{
            textAlign: "center",
            padding: "10px",
            fontSize: 11,
            fontWeight: 700,
            color: T.txt2,
            border: `1px dashed ${T.border}`,
            borderRadius: 8
          }}
        >
          {lang === "bn" ? "শীঘ্রই" : "Coming soon"}
        </span>
      ) : isEnrolled ? (
        <Link
          href="/my-tracks"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px",
            borderRadius: 8,
            background: T.bg3,
            border: `1px solid ${T.accent}`,
            color: T.accent,
            fontWeight: 800,
            fontSize: 12,
            textDecoration: "none"
          }}
        >
          <CheckCircle2 size={14} />
          {lang === "bn" ? "ইতিমধ্যে ভর্তি" : "Enrolled — view"}
        </Link>
      ) : (
        <button
          type="button"
          disabled={isEnrolling}
          onClick={onEnroll}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "10px",
            borderRadius: 8,
            background: T.accent,
            border: "none",
            color: "#000",
            fontWeight: 800,
            fontSize: 12,
            cursor: isEnrolling ? "wait" : "pointer",
            opacity: isEnrolling ? 0.8 : 1
          }}
        >
          {isEnrolling ? <Loader2 size={14} /> : null}
          {isEnrolling
            ? lang === "bn"
              ? "ভর্তি হচ্ছে..."
              : "Enrolling..."
            : lang === "bn"
              ? "এখনই ভর্তি হন"
              : "Enroll now"}
        </button>
      )}
    </article>
  );
}
