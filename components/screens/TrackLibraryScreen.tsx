"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import type { Track } from "@/types";
import { enrollInTrackClient } from "@/lib/supabase/queries/enroll-client";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { themeVars } from "@/lib/ui/theme-vars";
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
    <div style={themeVars(T as any)} className="flex-1 overflow-y-auto bg-[var(--t-bg0)]">
      <div className="mx-auto max-w-[1040px] px-4 pb-12 pt-6">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-[var(--t-txt1)] no-underline"
        >
          <ArrowLeft size={14} />
          {lang === "bn" ? "ড্যাশবোর্ড" : "Dashboard"}
        </Link>

        <h1 className="mb-2 text-2xl font-black text-[var(--t-txt0)]">
          {lang === "bn" ? "ট্র্যাক লাইব্রেরি" : "Track library"}
        </h1>
        <p className="mb-5 max-w-[560px] text-[13px] text-[var(--t-txt1)]">
          {lang === "bn"
            ? "উপলব্ধ সব কোর্স দেখুন এবং যেকোনো প্রকাশিত ট্র্যাকে ভর্তি হন।"
            : "Browse all available courses and enroll in any published track."}
        </p>

        {message && (
          <div
            className={`mb-4 rounded-lg border px-3.5 py-2.5 text-xs font-semibold ${
              message.type === "ok"
                ? "border-[var(--t-accent)] bg-[var(--t-accent)]/15 text-[var(--t-accent)]"
                : "border-[#FF5B5B] bg-[#FF5B5B22] text-[#FF5B5B]"
            }`}
          >
            {message.text}
          </div>
        )}

        <section className="mb-8">
          <h2 className="mb-3 text-sm font-extrabold text-[var(--t-txt0)]">
            {lang === "bn" ? "ভর্তির জন্য উন্মুক্ত" : "Open for enrollment"} ({published.length})
          </h2>
          {published.length === 0 ? (
            <p className="text-[13px] text-[var(--t-txt1)]">
              {lang === "bn" ? "কোনো প্রকাশিত ট্র্যাক নেই।" : "No published tracks yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {published.map((track) => (
                <TrackCard
                  key={track.id}
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
            <h2 className="mb-3 text-sm font-extrabold text-[var(--t-txt1)]">
              {lang === "bn" ? "শীঘ্রই আসছে" : "Coming soon"} ({comingSoon.length})
            </h2>
            <div className="grid grid-cols-1 gap-3.5 opacity-75 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {comingSoon.map((track) => (
                <TrackCard
                  key={track.id}
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
  lang,
  track,
  isEnrolled,
  isEnrolling,
  onEnroll,
  disabled
}: {
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
    <article className="flex flex-col gap-2.5 rounded-xl border border-[var(--t-border)] bg-[var(--t-bg1)] p-[18px] shadow-[var(--t-shadow)]">
      <div className="flex items-start justify-between">
        <span className="text-[28px]">{icon}</span>
        <span className="rounded-md bg-[var(--t-accent-dim)] px-2 py-[3px] text-[10px] font-extrabold text-[var(--t-accent)]">
          {lang === "bn" ? tierLabel.bn : tierLabel.en}
        </span>
      </div>
      <h3 className="m-0 text-[15px] font-extrabold leading-snug text-[var(--t-txt0)]">
        {title}
      </h3>
      {desc ? (
        <p className="m-0 text-xs leading-normal text-[var(--t-txt1)]">{desc}</p>
      ) : null}
      {skillsLabel ? (
        <p className="m-0 mt-2 text-[11px] leading-snug text-[var(--t-txt2)]">
          {lang === "bn" ? "দক্ষতা: " : "Skills: "}
          {skillsLabel}
        </p>
      ) : null}
      <p className="m-0 text-xs font-bold text-[var(--t-accent)]">{priceLabel}</p>

      {disabled ? (
        <span className="rounded-lg border border-dashed border-[var(--t-border)] p-2.5 text-center text-[11px] font-bold text-[var(--t-txt2)]">
          {lang === "bn" ? "শীঘ্রই" : "Coming soon"}
        </span>
      ) : isEnrolled ? (
        <Link
          href="/my-tracks"
          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border border-[var(--t-accent)] bg-[var(--t-bg3)] p-2.5 text-xs font-extrabold text-[var(--t-accent)] no-underline"
        >
          <CheckCircle2 size={14} />
          {lang === "bn" ? "ইতিমধ্যে ভর্তি" : "Enrolled — view"}
        </Link>
      ) : (
        <button
          type="button"
          disabled={isEnrolling}
          onClick={onEnroll}
          className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg border-none bg-[var(--t-accent)] p-2.5 text-xs font-extrabold text-black ${
            isEnrolling ? "cursor-wait opacity-80" : "cursor-pointer"
          }`}
        >
          {isEnrolling ? <Loader2 size={14} className="animate-spin" /> : null}
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
