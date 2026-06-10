"use client";

import { useEffect, useMemo, useState } from "react";
import type { JobRoleMatch, JobSignal } from "@/types/ui";

type JobsApiResponse = {
  data?: {
    strongMatches: JobRoleMatch[];
    nearReadyMatches: JobRoleMatch[];
    learningGapMatches: JobRoleMatch[];
  };
  error?: string | null;
};

type SignalsApiResponse = {
  data?: {
    signals: JobSignal[];
  };
  error?: string | null;
};

function scoreColor(score: number, T: any) {
  if (score >= 85) return T.accent;
  if (score >= 70) return T.amber;
  return "#FF5B8A";
}

function MatchCard({
  match,
  T,
  lang
}: {
  match: JobRoleMatch;
  T: any;
  lang: string;
}) {
  const badgeText =
    match.readiness === "strong"
      ? lang === "bn"
        ? "আবেদনযোগ্য"
        : "Apply-ready"
      : match.readiness === "near_ready"
        ? lang === "bn"
          ? "প্রায় প্রস্তুত"
          : "Almost ready"
        : lang === "bn"
          ? "স্কিল গ্যাপ"
          : "Skill gap";

  return (
    <div
      style={{
        background: T.bg1,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 14,
        boxShadow: T.shadow
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
        <h4 style={{ margin: 0, color: T.txt0, fontSize: 13.5, fontWeight: 800 }}>{match.role}</h4>
        <span
          style={{
            background: `${scoreColor(match.matchPercentage, T)}22`,
            color: scoreColor(match.matchPercentage, T),
            border: `1px solid ${scoreColor(match.matchPercentage, T)}55`,
            borderRadius: 999,
            padding: "2px 8px",
            fontSize: 10,
            fontWeight: 800,
            whiteSpace: "nowrap"
          }}
        >
          {match.matchPercentage}%
        </span>
      </div>

      <div style={{ fontSize: 10.5, color: T.txt1, marginTop: 6 }}>
        {badgeText} • {lang === "bn" ? "প্রয়োজনীয় কাভারেজ" : "Required coverage"}: {match.requiredCoverage}%
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 10.5, color: T.txt1 }}>
          {lang === "bn" ? "ম্যাচড স্কিল" : "Matched skills"}: {match.matchedSkills.slice(0, 4).join(", ") || "-"}
        </div>
        <div style={{ fontSize: 10.5, color: "#FF8A3D", marginTop: 4 }}>
          {lang === "bn" ? "মিসিং" : "Missing"}: {[
            ...match.missingRequiredSkills,
            ...match.missingPreferredSkills
          ]
            .slice(0, 4)
            .join(", ") || "-"}
        </div>
      </div>

      {match.nextStep && (
        <div style={{ marginTop: 10, fontSize: 10.5, color: T.txt1 }}>
          {lang === "bn" ? "পরবর্তী পদক্ষেপ" : "Next step"}: {match.nextStep}
        </div>
      )}
    </div>
  );
}

export default function JobsScreen({ T, t, lang }: { T: any; t: any; lang: string }) {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<{
    strongMatches: JobRoleMatch[];
    nearReadyMatches: JobRoleMatch[];
    learningGapMatches: JobRoleMatch[];
  }>({ strongMatches: [], nearReadyMatches: [], learningGapMatches: [] });
  const [signals, setSignals] = useState<JobSignal[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const [matchesRes, signalsRes] = await Promise.all([
          fetch("/api/jobs/matches", { cache: "no-store" }),
          fetch("/api/jobs?limit=8", { cache: "no-store" })
        ]);

        const matchesJson = (await matchesRes.json()) as JobsApiResponse;
        const signalsJson = (await signalsRes.json()) as SignalsApiResponse;

        if (!mounted) return;

        setMatches(
          matchesJson.data || {
            strongMatches: [],
            nearReadyMatches: [],
            learningGapMatches: []
          }
        );
        setSignals(signalsJson.data?.signals || []);
      } catch {
        if (!mounted) return;
        setMatches({ strongMatches: [], nearReadyMatches: [], learningGapMatches: [] });
        setSignals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const strongest = useMemo(() => matches.strongMatches[0] || matches.nearReadyMatches[0], [matches]);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 16px 40px" }}>
        <div
          style={{
            background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}0d 100%)`,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: 20,
            marginBottom: 16,
            boxShadow: T.shadow
          }}
        >
          <h2 style={{ margin: 0, fontSize: 20, color: T.txt0, fontWeight: 900 }}>{t.jobs}</h2>
          <p style={{ margin: "6px 0 0", color: T.txt1, fontSize: 12 }}>
            {lang === "bn"
              ? "কোর্স অগ্রগতি ও বাংলাদেশের চাকরির বাজার মিলিয়ে আপনার জব ম্যাচ।"
              : "Your personalized job alignment using course progress and Bangladesh market demand."}
          </p>

          <div style={{ marginTop: 12, fontSize: 11.5, color: T.txt0 }}>
            {strongest
              ? lang === "bn"
                ? `সেরা ম্যাচ: ${strongest.role} — ${strongest.matchPercentage}%`
                : `Best match: ${strongest.role} — ${strongest.matchPercentage}%`
              : lang === "bn"
                ? "আপনার ম্যাচ তৈরি হচ্ছে..."
                : "Building your matches..."}
          </div>
        </div>

        {loading ? (
          <div style={{ color: T.txt1, fontSize: 12 }}>{lang === "bn" ? "লোড হচ্ছে..." : "Loading..."}</div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 8px", color: T.txt0, fontSize: 13.5 }}>{t.strongMatches}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {matches.strongMatches.length === 0 ? (
                  <div style={{ color: T.txt1, fontSize: 11.5 }}>{lang === "bn" ? "এখনও শক্তিশালী ম্যাচ নেই" : "No strong matches yet"}</div>
                ) : (
                  matches.strongMatches.map((match) => (
                    <MatchCard key={`strong-${match.role}`} match={match} T={T} lang={lang} />
                  ))
                )}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 8px", color: T.txt0, fontSize: 13.5 }}>{t.nearReadyMatches}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {matches.nearReadyMatches.map((match) => (
                  <MatchCard key={`near-${match.role}`} match={match} T={T} lang={lang} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 8px", color: T.txt0, fontSize: 13.5 }}>{t.learningGapMatches}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 10 }}>
                {matches.learningGapMatches.slice(0, 3).map((match) => (
                  <MatchCard key={`gap-${match.role}`} match={match} T={T} lang={lang} />
                ))}
              </div>
            </div>

            <div
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 14,
                boxShadow: T.shadow
              }}
            >
              <h3 style={{ margin: 0, fontSize: 13.5, color: T.txt0 }}>{t.marketInsights}</h3>
              <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
                {signals.slice(0, 6).map((signal) => (
                  <div key={`${signal.skill}-${signal.source}`} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ color: T.txt0, fontSize: 11.5 }}>{signal.skill}</span>
                    <span style={{ color: T.txt1, fontSize: 10.5 }}>
                      {signal.mentionCount} • {signal.weekChangePct > 0 ? "+" : ""}
                      {signal.weekChangePct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
