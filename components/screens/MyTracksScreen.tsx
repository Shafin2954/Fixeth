"use client";

import Link from "next/link";
import { BookOpen, Library, Play } from "lucide-react";
import type { EnrollmentWithTrack } from "@/lib/supabase/queries/enroll-client";

const TIER_LABEL: Record<number, { en: string; bn: string }> = {
  1: { en: "Tier 1 · Essentials", bn: "টিয়ার ১ · প্রয়োজনীয়" },
  2: { en: "Tier 2 · Foundations", bn: "টিয়ার ২ · ভিত্তি" },
  3: { en: "Tier 3 · Professional", bn: "টিয়ার ৩ · পেশাদার" }
};

export default function MyTracksScreen({
  T,
  lang,
  enrollments,
  loading,
  onRefresh
}: {
  T: Record<string, string>;
  lang: string;
  enrollments: EnrollmentWithTrack[];
  loading: boolean;
  onRefresh?: () => void;
}) {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px 48px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 24
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: T.txt0 }}>
              {lang === "bn" ? "আমার সক্রিয় ট্র্যাক" : "My Active Tracks"}
            </h1>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: T.txt1, maxWidth: 520 }}>
              {lang === "bn"
                ? "আপনি যে কোর্সগুলোতে ভর্তি আছেন সেগুলো এখানে দেখুন এবং যেকোনো ট্র্যাক থেকে শেখা চালিয়ে যান।"
                : "See every track you are enrolled in and jump back into any course."}
            </p>
          </div>
          <Link
            href="/tracks"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 16px",
              borderRadius: 8,
              background: T.accent,
              color: "#000",
              fontWeight: 800,
              fontSize: 12,
              textDecoration: "none"
            }}
          >
            <Library size={16} />
            {lang === "bn" ? "ট্র্যাক লাইব্রেরি" : "Browse track library"}
          </Link>
        </div>

        {loading ? (
          <p style={{ color: T.txt1, fontSize: 13 }}>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</p>
        ) : enrollments.length === 0 ? (
          <div
            style={{
              background: T.bg1,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: 32,
              textAlign: "center"
            }}
          >
            <BookOpen size={40} color={T.txt2} style={{ marginBottom: 12 }} />
            <p style={{ color: T.txt0, fontWeight: 700, margin: "0 0 8px" }}>
              {lang === "bn" ? "কোনো সক্রিয় ট্র্যাক নেই" : "No active enrollments yet"}
            </p>
            <p style={{ color: T.txt1, fontSize: 13, margin: "0 0 20px" }}>
              {lang === "bn"
                ? "ট্র্যাক লাইব্রেরি থেকে একটি কোর্স বেছে নিন।"
                : "Pick a course from the track library to get started."}
            </p>
            <Link
              href="/tracks"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: 8,
                background: T.accent,
                color: "#000",
                fontWeight: 800,
                fontSize: 13,
                textDecoration: "none"
              }}
            >
              {lang === "bn" ? "ট্র্যাক বেছে নিন" : "Explore tracks"}
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {enrollments.map((en) => {
              const track = en.track;
              const title =
                lang === "bn" && track?.title_bn ? track.title_bn : track?.title_en || "Track";
              const tier = track?.tier ?? 1;
              const tierLabel = TIER_LABEL[tier] || TIER_LABEL[1];
              const continueHref = en.current_lesson_id
                ? `/learn/${en.current_lesson_id}`
                : "/learn";

              return (
                <article
                  key={en.id}
                  style={{
                    background: T.bg1,
                    border: `1px solid ${T.border}`,
                    borderRadius: 12,
                    padding: 18,
                    boxShadow: T.shadow,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ flex: "1 1 240px" }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: T.accent,
                        textTransform: "uppercase",
                        letterSpacing: 0.5
                      }}
                    >
                      {lang === "bn" ? tierLabel.bn : tierLabel.en}
                    </span>
                    <h2 style={{ margin: "6px 0 4px", fontSize: 17, fontWeight: 800, color: T.txt0 }}>
                      {title}
                    </h2>
                    <p style={{ margin: 0, fontSize: 12, color: T.txt1 }}>
                      {lang === "bn"
                        ? `অগ্রগতি ${Math.round(Number(en.progress_percent) || 0)}% · ভর্তি ${new Date(en.enrolled_at).toLocaleDateString()}`
                        : `${Math.round(Number(en.progress_percent) || 0)}% complete · Enrolled ${new Date(en.enrolled_at).toLocaleDateString()}`}
                    </p>
                    <div
                      style={{
                        marginTop: 10,
                        height: 6,
                        background: T.bg4,
                        borderRadius: 3,
                        overflow: "hidden",
                        maxWidth: 280
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, Number(en.progress_percent) || 0)}%`,
                          height: "100%",
                          background: T.accent,
                          borderRadius: 3
                        }}
                      />
                    </div>
                  </div>
                  <Link
                    href={continueHref}
                    onClick={() => onRefresh?.()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 16px",
                      borderRadius: 8,
                      background: T.accent,
                      color: "#000",
                      fontWeight: 800,
                      fontSize: 12,
                      textDecoration: "none",
                      flexShrink: 0
                    }}
                  >
                    <Play size={16} />
                    {lang === "bn" ? "শেখা চালিয়ে যান" : "Continue"}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
