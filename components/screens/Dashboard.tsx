"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ArrowRight, BookOpen, Star, Bot, Award, Trophy, Flame, Library, List } from "lucide-react";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import ContentTemplates from "@/components/screens/ContentTemplates";
import type { DashboardAnalytics, DashboardStats, Module, UserEvaluation } from "@/types/ui";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function DashboardScreen({
  T,
  t,
  lang,
  onContinue,
  user,
  evaluation,
  modules = [],
  activeLessonId,
  weeklyGoal = 4,
  dashboardStats = null,
  dashboardAnalytics = null,
  streak = 0,
  loading = false,
  onStartAssessment,
  onMyTracks,
  onTrackLibrary
}: {
  T: any;
  t: any;
  lang: string;
  onContinue: () => void;
  user?: { name: string };
  evaluation?: UserEvaluation | null;
  modules?: Module[];
  activeLessonId?: string;
  weeklyGoal?: number;
  dashboardStats?: DashboardStats | null;
  dashboardAnalytics?: DashboardAnalytics | null;
  streak?: number;
  loading?: boolean;
  onStartAssessment?: () => void;
  onMyTracks?: () => void;
  onTrackLibrary?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (loading) {
    const shimmer = `linear-gradient(90deg, ${T.bg2} 0%, ${T.bg3} 50%, ${T.bg2} 100%)`;

    return (
      <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
        <style>{`
          @keyframes fixeth-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @keyframes fixeth-breathe {
            0%, 100% { transform: translateY(0); opacity: 0.7; }
            50% { transform: translateY(-2px); opacity: 1; }
          }
        `}</style>

        <div style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 16px 40px" }}>
          <div
            style={{
              background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}0d 100%)`,
              border: `1px solid ${T.border}`,
              borderRadius: 14,
              padding: 24,
              marginBottom: 20,
              boxShadow: T.shadow,
              overflow: "hidden"
            }}
          >
            <div style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)" }}>
              <div>
                <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
                  <div style={{ height: 18, width: "42%", borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
                  <div style={{ height: 42, width: "78%", borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
                  <div style={{ height: 14, width: "64%", borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={index}
                        style={{
                          width: isMobile ? 36 : 30,
                          height: isMobile ? 36 : 30,
                          borderRadius: 8,
                          background: shimmer,
                          backgroundSize: "400% 100%",
                          animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.06}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", justifyContent: "center" }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <div style={{ width: 138, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
                  <div style={{ width: 112, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite 0.08s" }} />
                  <div style={{ width: 112, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite 0.16s" }} />
                </div>
                <div style={{ width: 170, height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite 0.24s" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                style={{
                  background: T.bg1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  boxShadow: T.shadow,
                  minHeight: 92,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 14,
                  animation: "fixeth-breathe 1.9s ease-in-out infinite"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ width: "58%", height: 10, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.06}s` }} />
                  <div style={{ width: "42%", height: 22, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", marginTop: 10, animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.06 + 0.05}s` }} />
                  <div style={{ width: "72%", height: 9, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", marginTop: 10, animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.06 + 0.1}s` }} />
                </div>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05}s` }} />
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[0, 1].map((section) => (
              <div key={section} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
                <div style={{ width: "38%", height: 13, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${section * 0.08}s` }} />
                <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} style={{ display: "grid", gap: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ width: "52%", height: 11, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05}s` }} />
                        <div style={{ width: 36, height: 11, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
                      </div>
                      <div style={{ height: 4, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05 + 0.08}s` }} />
                      <div style={{ width: "40%", height: 9, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05 + 0.12}s` }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
            <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
              <div style={{ width: "36%", height: 13, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, marginTop: 12 }}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} style={{ height: 26, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.04}s` }} />
                ))}
              </div>
            </div>

            <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
              <div style={{ width: "42%", height: 13, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.4s ease-in-out infinite" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 24, height: 24, borderRadius: 6, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.05}s` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: `${70 - index * 6}%`, height: 11, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.04 + 0.03}s` }} />
                      <div style={{ width: `${50 - index * 4}%`, height: 9, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", marginTop: 6, animation: `fixeth-shimmer 1.4s ease-in-out infinite ${index * 0.04 + 0.08}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const totalLessons =
    dashboardStats?.totalLessons ??
    modules.reduce((count, module) => count + module.lessons.length, 0);
  const completedLessons =
    dashboardStats?.lessonsCompleted ??
    modules.reduce(
      (count, module) => count + module.lessons.filter((lesson) => lesson.done).length,
      0
    );
  const enrollmentProgress = dashboardStats?.progressPercent ?? 0;
  const displayStreak = dashboardStats?.streak ?? streak;
  const currentModule = modules.find((module) => module.lessons.some((lesson) => lesson.id === activeLessonId)) ?? modules[0];
  const currentModuleCompleted = currentModule ? currentModule.lessons.filter((lesson) => lesson.done).length : 0;
  const currentModuleTotal = currentModule?.lessons.length ?? 0;
  const currentModulePct = currentModuleTotal ? Math.round((currentModuleCompleted / currentModuleTotal) * 100) : 0;
  const scorePct = typeof evaluation?.percentage === "number"
    ? evaluation.percentage
    : typeof evaluation?.score === "number"
      ? Math.round((evaluation.score / 10) * 100)
      : undefined;
  const certificateCount = modules.filter((module) => module.lessons.length > 0 && module.lessons.every((lesson) => lesson.done)).length;
  const activityProgress = `${Math.min(completedLessons, weeklyGoal)}/${weeklyGoal}`;
  const assessmentLabel = evaluation?.skipped
    ? (lang === "bn" ? "অপেক্ষমাণ" : "Pending")
    : typeof scorePct === "number"
      ? `${scorePct}%`
      : (lang === "bn" ? "অপেক্ষমাণ" : "Pending");
  const dailySeries = dashboardAnalytics?.dailyCompletions ?? [];
  const moduleSeries = (dashboardAnalytics?.moduleCompletions ?? []).filter(
    (module) => module.totalLessons > 0
  );
  const heatmapSeries = dashboardAnalytics?.heatmapCells ?? [];
  const recentCompletions = dashboardAnalytics?.recentActivity ?? [];
  const trendLabels = dailySeries.map((point) =>
    new Date(`${point.date}T00:00:00`).toLocaleDateString(
      lang === "bn" ? "bn-BD" : "en-US",
      { month: "short", day: "numeric" }
    )
  );
  const trendValues = dailySeries.map((point) => point.completedLessons);
  const trendMax = Math.max(1, ...trendValues);
  const totalCompletionsInRange = trendValues.reduce((sum, value) => sum + value, 0);
  const recentWeekSeries = dailySeries.slice(-7);
  const weekBadges = recentWeekSeries.map((point) => ({
    key: point.date,
    completedLessons: point.completedLessons,
    label: new Date(`${point.date}T00:00:00`).toLocaleDateString(
      lang === "bn" ? "bn-BD" : "en-US",
      { weekday: "short" }
    )
  }));
  const trackRows = [
    {
      name: lang === "bn" ? "ডেটা সায়েন্স ট্র্যাক" : "Data Science & AI",
      pct:
        currentModule?.id === modules[0]?.id
          ? currentModulePct
          : Math.min(100, Math.max(0, Math.round((completedLessons / Math.max(totalLessons || 1, 1)) * 100))),
      label: currentModule?.title ?? (lang === "bn" ? "সক্রিয় মডিউল" : "Active module")
    },
    {
      name: lang === "bn" ? "ডিজিটাল লিটারেসি" : "Digital Literacy Fundamentals",
      pct: modules[1]?.lessons.length ? Math.round((modules[1].lessons.filter((lesson) => lesson.done).length / modules[1].lessons.length) * 100) : 0,
      label: lang === "bn" ? `${modules[1]?.lessons.filter((lesson) => lesson.done).length ?? 0} / ${modules[1]?.lessons.length ?? 0} সম্পন্ন` : `${modules[1]?.lessons.filter((lesson) => lesson.done).length ?? 0} / ${modules[1]?.lessons.length ?? 0} done`
    }
  ];

  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: t.lessonsCompleted,
        data: trendValues,
        borderColor: T.accent,
        backgroundColor: `${T.accent}22`,
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        pointHoverRadius: 4,
        pointBackgroundColor: T.accent
      }
    ]
  };
  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: `${T.border}55` },
        ticks: { color: T.txt2, maxTicksLimit: 8 }
      },
      y: {
        beginAtZero: true,
        suggestedMax: trendMax,
        grid: { color: `${T.border}55` },
        ticks: { color: T.txt2, precision: 0 }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: T.bg2,
        titleColor: T.txt0,
        bodyColor: T.txt1,
        borderColor: T.border,
        borderWidth: 1
      }
    }
  };
  const moduleChartData = {
    labels: moduleSeries.map((module) => module.moduleTitle),
    datasets: [
      {
        data: moduleSeries.map((module) => module.completedLessons),
        backgroundColor: [T.accent, T.blue, T.amber, "#FF5B8A", "#9E6BFF", "#53D0A0"],
        borderColor: T.bg1,
        borderWidth: 2
      }
    ]
  };
  const moduleChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: T.txt1,
          boxWidth: 10,
          boxHeight: 10,
          padding: 12,
          font: {
            size: 10
          }
        }
      },
      tooltip: {
        backgroundColor: T.bg2,
        titleColor: T.txt0,
        bodyColor: T.txt1,
        borderColor: T.border,
        borderWidth: 1,
        callbacks: {
          label: (context: { dataIndex: number; label: string; raw: number }) => {
            const moduleItem = moduleSeries[context.dataIndex];
            if (!moduleItem) return context.label;
            return `${context.label}: ${context.raw}/${moduleItem.totalLessons}`;
          }
        }
      }
    }
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "20px 16px 40px" }}>
        
        {/* Personalized Welcome Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}0d 100%)`,
            border: `1px solid ${T.border}`,
            borderRadius: 14,
            padding: "24px",
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            boxShadow: T.shadow
          }}
        >
          <div>
            <h2 style={{ fontSize: isMobile ? 24 : 21, fontWeight: 900, color: T.txt0, margin: "0 0 6px" }}>
              {t.greeting}, {user?.name ?? (lang === "bn" ? "বন্ধু" : "Learner")} 👋
            </h2>
            <p style={{ color: T.txt1, fontSize: isMobile ? 15 : 13, margin: "0 0 14px", lineHeight: 1.4 }}>
              {loading
                ? lang === "bn"
                  ? "ডেটা লোড হচ্ছে..."
                  : "Loading your progress..."
                : lang === "bn"
                  ? `${dashboardStats?.trackTitle || "আপনার ট্র্যাক"} — ${enrollmentProgress}% সম্পন্ন। ${displayStreak} দিনের স্ট্রিক।`
                  : `${dashboardStats?.trackTitle || "Your track"} — ${enrollmentProgress}% complete. ${displayStreak}-day streak.`}
            </p>
            {/* Week tracker balls */}
            <div style={{ display: "flex", gap: 6 }}>
              {weekBadges.map((day) => (
                <div
                  key={day.key}
                  style={{
                    width: isMobile ? 36 : 30,
                    height: isMobile ? 36 : 30,
                    borderRadius: 8,
                    background: day.completedLessons > 0 ? T.accent : T.bg4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: isMobile ? 11 : 9.5,
                    fontWeight: 800,
                    color: day.completedLessons > 0 ? "#000" : T.txt2
                  }}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "flex-end" }}>
              <button
                onClick={onContinue}
                style={{
                  background: T.accent,
                  border: "none",
                  borderRadius: 8,
                  padding: isMobile ? "12px 20px" : "10px 18px",
                  fontWeight: 800,
                  fontSize: isMobile ? 14 : 12.5,
                  color: "#000",
                  cursor: "pointer",
                  boxShadow: `0 4px 14px ${T.accent}2d`
                }}
              >
                {t.continueBtn}
              </button>
              {onMyTracks && (
                <Link
                  href="/my-tracks"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "12px 14px" : "10px 14px",
                    borderRadius: 8,
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    color: T.txt0,
                    fontWeight: 700,
                    fontSize: isMobile ? 13 : 11.5,
                    textDecoration: "none"
                  }}
                >
                  <List size={16} />
                  {lang === "bn" ? "আমার ট্র্যাক" : "My tracks"}
                </Link>
              )}
              {onTrackLibrary && (
                <Link
                  href="/tracks"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: isMobile ? "12px 14px" : "10px 14px",
                    borderRadius: 8,
                    background: T.bg3,
                    border: `1px solid ${T.border}`,
                    color: T.txt0,
                    fontWeight: 700,
                    fontSize: isMobile ? 13 : 11.5,
                    textDecoration: "none"
                  }}
                >
                  <Library size={16} />
                  {lang === "bn" ? "লাইব্রেরি" : "Library"}
                </Link>
              )}
            </div>
            <span style={{ fontSize: isMobile ? 12 : 10, color: T.txt1 }}>
              Syllabus Progress · <strong style={{ color: T.accent }}>{enrollmentProgress}%</strong>
            </span>
          </div>
        </div>

        {/* Skipped Evaluation Banner */}
        {evaluation?.skipped && (
          <div
            style={{
              background: `linear-gradient(135deg, #FF8A3D0d 0%, #FF8A3D1a 100%)`,
              border: `2px solid #FF8A3D`,
              borderRadius: 14,
              padding: "20px 24px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              boxShadow: `0 4px 14px #FF8A3D15`,
              animation: "slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          >
            <style>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <AlertCircle size={24} color="#FF8A3D" />
              <div>
                <h3 style={{ fontSize: isMobile ? 17 : 15, fontWeight: 900, color: T.txt0, margin: "0 0 4px" }}>
                  {lang === "bn" ? "আপনার মূল্যায়ন এখনো বাকি" : "Assessment Pending"}
                </h3>
                <p style={{ color: T.txt1, fontSize: isMobile ? 14 : 13, margin: 0, lineHeight: 1.3 }}>
                  {lang === "bn"
                    ? "আপনার দক্ষতা পরিমাপ করুন এবং ব্যক্তিগতকৃত শিক্ষা পথ পান।"
                    : "Complete your assessment to unlock personalized learning recommendations."}
                </p>
              </div>
            </div>

            <button
              onClick={onStartAssessment}
              style={{
                background: "#FF8A3D",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontWeight: 800,
                fontSize: 13,
                color: "#fff",
                cursor: "pointer",
                boxShadow: `0 4px 12px #FF8A3D3d`,
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 6px 16px #FF8A3D4d`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 12px #FF8A3D3d`;
              }}
            >
              {lang === "bn" ? "এখনই মূল্যায়ন করুন" : "Take Assessment"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}


        {/* Dynamic Metric Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { icon: BookOpen, label: t.lessonsCompleted, value: `${completedLessons}/${totalLessons || 0}`, color: T.accent, note: lang === "bn" ? "কোর্স-স্তরের অগ্রগতি" : "Course-level progress" },
            { icon: Star, label: t.quizAvg, value: assessmentLabel, color: T.amber, note: evaluation?.skipped ? (lang === "bn" ? "ডায়াগনস্টিক বাকি" : "Diagnostic pending") : (lang === "bn" ? "সর্বশেষ স্কোর" : "Latest score") },
            { icon: Flame, label: t.streak, value: `${displayStreak}`, color: "#FF5B8A", note: lang === "bn" ? "টানা দিন" : "Day streak" },
            { icon: Trophy, label: t.certificates, value: `${certificateCount}`, color: T.blue, note: lang === "bn" ? "পূর্ণ মডিউল" : "Completed modules" }
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 10,
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: T.shadow
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: T.txt1, fontWeight: 700, textTransform: "uppercase" }}>{card.label}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: T.txt0, marginTop: 4 }}>{card.value}</div>
                <div style={{ fontSize: 10.5, color: T.txt1, marginTop: 4, lineHeight: 1.4 }}>{card.note}</div>
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: `${card.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <card.icon size={18} color={card.color} strokeWidth={2} />
              </div>
            </div>
          ))}
        </div>

        {/* Progress & Target Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 20 }}>
          
          {/* My tracks progress */}
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 14px" }}>
              {t.activeTrack}
            </h3>
            {trackRows.map((track, i) => (
              <div key={i} style={{ borderBottom: i < 1 ? `1px solid ${T.border}` : "none", paddingBottom: i < 1 ? 14 : 0, paddingTop: i > 0 ? 14 : 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.txt0, marginBottom: 4, fontWeight: 700 }}>
                  <span>{track.name}</span>
                  <span style={{ color: T.accent }}>{track.pct}%</span>
                </div>
                {/* Progress bar line */}
                <div style={{ height: 4, background: T.bg4, borderRadius: 2, marginBottom: 4 }}>
                  <div style={{ width: `${track.pct}%`, height: "100%", background: T.accent, borderRadius: 2 }} />
                </div>
                <span style={{ fontSize: 10, color: T.txt1 }}>{track.label}</span>
              </div>
            ))}
          </div>

          {/* Weekly progress targets ring */}
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, alignSelf: "flex-start", margin: "0 0 12px" }}>
              {t.weeklyGoal}
            </h3>
            
            <div style={{ position: "relative", width: 80, height: 80, marginBottom: 10 }}>
              <svg width="80" height="80" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="40" cy="40" r="34" fill="none" stroke={T.bg4} strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke={T.accent}
                  strokeWidth="6"
                  strokeDasharray={213}
                  strokeDashoffset={213 * (1 - 0.75)}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: T.txt0 }}>{activityProgress}</span>
                <span style={{ fontSize: 8, color: T.txt1 }}>Classes Done</span>
              </div>
            </div>
            <span style={{ fontSize: 11, color: T.txt1 }}>{lang === "bn" ? "সাপ্তাহিক লক্ষ্যে এগিয়ে যান!" : "Keep moving toward the weekly goal!"}</span>
          </div>
        </div>

        {/* Learning analytics */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(300px, 1fr)", gap: 16, marginBottom: 20 }}>
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: 0 }}>
                {t.learningTrend}
              </h3>
              <span style={{ fontSize: 10, color: T.txt1 }}>{t.activityLastDays}</span>
            </div>
            <div style={{ height: 220 }}>
              <Line data={trendChartData} options={trendChartOptions} />
            </div>
          </div>

          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: 0 }}>
                {t.moduleDistribution}
              </h3>
              <span style={{ fontSize: 10, color: T.accent, fontWeight: 700 }}>{totalCompletionsInRange}</span>
            </div>
            <div style={{ height: 220 }}>
              {moduleSeries.length > 0 ? (
                <Doughnut data={moduleChartData} options={moduleChartOptions} />
              ) : (
                <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: T.txt2, fontSize: 12 }}>
                  {t.noActivityYet}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(300px, 1fr)", gap: 16 }}>
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <style>{`
              .fixeth-heatmap {
                width: 100%;
              }
              .fixeth-heatmap text {
                fill: ${T.txt2};
                font-size: 9px;
              }
              .fixeth-heatmap rect {
                rx: 3;
                ry: 3;
              }
              .fixeth-heatmap .color-scale-0 { fill: ${T.bg4}; }
              .fixeth-heatmap .color-scale-1 { fill: ${T.accent}66; }
              .fixeth-heatmap .color-scale-2 { fill: ${T.accent}99; }
              .fixeth-heatmap .color-scale-3 { fill: ${T.accent}CC; }
              .fixeth-heatmap .color-scale-4 { fill: ${T.accent}; }
            `}</style>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: 0 }}>
                {t.completionHeatmap}
              </h3>
              <span style={{ fontSize: 10, color: T.txt1 }}>{t.activityLastDays}</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <CalendarHeatmap
                className="fixeth-heatmap"
                classForValue={(value: { date: string; count: number } | undefined) => {
                  if (!value || value.count === 0) return "color-scale-0";
                  if (value.count === 1) return "color-scale-1";
                  if (value.count === 2) return "color-scale-2";
                  if (value.count === 3) return "color-scale-3";
                  return "color-scale-4";
                }}
                startDate={new Date(Date.now() - (dashboardAnalytics?.timeRangeDays ?? 30) * 86400000)}
                endDate={new Date()}
                values={heatmapSeries}
                showWeekdayLabels
                gutterSize={4}
                tooltipDataAttrs={(value: { date?: string; count?: number } | undefined) => ({
                  "data-tip": value?.date
                    ? `${value.date}: ${value.count ?? 0}`
                    : ""
                })}
              />
            </div>
          </div>

          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 14px" }}>
              {t.recentCompletions}
            </h3>
            {recentCompletions.length === 0 ? (
              <div style={{ color: T.txt2, fontSize: 12 }}>{t.noActivityYet}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {recentCompletions.map((event) => (
                  <div key={`${event.lessonId}-${event.completedAt}`} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: `${T.accent}20`,
                        color: T.accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}
                    >
                      <CheckCircle2 size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11.5, color: T.txt0, fontWeight: 700 }}>
                        {event.lessonTitle}
                      </div>
                      <div style={{ fontSize: 10, color: T.txt1, marginTop: 2 }}>
                        {event.moduleTitle}
                      </div>
                      <div style={{ fontSize: 9.5, color: T.txt2, marginTop: 2 }}>
                        {new Date(event.completedAt).toLocaleString(
                          lang === "bn" ? "bn-BD" : "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit"
                          }
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Templates for evaluation-based learning paths */}
        {evaluation && !evaluation.skipped && evaluation.percentage !== undefined && (
          <ContentTemplates
            T={T}
            t={t}
            lang={lang}
            evaluationPercentage={evaluation.percentage}
          />
        )}

      </div>
    </div>
  );
}
