"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  ExternalLink,
  MapPin,
  Building2,
  Clock,
  TrendingUp,
  TrendingDown,
  Wifi,
  Search,
  RefreshCw,
  Tag,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import type { JobRoleMatch, JobSignal } from "@/types/ui";

// ─── Types ────────────────────────────────────────────────────────────────────

type LiveJob = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "remote" | "onsite" | "hybrid";
  salary?: string;
  tags: string[];
  url: string;
  postedAt: string;
  source: string;
  sourceLogo?: string;
  description?: string;
  isRemote: boolean;
};

type JobsMatchData = {
  strongMatches: JobRoleMatch[];
  nearReadyMatches: JobRoleMatch[];
  learningGapMatches: JobRoleMatch[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score: number, T: any) {
  if (score >= 85) return T.accent;
  if (score >= 70) return T.amber;
  return "#FF5B8A";
}

function timeAgo(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const diffMs = Date.now() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  } catch {
    return "Recently";
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({
  title,
  count,
  T
}: {
  title: string;
  count?: number;
  T: any;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
      }}
    >
      <h3 style={{ margin: 0, fontSize: 13.5, fontWeight: 800, color: T.txt0 }}>
        {title}
      </h3>
      {count !== undefined && (
        <span
          style={{
            background: `${T.accent}22`,
            color: T.accent,
            border: `1px solid ${T.accent}44`,
            borderRadius: 999,
            padding: "1px 8px",
            fontSize: 10,
            fontWeight: 800
          }}
        >
          {count}
        </span>
      )}
    </div>
  );
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
  const color = scoreColor(match.matchPercentage, T);
  const badgeText =
    match.readiness === "strong"
      ? lang === "bn"
        ? "আবেদনযোগ্য"
        : "Apply-ready"
      : match.readiness === "near_ready"
        ? lang === "bn"
          ? "প্রায় প্রস্তুত"
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
        padding: 16,
        boxShadow: T.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "transform 0.15s, box-shadow 0.15s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${T.accent}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = T.shadow;
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: "0 0 4px", color: T.txt0, fontSize: 13.5, fontWeight: 800, lineHeight: 1.3 }}>
            {match.role}
          </h4>
          <span
            style={{
              background: `${color}1a`,
              color: color,
              border: `1px solid ${color}44`,
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 800
            }}
          >
            {badgeText}
          </span>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${color}15`,
            border: `2px solid ${color}33`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 900, color }}>{match.matchPercentage}%</span>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 10, color: T.txt1, fontWeight: 600 }}>
            {lang === "bn" ? "প্রয়োজনীয় কভারেজ" : "Required coverage"}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color }}>{match.requiredCoverage}%</span>
        </div>
        <div style={{ height: 4, background: T.bg4, borderRadius: 2 }}>
          <div
            style={{
              width: `${match.requiredCoverage}%`,
              height: "100%",
              background: color,
              borderRadius: 2,
              transition: "width 0.6s ease"
            }}
          />
        </div>
      </div>

      {/* Skills */}
      {match.matchedSkills.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: T.txt1, fontWeight: 600, marginBottom: 4 }}>
            {lang === "bn" ? "ম্যাচড স্কিল" : "Matched skills"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {match.matchedSkills.slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  background: `${T.accent}15`,
                  color: T.accent,
                  border: `1px solid ${T.accent}30`,
                  borderRadius: 6,
                  padding: "2px 7px",
                  fontSize: 9.5,
                  fontWeight: 700
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {[...match.missingRequiredSkills, ...match.missingPreferredSkills].length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: "#FF8A3D", fontWeight: 600, marginBottom: 4 }}>
            {lang === "bn" ? "মিসিং স্কিল" : "Missing skills"}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[...match.missingRequiredSkills, ...match.missingPreferredSkills].slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  background: "#FF8A3D18",
                  color: "#FF8A3D",
                  border: "1px solid #FF8A3D30",
                  borderRadius: 6,
                  padding: "2px 7px",
                  fontSize: 9.5,
                  fontWeight: 700
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.nextStep && (
        <div
          style={{
            background: T.bg2,
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 10.5,
            color: T.txt1,
            lineHeight: 1.4
          }}
        >
          <span style={{ fontWeight: 700, color: T.txt0 }}>
            {lang === "bn" ? "পরবর্তী পদক্ষেপ: " : "Next step: "}
          </span>
          {match.nextStep}
        </div>
      )}
    </div>
  );
}

function LiveJobCard({ job, T }: { job: LiveJob; T: any }) {
  const typeColors: Record<string, string> = {
    remote: T.accent,
    onsite: T.blue,
    hybrid: T.amber
  };
  const typeColor = typeColors[job.type] ?? T.txt1;
  const typeLabel = job.type === "remote" ? "Remote" : job.type === "hybrid" ? "Hybrid" : "On-site";

  return (
    <a
      href={job.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "block",
        background: T.bg1,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: 16,
        boxShadow: T.shadow,
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.15s, box-shadow 0.15s, border-color 0.15s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${T.accent}18`;
        e.currentTarget.style.borderColor = `${T.accent}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = T.shadow;
        e.currentTarget.style.borderColor = T.border;
      }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span
              style={{
                background: `${typeColor}18`,
                color: typeColor,
                border: `1px solid ${typeColor}40`,
                borderRadius: 6,
                padding: "2px 7px",
                fontSize: 9.5,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 3
              }}
            >
              {job.type === "remote" && <Wifi size={9} />}
              {typeLabel}
            </span>
            <span style={{ fontSize: 10, color: T.txt2, fontWeight: 500 }}>{job.source}</span>
          </div>
          <h4
            style={{
              margin: "0 0 4px",
              fontSize: 13,
              fontWeight: 800,
              color: T.txt0,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}
          >
            {job.title}
          </h4>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.txt1 }}>
              <Building2 size={11} />
              {job.company}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: T.txt1 }}>
              <MapPin size={11} />
              {job.location}
            </span>
          </div>
        </div>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <ExternalLink size={13} color={T.txt2} />
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: T.txt2 }}>
            <Clock size={9} />
            {timeAgo(job.postedAt)}
          </span>
        </div>
      </div>

      {/* Description */}
      {job.description && (
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 11,
            color: T.txt1,
            lineHeight: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {job.description}
        </p>
      )}

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {job.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                background: T.bg3,
                color: T.txt1,
                borderRadius: 6,
                padding: "2px 7px",
                fontSize: 9.5,
                fontWeight: 600
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {job.salary && (
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.accent }}>
            {job.salary}
          </span>
        )}
      </div>
    </a>
  );
}

function SignalRow({ signal, T }: { signal: JobSignal; T: any }) {
  const isRising = signal.weekChangePct > 0;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 0",
        borderBottom: `1px solid ${T.border}`,
        gap: 8
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <span style={{ fontSize: 12, color: T.txt0, fontWeight: 600 }}>{signal.skill}</span>
        {signal.inCurriculum && (
          <CheckCircle2 size={11} color={T.accent} />
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ fontSize: 11, color: T.txt1 }}>{signal.mentionCount} mentions</span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontSize: 10.5,
            fontWeight: 700,
            color: isRising ? T.accent : "#FF5B8A"
          }}
        >
          {isRising ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {isRising ? "+" : ""}
          {signal.weekChangePct}%
        </span>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function JobsScreen({
  T,
  t,
  lang
}: {
  T: any;
  t: any;
  lang: string;
}) {
  const [activeTab, setActiveTab] = useState<"live" | "matches" | "signals">("live");
  const [searchQuery, setSearchQuery] = useState("software developer");
  const [inputValue, setInputValue] = useState("software developer");

  // Live jobs state
  const [liveJobs, setLiveJobs] = useState<LiveJob[]>([]);
  const [liveSources, setLiveSources] = useState<string[]>([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // Match data state
  const [matches, setMatches] = useState<JobsMatchData>({
    strongMatches: [],
    nearReadyMatches: [],
    learningGapMatches: []
  });
  const [matchLoading, setMatchLoading] = useState(true);

  // Signals state
  const [signals, setSignals] = useState<JobSignal[]>([]);
  const [signalsLoading, setSignalsLoading] = useState(true);

  // Fetch live jobs
  const loadLiveJobs = async (query: string) => {
    setLiveLoading(true);
    setLiveError(null);
    try {
      const res = await fetch(
        `/api/jobs/live?q=${encodeURIComponent(query)}&limit=30`,
        { cache: "no-store" }
      );
      const json = (await res.json()) as {
        data?: { jobs: LiveJob[]; sources: string[]; total: number };
        error?: string | null;
      };
      setLiveJobs(json.data?.jobs ?? []);
      setLiveSources(json.data?.sources ?? []);
      setLastFetched(new Date());
      if (json.error && !json.data?.jobs?.length) {
        setLiveError(json.error);
      }
    } catch (err) {
      setLiveError("Failed to fetch live jobs");
      setLiveJobs([]);
    } finally {
      setLiveLoading(false);
    }
  };

  // Fetch match data
  useEffect(() => {
    let mounted = true;
    (async () => {
      setMatchLoading(true);
      try {
        const res = await fetch("/api/jobs/matches", { cache: "no-store" });
        const json = (await res.json()) as { data?: JobsMatchData; error?: string | null };
        if (mounted) {
          setMatches(
            json.data ?? { strongMatches: [], nearReadyMatches: [], learningGapMatches: [] }
          );
        }
      } catch {
        // silently fail
      } finally {
        if (mounted) setMatchLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Fetch signals
  useEffect(() => {
    let mounted = true;
    (async () => {
      setSignalsLoading(true);
      try {
        const res = await fetch("/api/jobs?limit=12", { cache: "no-store" });
        const json = (await res.json()) as {
          data?: { trendingSkills?: JobSignal[]; signals?: JobSignal[] };
          error?: string | null;
        };
        if (mounted) {
          const raw = json.data?.trendingSkills ?? json.data?.signals ?? [];
          setSignals(raw);
        }
      } catch {
        // silently fail
      } finally {
        if (mounted) setSignalsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load live jobs on mount and on search query change
  useEffect(() => {
    void loadLiveJobs(searchQuery);
  }, [searchQuery]);

  const strongest = useMemo(
    () => matches.strongMatches[0] ?? matches.nearReadyMatches[0],
    [matches]
  );
  const totalMatches =
    matches.strongMatches.length +
    matches.nearReadyMatches.length +
    matches.learningGapMatches.length;

  const TABS = [
    {
      id: "live" as const,
      label: lang === "bn" ? "লাইভ জব" : "Live Jobs",
      count: liveJobs.length
    },
    {
      id: "matches" as const,
      label: lang === "bn" ? "আমার ম্যাচ" : "My Matches",
      count: totalMatches
    },
    {
      id: "signals" as const,
      label: lang === "bn" ? "মার্কেট সিগন্যাল" : "Market Signals",
      count: signals.length
    }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 16px 40px" }}>

        {/* Hero Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}0d 100%)`,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "20px 24px",
            marginBottom: 16,
            boxShadow: T.shadow,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Briefcase size={20} color={T.accent} />
              <h2 style={{ margin: 0, fontSize: 20, color: T.txt0, fontWeight: 900 }}>
                {lang === "bn" ? "জব ইন্টেলিজেন্স" : "Job Intelligence"}
              </h2>
            </div>
            <p style={{ margin: 0, color: T.txt1, fontSize: 12, lineHeight: 1.5 }}>
              {lang === "bn"
                ? "লাইভ জব পোস্টিং, ব্যক্তিগত ম্যাচ এবং বাজারের ট্রেন্ড এক জায়গায়।"
                : "Live job postings, personal skill matches, and market trends in one place."}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            {strongest && (
              <div
                style={{
                  background: `${T.accent}15`,
                  border: `1px solid ${T.accent}33`,
                  borderRadius: 10,
                  padding: "8px 14px",
                  textAlign: "right"
                }}
              >
                <div style={{ fontSize: 10, color: T.txt1, fontWeight: 600 }}>
                  {lang === "bn" ? "সেরা ম্যাচ" : "Best match"}
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: T.accent, marginTop: 2 }}>
                  {strongest.role} — {strongest.matchPercentage}%
                </div>
              </div>
            )}
            {liveSources.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: T.txt2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent, animation: "pulse 2s infinite" }} />
                {lang === "bn" ? "লাইভ ডেটা" : "Live from"} {liveSources.join(", ")}
              </div>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div
          style={{
            display: "flex",
            gap: 4,
            background: T.bg1,
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: 4,
            marginBottom: 16,
            boxShadow: T.shadow
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                padding: "9px 12px",
                borderRadius: 7,
                border: "none",
                background: activeTab === tab.id ? T.accent : "none",
                color: activeTab === tab.id ? "#000" : T.txt1,
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: 12,
                cursor: "pointer",
                transition: "all 0.15s"
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    background: activeTab === tab.id ? "rgba(0,0,0,0.2)" : `${T.accent}22`,
                    color: activeTab === tab.id ? "#000" : T.accent,
                    borderRadius: 999,
                    padding: "1px 6px",
                    fontSize: 9.5,
                    fontWeight: 800
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Live Jobs ─────────────────────────────────────── */}
        {activeTab === "live" && (
          <div>
            {/* Search bar */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "8px 12px",
                alignItems: "center",
                boxShadow: T.shadow
              }}
            >
              <Search size={15} color={T.txt2} style={{ flexShrink: 0 }} />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    setSearchQuery(inputValue.trim());
                  }
                }}
                placeholder={
                  lang === "bn"
                    ? "চাকরি খুঁজুন (যেমন: software developer, data analyst)"
                    : "Search jobs (e.g. software developer, data analyst)"
                }
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  outline: "none",
                  fontSize: 12,
                  color: T.txt0,
                  fontFamily: "inherit"
                }}
              />
              <button
                type="button"
                onClick={() => inputValue.trim() && setSearchQuery(inputValue.trim())}
                style={{
                  background: T.accent,
                  border: "none",
                  borderRadius: 6,
                  padding: "6px 14px",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#000",
                  cursor: "pointer"
                }}
              >
                {lang === "bn" ? "খুঁজুন" : "Search"}
              </button>
              <button
                type="button"
                onClick={() => loadLiveJobs(searchQuery)}
                title="Refresh"
                style={{
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "6px 8px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  color: T.txt1
                }}
              >
                <RefreshCw size={13} style={{ animation: liveLoading ? "spin 1s linear infinite" : "none" }} />
              </button>
            </div>

            {/* Meta info */}
            {!liveLoading && lastFetched && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: T.txt2 }}>
                  {liveJobs.length > 0
                    ? `${liveJobs.length} ${lang === "bn" ? "টি জব পাওয়া গেছে" : "jobs found"} · "${searchQuery}"`
                    : lang === "bn" ? "কোনো জব পাওয়া যায়নি" : "No jobs found"}
                </div>
                <div style={{ fontSize: 10, color: T.txt2 }}>
                  {lang === "bn" ? "আপডেট:" : "Updated:"} {lastFetched.toLocaleTimeString()}
                </div>
              </div>
            )}

            {liveLoading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      background: T.bg1,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: 16,
                      height: 140
                    }}
                  >
                    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
                    {[60, 40, 80, 50].map((w, j) => (
                      <div
                        key={j}
                        style={{
                          height: j === 0 ? 12 : 10,
                          width: `${w}%`,
                          borderRadius: 6,
                          background: `linear-gradient(90deg, ${T.bg2} 0%, ${T.bg3} 50%, ${T.bg2} 100%)`,
                          backgroundSize: "400% 100%",
                          animation: `shimmer 1.4s ease-in-out infinite ${j * 0.07}s`,
                          marginBottom: j < 3 ? 10 : 0
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : liveError && liveJobs.length === 0 ? (
              <div
                style={{
                  background: T.bg1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  padding: 24,
                  textAlign: "center",
                  boxShadow: T.shadow
                }}
              >
                <AlertCircle size={32} color={T.txt2} style={{ margin: "0 auto 12px", display: "block" }} />
                <div style={{ fontSize: 13, color: T.txt0, fontWeight: 700, marginBottom: 6 }}>
                  {lang === "bn" ? "জব লোড করতে সমস্যা হয়েছে" : "Could not load live jobs"}
                </div>
                <div style={{ fontSize: 11, color: T.txt1 }}>{liveError}</div>
                <button
                  type="button"
                  onClick={() => loadLiveJobs(searchQuery)}
                  style={{
                    marginTop: 14,
                    background: T.accent,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 16px",
                    fontWeight: 800,
                    fontSize: 12,
                    color: "#000",
                    cursor: "pointer"
                  }}
                >
                  {lang === "bn" ? "আবার চেষ্টা করুন" : "Try again"}
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12 }}>
                {liveJobs.map((job) => (
                  <LiveJobCard key={job.id} job={job} T={T} />
                ))}
              </div>
            )}

            {/* Source badges */}
            {!liveLoading && liveSources.length > 0 && (
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10.5, color: T.txt2 }}>
                  {lang === "bn" ? "সোর্স:" : "Sources:"}
                </span>
                {liveSources.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: T.bg2,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "2px 8px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.txt1
                    }}
                  >
                    {s}
                  </span>
                ))}
                <span style={{ fontSize: 10, color: T.txt2 }}>
                  · {lang === "bn" ? "আরও যোগ হচ্ছে: BDJobs, Chakri" : "More coming: BDJobs, Chakri (CORS-restricted)"}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Tab: My Matches ────────────────────────────────────── */}
        {activeTab === "matches" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {matchLoading ? (
              <div style={{ color: T.txt1, fontSize: 12, padding: 20 }}>
                {lang === "bn" ? "ম্যাচ লোড হচ্ছে..." : "Loading your matches..."}
              </div>
            ) : (
              <>
                {matches.strongMatches.length > 0 && (
                  <div>
                    <SectionHeader
                      title={lang === "bn" ? "শক্তিশালী ম্যাচ" : "Strong Matches"}
                      count={matches.strongMatches.length}
                      T={T}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                      {matches.strongMatches.map((m) => (
                        <MatchCard key={`strong-${m.role}`} match={m} T={T} lang={lang} />
                      ))}
                    </div>
                  </div>
                )}

                {matches.nearReadyMatches.length > 0 && (
                  <div>
                    <SectionHeader
                      title={lang === "bn" ? "প্রায় প্রস্তুত" : "Almost Ready"}
                      count={matches.nearReadyMatches.length}
                      T={T}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                      {matches.nearReadyMatches.map((m) => (
                        <MatchCard key={`near-${m.role}`} match={m} T={T} lang={lang} />
                      ))}
                    </div>
                  </div>
                )}

                {matches.learningGapMatches.length > 0 && (
                  <div>
                    <SectionHeader
                      title={lang === "bn" ? "স্কিল গ্যাপ" : "Skill Gap"}
                      count={matches.learningGapMatches.length}
                      T={T}
                    />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                      {matches.learningGapMatches.slice(0, 3).map((m) => (
                        <MatchCard key={`gap-${m.role}`} match={m} T={T} lang={lang} />
                      ))}
                    </div>
                  </div>
                )}

                {totalMatches === 0 && (
                  <div
                    style={{
                      background: T.bg1,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: 32,
                      textAlign: "center",
                      boxShadow: T.shadow
                    }}
                  >
                    <Briefcase size={32} color={T.txt2} style={{ margin: "0 auto 12px", display: "block" }} />
                    <div style={{ fontSize: 13, color: T.txt0, fontWeight: 700, marginBottom: 4 }}>
                      {lang === "bn" ? "ম্যাচ তৈরি হচ্ছে" : "Building your matches"}
                    </div>
                    <div style={{ fontSize: 11, color: T.txt1 }}>
                      {lang === "bn"
                        ? "কোর্সে এগিয়ে যান এবং আপনার স্কিল প্রোফাইল তৈরি করুন।"
                        : "Complete course lessons to build your skill profile and get personalized job matches."}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Tab: Market Signals ────────────────────────────────── */}
        {activeTab === "signals" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 18,
                boxShadow: T.shadow
              }}
            >
              <SectionHeader
                title={lang === "bn" ? "ট্রেন্ডিং স্কিল (বাংলাদেশ মার্কেট)" : "Trending Skills — Bangladesh Market"}
                count={signals.length}
                T={T}
              />
              {signalsLoading ? (
                <div style={{ color: T.txt1, fontSize: 12 }}>
                  {lang === "bn" ? "লোড হচ্ছে..." : "Loading signals..."}
                </div>
              ) : signals.length === 0 ? (
                <div style={{ fontSize: 12, color: T.txt2 }}>
                  {lang === "bn"
                    ? "এখনো মার্কেট ডেটা নেই। স্ক্র্যাপার শীঘ্রই আপডেট করবে।"
                    : "No market data yet. Scraper will update soon."}
                </div>
              ) : (
                <div>
                  {signals.map((s, i) => (
                    <SignalRow
                      key={`${s.skill}-${s.source}-${i}`}
                      signal={s}
                      T={T}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Legend */}
            <div
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: 16,
                boxShadow: T.shadow,
                display: "flex",
                flexWrap: "wrap",
                gap: 16
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CheckCircle2 size={13} color={T.accent} />
                <span style={{ fontSize: 11, color: T.txt1 }}>
                  {lang === "bn" ? "কারিকুলামে আছে" : "In your curriculum"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={13} color={T.accent} />
                <span style={{ fontSize: 11, color: T.txt1 }}>
                  {lang === "bn" ? "সপ্তাহে বৃদ্ধি পেয়েছে" : "Week-over-week increase"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingDown size={13} color="#FF5B8A" />
                <span style={{ fontSize: 11, color: T.txt1 }}>
                  {lang === "bn" ? "সপ্তাহে কমেছে" : "Week-over-week decrease"}
                </span>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
      </div>
    </div>
  );
}
