"use client";

import React, { useState } from "react";
import { i18n, assessments, fallbackAssessment } from "@/lib/i18n/messages";
import type { AssessmentQuestion, Track } from "@/types/ui";
import type { UiTier } from "@/lib/tier/config";

const ASSESSMENT_SLUG_MAP: Record<string, string> = {
  "data-science": "ds",
  "digital-literacy": "dl",
  "backend-development": "be",
  "python-foundations": "ds"
};

export default function Onboarding({
  T,
  parentT,
  tracks: trackOptions,
  onComplete,
  isDark
}: {
  T: any;
  parentT: any;
  tracks: (Track & { slug?: string; priceBdt?: number; isFree?: boolean; tier?: number })[];
  onComplete: (data: {
    lang: string;
    trackId: string;
    trackTier: UiTier;
    goal: string;
    level: string;
    assessmentScore?: number;
    assessmentPercentage?: number;
    skippedAssessment?: boolean;
  }) => void;
  isDark: boolean;
}) {
  const [step, setStep] = useState(0);
  const defaultTrackId = trackOptions[0]?.id || "";
  const [data, setData] = useState({
    goal: "",
    level: "",
    trackId: defaultTrackId,
    trackSlug: trackOptions[0]?.slug || "data-science",
    trackTier: (trackOptions[0]?.tier ?? 3) as UiTier,
    lang: "en"
  });
  const [quizAns, setQuizAns] = useState<{ [key: number]: number }>({});

  const t = i18n[data.lang] || parentT;

  const goals = [
    {
      id: "job",
      icon: "💼",
      titleEn: "Secure a Remote or Global IT Job",
      titleBn: "রিমোট ক্যারিয়ার বা গ্লোবাল আইটি চাকরি",
      subEn: "Position talent globally",
      subBn: "বিশ্বমানের কাজের সুযোগ"
    },
    {
      id: "upskill",
      icon: "📈",
      titleEn: "Upskill to Professional Developer",
      titleBn: "দক্ষতা বৃদ্ধি করা (Professional Developer)",
      subEn: "Hone clean, optimal patterns",
      subBn: "ক্লিন ও অপ্টিমাইজড কোডিং শেখা"
    },
    {
      id: "switch",
      icon: "🔄",
      titleEn: "Switch Engineering Fields",
      titleBn: "ক্যারিয়ার বা ট্র্যাক পরিবর্তন",
      subEn: "Pivot confidently with guidance",
      subBn: "নতুন ক্যারিয়ার ট্র্যাক শুরু করা"
    },
    {
      id: "explore",
      icon: "🔭",
      titleEn: "Explore Technical Ecosystems",
      titleBn: "কারিগরি বিষয়ে ধারণা নেওয়া",
      subEn: "Satisfy general curiosity",
      subBn: "কৌতূহল মেটানো ও বেসিক শেখা"
    }
  ];

  const levels = [
    {
      id: "beginner",
      icon: "🌱",
      titleEn: "Beginner",
      titleBn: "শিক্ষানবিস (Beginner)",
      subEn: "Little or no structural background",
      subBn: "পূর্ব অভিজ্ঞতা ছাড়া প্রথম কোডিং"
    },
    {
      id: "some",
      icon: "📚",
      titleEn: "Intermediate / Self-Taught",
      titleBn: "মাধ্যমিক (Self-Taught)",
      subEn: "Understand fundamentals and variables",
      subBn: "বেসিক ও ভ্যারিয়েবলের ধারণা আছে"
    },
    {
      id: "pro",
      icon: "⚡",
      titleEn: "Professional",
      titleBn: "পেশাদার ডেভেলপার (Professional)",
      subEn: "Familiar with structural compilers, APIs and Git",
      subBn: "সার্ভার, এপিআই ও গিট নিয়ে কাজের অভিজ্ঞতা"
    }
  ];

  // Retrieve assessment questions based on selected track or fall back to generic
  const getAssessmentQuestions = (): AssessmentQuestion[] => {
    const key = ASSESSMENT_SLUG_MAP[data.trackSlug] || "ds";
    return assessments[key] || fallbackAssessment;
  };

  const activeQuestions = getAssessmentQuestions();
  const assessmentScore = activeQuestions.reduce(
    (score, question, questionIndex) => score + (quizAns[questionIndex] === question.ans ? 1 : 0),
    0
  );
  const assessmentPercentage = activeQuestions.length
    ? Math.round((assessmentScore / activeQuestions.length) * 100)
    : 0;

  const steps = [
    // Step 0: Language Select
    <div style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ fontSize: 44, marginBottom: 18 }}>🌐</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: T.txt0, marginBottom: 10 }}>
        Choose Language / ভাষা নির্বাচন করুন
      </h2>
      <p style={{ color: T.txt1, marginBottom: 36, fontSize: 13 }}>
        Toggle translations anytime inside the workshop platform
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        {[
          ["en", "English", "🇬🇧"],
          ["bn", "বাংলা", "🇧🇩"]
        ].map(([id, label, flag]) => (
          <button
            key={id}
            onClick={() => {
              setData((p) => ({ ...p, lang: id }));
              setTimeout(() => setStep(1), 250);
            }}
            style={{
              padding: "24px 34px",
              borderRadius: 12,
              background: T.bg2,
              border: `2px solid ${data.lang === id ? T.accent : T.border}`,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              flex: 1,
              transition: "border 0.15s"
            }}
          >
            <span style={{ fontSize: 32 }}>{flag}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.txt0 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Goal Select
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: T.txt0, marginBottom: 8, textAlign: "center" }}>
        {t.onboarding1}
      </h2>
      <p style={{ color: T.txt1, marginBottom: 28, textAlign: "center", fontSize: 13 }}>
        Your personal syllabus adapts to direct targets
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setData((p) => ({ ...p, goal: g.id }));
              setStep(2);
            }}
            style={{
              padding: "20px 16px",
              borderRadius: 12,
              background: data.goal === g.id ? T.accentDim : T.bg2,
              border: `2px solid ${data.goal === g.id ? T.accent : T.border}`,
              cursor: "pointer",
              textAlign: "left",
              outline: "none"
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{g.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: T.txt0, marginBottom: 4, lineHeight: 1.4 }}>
              {data.lang === "bn" ? g.titleBn : g.titleEn}
            </div>
            <div style={{ fontSize: 11, color: T.txt1, lineHeight: 1.3 }}>
              {data.lang === "bn" ? g.subBn : g.subEn}
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Experience Lvl Select
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: T.txt0, marginBottom: 8, textAlign: "center" }}>
        {t.onboarding2}
      </h2>
      <p style={{ color: T.txt1, marginBottom: 28, textAlign: "center", fontSize: 13 }}>
        Helps us position your conceptual baseline starting points
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setData((p) => ({ ...p, level: l.id }));
              setStep(3);
            }}
            style={{
              padding: "16px 20px",
              borderRadius: 12,
              background: data.level === l.id ? T.accentDim : T.bg2,
              border: `2px solid ${data.level === l.id ? T.accent : T.border}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
              textAlign: "left"
            }}
          >
            <span style={{ fontSize: 28 }}>{l.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.txt0 }}>
                {data.lang === "bn" ? l.titleBn : l.titleEn}
              </div>
              <div style={{ fontSize: 11, color: T.txt1, marginTop: 3 }}>
                {data.lang === "bn" ? l.subBn : l.subEn}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Choose Track (10 items, no cost listed, highlighting completed tracks)
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: T.txt0, marginBottom: 6, textAlign: "center" }}>
        {t.onboarding3}
      </h2>
      <p style={{ color: T.txt1, marginBottom: 24, textAlign: "center", fontSize: 13 }}>
        Toggle tracks seamlessly at any time in your dashboard
      </p>
      {trackOptions.length === 0 ? (
        <p style={{ color: T.amber, textAlign: "center", fontSize: 13 }}>
          {data.lang === "bn"
            ? "কোনো প্রকাশিত ট্র্যাক নেই। Supabase-এ সিড মাইগ্রেশন চালান।"
            : "No published tracks found. Run the seed migration in Supabase."}
        </p>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          maxHeight: "360px",
          overflowY: "auto",
          paddingRight: 6,
          marginBottom: 20
        }}
      >
        {trackOptions.map((tr) => (
          <button
            key={tr.id}
            onClick={() => {
              setData((p) => ({
                ...p,
                trackId: tr.id,
                trackSlug: tr.slug || tr.id,
                trackTier: (tr.tier ?? 1) as UiTier
              }));
              setStep(4);
            }}
            style={{
              padding: "16px",
              borderRadius: 12,
              background: data.trackId === tr.id ? T.accentDim : T.bg2,
              border: `2px solid ${
                data.trackId === tr.id
                  ? T.accent
                  : tr.completed
                  ? "#00C8964d"
                  : T.border
              }`,
              cursor: "pointer",
              textAlign: "left",
              position: "relative",
              outline: "none"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 24 }}>{tr.icon}</span>
              {tr.completed && (
                <span
                  style={{
                    background: "#00C8961c",
                    color: T.accent,
                    border: `1px solid ${T.accent}4d`,
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontSize: 9,
                    fontWeight: 700
                  }}
                >
                  ✓ {data.lang === "bn" ? "সম্পন্ন" : "Completed"}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, fontWeight: 800, color: T.txt0, lineHeight: 1.4, paddingRight: 12 }}>
              {data.lang === "bn" ? tr.titleBn : tr.titleEn}
            </div>
            <div style={{ fontSize: 11, color: T.accent, fontWeight: 700, marginTop: 6 }}>
              {tr.isFree || tr.priceBdt === 0
                ? data.lang === "bn"
                  ? "বিনামূল্যে"
                  : "Free"
                : `৳${(tr.priceBdt ?? 0).toLocaleString("en-BD")}`}
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 4: Tailored Assessment
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <h2 style={{ fontSize: 21, fontWeight: 900, color: T.txt0, marginBottom: 8, textAlign: "center" }}>
        {t.onboarding4}
      </h2>
      <p style={{ color: T.txt1, marginBottom: 12, textAlign: "center", fontSize: 13 }}>
        {data.lang === "bn"
          ? "আপনার নির্বাচিত ট্র্যাকের জন্য একটি সংক্ষিপ্ত ৩ মিনিটের মূল্যায়ন পরীক্ষা"
          : "Quick baseline appraisal customized for your selected study track"}
      </p>

      {/* Track confirmation text */}
      <div
        style={{
          background: T.accentDim,
          border: `1px solid ${T.accent}4d`,
          borderRadius: 8,
          padding: "10px 14px",
          marginBottom: 18,
          fontSize: 12,
          color: T.accent,
          lineHeight: 1.4
        }}
      >
        ✦{" "}
        {data.lang === "bn"
          ? `নির্বাচিত পথ: ${trackOptions.find((tr) => tr.id === data.trackId)?.titleBn || "জেনারেল"}. এটি আপনার লেকচার সূচীকে সাজাবে।`
          : `Active path: ${trackOptions.find((tr) => tr.id === data.trackId)?.titleEn || "Your track"}.`}
      </div>

      <div style={{ maxHeight: "310px", overflowY: "auto", paddingRight: 4, marginBottom: 18 }}>
        {activeQuestions.map((q, qi) => (
          <div
            key={qi}
            style={{
              background: T.bg2,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 12
            }}
          >
            <div style={{ fontSize: 12.5, fontWeight: 800, color: T.txt0, marginBottom: 12, lineHeight: 1.5 }}>
              {qi + 1}. {data.lang === "bn" ? q.qBn : q.qEn}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {(data.lang === "bn" ? q.optsBn : q.optsEn).map((opt, oi) => {
                const isSelected = quizAns[qi] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setQuizAns((p) => ({ ...p, [qi]: oi }))}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 12px",
                      background: isSelected ? T.accentDim : T.bg3,
                      border: `1px solid ${isSelected ? T.accent : T.border}`,
                      borderRadius: 8,
                      cursor: "pointer",
                      color: T.txt0,
                      fontSize: 11.5,
                      textAlign: "left",
                      outline: "none"
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: `1.5px solid ${isSelected ? T.accent : T.borderHi}`,
                        background: isSelected ? T.accent : "none",
                        flexShrink: 0
                      }}
                    />
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={() =>
            onComplete({
              lang: data.lang,
              trackId: data.trackId,
              trackTier: data.trackTier,
              goal: data.goal,
              level: data.level,
              assessmentScore,
              assessmentPercentage
            })
          }
          style={{
            background: T.accent,
            border: "none",
            borderRadius: 10,
            padding: "12px",
            fontSize: 13,
            fontWeight: 800,
            color: "#000",
            cursor: "pointer"
          }}
        >
          {t.startAssessment}
        </button>
        <button
          onClick={() =>
            onComplete({
              lang: data.lang,
              trackId: data.trackId,
              trackTier: data.trackTier,
              goal: data.goal,
              level: data.level,
              assessmentPercentage: 0,
              skippedAssessment: true
            })
          }
          style={{
            background: "none",
            border: `1px solid ${T.border}`,
            borderRadius: 10,
            padding: "10px",
            fontSize: 12,
            color: T.txt1,
            cursor: "pointer"
          }}
        >
          {t.skipAssessment}
        </button>
      </div>
    </div>
  ];

  const stepLabels = ["🌐 Language", "🎯 Target", "⚡ Level", "📖 Track", "🖋 Evaluation"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif"
      }}
    >
      {/* Brand logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: T.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 950,
            color: "#000"
          }}
        >
          F
        </div>
        <span style={{ fontSize: 21, fontWeight: 950, color: T.txt0, letterSpacing: -0.6 }}>{t.brand}</span>
      </div>

      {/* Progress navigation pills */}
      <div style={{ display: "flex", gap: 6, marginBottom: 30, flexWrap: "wrap", justifyContent: "center" }}>
        {stepLabels.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                borderRadius: 14,
                padding: "4px 10px",
                background: i < step ? T.accent : i === step ? T.bg3 : T.bg2,
                border: `1.5px solid ${i <= step ? T.accent : T.border}`,
                fontSize: 10,
                color: i < step ? "#000" : i === step ? T.accent : T.txt2,
                fontWeight: 700,
                whiteSpace: "nowrap"
              }}
            >
              {s}
            </div>
            {i < 4 && <div style={{ width: 12, height: 1.5, background: i < step ? T.accent : T.border }} />}
          </div>
        ))}
      </div>

      {/* Screen body container */}
      <div style={{ width: "100%", maxWidth: 640 }}>{steps[step]}</div>

      {/* Back flow modifier trigger */}
      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          style={{
            marginTop: 20,
            background: "none",
            border: "none",
            color: T.txt1,
            fontSize: 12,
            cursor: "pointer",
            outline: "none"
          }}
        >
          ← Back
        </button>
      )}
    </div>
  );
}
