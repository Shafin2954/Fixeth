"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { i18n, assessments, fallbackAssessment } from "@/lib/i18n/messages";
import { themeVars } from "@/lib/ui/theme-vars";
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
  const [direction, setDirection] = useState(1);
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

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const goals = [
    {
      id: "job",
      icon: "💼",
      titleEn: "Secure a Remote or Global IT Job",
      titleBn: "রিমোট ক্যারিয়ার বা গ্লোবাল আইটি চাকরি",
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
      titleBn: "কারিগরি বিষয়ে ধারণা নেওয়া",
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
      subBn: "পূর্ব অভিজ্ঞতা ছাড়া প্রথম কোডিং"
    },
    {
      id: "some",
      icon: "📚",
      titleEn: "Intermediate / Self-Taught",
      titleBn: "মাধ্যমিক (Self-Taught)",
      subEn: "Understand fundamentals and variables",
      subBn: "বেসিক ও ভ্যারিয়েবলের ধারণা আছে"
    },
    {
      id: "pro",
      icon: "⚡",
      titleEn: "Professional",
      titleBn: "পেশাদার ডেভেলপার (Professional)",
      subEn: "Familiar with structural compilers, APIs and Git",
      subBn: "সার্ভার, এপিআই ও গিট নিয়ে কাজের অভিজ্ঞতা"
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
    <div key="lang" className="mx-auto w-full max-w-md text-center">
      <div className="mb-4 text-5xl">🌐</div>
      <h2 className="mb-2.5 text-2xl font-black text-[var(--t-txt0)]">
        Choose Language / ভাষা নির্বাচন করুন
      </h2>
      <p className="mb-8 text-[13px] text-[var(--t-txt1)]">
        Toggle translations anytime inside the workshop platform
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {[
          ["en", "English", "🇬🇧"],
          ["bn", "বাংলা", "🇧🇩"]
        ].map(([id, label, flag]) => (
          <button
            key={id}
            onClick={() => {
              setData((p) => ({ ...p, lang: id }));
              setTimeout(() => goTo(1), 250);
            }}
            className={`flex flex-1 cursor-pointer flex-col items-center gap-3 rounded-xl border-2 bg-[var(--t-bg2)] px-8 py-5 transition-colors sm:py-6 ${
              data.lang === id ? "border-[var(--t-accent)]" : "border-[var(--t-border)]"
            }`}
          >
            <span className="text-3xl">{flag}</span>
            <span className="text-base font-extrabold text-[var(--t-txt0)]">{label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 1: Goal Select
    <div key="goal" className="mx-auto w-full max-w-xl">
      <h2 className="mb-2 text-center text-[22px] font-black text-[var(--t-txt0)]">
        {t.onboarding1}
      </h2>
      <p className="mb-6 text-center text-[13px] text-[var(--t-txt1)]">
        Your personal syllabus adapts to direct targets
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {goals.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setData((p) => ({ ...p, goal: g.id }));
              goTo(2);
            }}
            className={`cursor-pointer rounded-xl border-2 px-4 py-5 text-left outline-none ${
              data.goal === g.id
                ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)]"
                : "border-[var(--t-border)] bg-[var(--t-bg2)]"
            }`}
          >
            <div className="mb-2 text-[26px]">{g.icon}</div>
            <div className="mb-1 text-[13px] font-extrabold leading-snug text-[var(--t-txt0)]">
              {data.lang === "bn" ? g.titleBn : g.titleEn}
            </div>
            <div className="text-[11px] leading-tight text-[var(--t-txt1)]">
              {data.lang === "bn" ? g.subBn : g.subEn}
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Experience Lvl Select
    <div key="level" className="mx-auto w-full max-w-lg">
      <h2 className="mb-2 text-center text-[22px] font-black text-[var(--t-txt0)]">
        {t.onboarding2}
      </h2>
      <p className="mb-6 text-center text-[13px] text-[var(--t-txt1)]">
        Helps us position your conceptual baseline starting points
      </p>
      <div className="flex flex-col gap-3">
        {levels.map((l) => (
          <button
            key={l.id}
            onClick={() => {
              setData((p) => ({ ...p, level: l.id }));
              goTo(3);
            }}
            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 px-5 py-4 text-left ${
              data.level === l.id
                ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)]"
                : "border-[var(--t-border)] bg-[var(--t-bg2)]"
            }`}
          >
            <span className="text-[28px]">{l.icon}</span>
            <div>
              <div className="text-sm font-extrabold text-[var(--t-txt0)]">
                {data.lang === "bn" ? l.titleBn : l.titleEn}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--t-txt1)]">
                {data.lang === "bn" ? l.subBn : l.subEn}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>,

    // Step 3: Choose Track (10 items, no cost listed, highlighting completed tracks)
    <div key="track" className="mx-auto w-full max-w-2xl">
      <h2 className="mb-1.5 text-center text-[22px] font-black text-[var(--t-txt0)]">
        {t.onboarding3}
      </h2>
      <p className="mb-5 text-center text-[13px] text-[var(--t-txt1)]">
        Toggle tracks seamlessly at any time in your dashboard
      </p>
      {trackOptions.length === 0 ? (
        <p className="text-center text-[13px] text-[var(--t-amber)]">
          {data.lang === "bn"
            ? "কোনো প্রকাশিত ট্র্যাক নেই। Supabase-এ সিড মাইগ্রেশন চালান।"
            : "No published tracks found. Run the seed migration in Supabase."}
        </p>
      ) : null}
      <div className="mb-5 grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto pr-1.5 sm:grid-cols-2">
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
              goTo(4);
            }}
            className={`relative cursor-pointer rounded-xl border-2 p-4 text-left outline-none ${
              data.trackId === tr.id
                ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)]"
                : tr.completed
                ? "border-[#00C8964d] bg-[var(--t-bg2)]"
                : "border-[var(--t-border)] bg-[var(--t-bg2)]"
            }`}
          >
            <div className="mb-2 flex items-start justify-between">
              <span className="text-2xl">{tr.icon}</span>
              {tr.completed && (
                <span className="rounded-md border border-[var(--t-accent)]/30 bg-[#00C8961c] px-1.5 py-0.5 text-[9px] font-bold text-[var(--t-accent)]">
                  ✓ {data.lang === "bn" ? "সম্পন্ন" : "Completed"}
                </span>
              )}
            </div>
            <div className="pr-3 text-xs font-extrabold leading-snug text-[var(--t-txt0)]">
              {data.lang === "bn" ? tr.titleBn : tr.titleEn}
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-[var(--t-accent)]">
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
    <div key="assessment" className="mx-auto w-full max-w-xl">
      <h2 className="mb-2 text-center text-[21px] font-black text-[var(--t-txt0)]">
        {t.onboarding4}
      </h2>
      <p className="mb-3 text-center text-[13px] text-[var(--t-txt1)]">
        {data.lang === "bn"
          ? "আপনার নির্বাচিত ট্র্যাকের জন্য একটি সংক্ষিপ্ত ৩ মিনিটের মূল্যায়ন পরীক্ষা"
          : "Quick baseline appraisal customized for your selected study track"}
      </p>

      {/* Track confirmation text */}
      <div className="mb-4 rounded-lg border border-[var(--t-accent)]/30 bg-[var(--t-accent-dim)] px-3.5 py-2.5 text-xs leading-snug text-[var(--t-accent)]">
        ✦{" "}
        {data.lang === "bn"
          ? `নির্বাচিত পথ: ${trackOptions.find((tr) => tr.id === data.trackId)?.titleBn || "জেনারেল"}. এটি আপনার লেকচার সূচীকে সাজাবে।`
          : `Active path: ${trackOptions.find((tr) => tr.id === data.trackId)?.titleEn || "Your track"}.`}
      </div>

      <div className="mb-4 max-h-[45vh] overflow-y-auto pr-1">
        {activeQuestions.map((q, qi) => (
          <div
            key={qi}
            className="mb-3 rounded-xl border border-[var(--t-border)] bg-[var(--t-bg2)] px-4 py-3.5"
          >
            <div className="mb-3 text-[12.5px] font-extrabold leading-normal text-[var(--t-txt0)]">
              {qi + 1}. {data.lang === "bn" ? q.qBn : q.qEn}
            </div>
            <div className="flex flex-col gap-1.5">
              {(data.lang === "bn" ? q.optsBn : q.optsEn).map((opt, oi) => {
                const isSelected = quizAns[qi] === oi;
                return (
                  <button
                    key={oi}
                    onClick={() => setQuizAns((p) => ({ ...p, [qi]: oi }))}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[11.5px] text-[var(--t-txt0)] outline-none ${
                      isSelected
                        ? "border-[var(--t-accent)] bg-[var(--t-accent-dim)]"
                        : "border-[var(--t-border)] bg-[var(--t-bg3)]"
                    }`}
                  >
                    <div
                      className={`size-3.5 shrink-0 rounded-full border-[1.5px] ${
                        isSelected
                          ? "border-[var(--t-accent)] bg-[var(--t-accent)]"
                          : "border-[var(--t-border-hi)]"
                      }`}
                    />
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
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
          className="min-h-11 cursor-pointer rounded-[10px] border-none bg-[var(--t-accent)] p-3 text-[13px] font-extrabold text-black"
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
          className="min-h-11 cursor-pointer rounded-[10px] border border-[var(--t-border)] bg-transparent p-2.5 text-xs text-[var(--t-txt1)]"
        >
          {t.skipAssessment}
        </button>
      </div>
    </div>
  ];

  const stepLabels = ["🌐 Language", "🎯 Target", "⚡ Level", "📖 Track", "🖋 Evaluation"];

  return (
    <div
      style={themeVars(T)}
      className="flex min-h-screen flex-col items-center justify-center bg-[var(--t-bg0)] px-4 py-6 font-[family-name:'DM_Sans','Segoe_UI',system-ui,sans-serif]"
    >
      {/* Brand logo */}
      <div className="mb-6 flex items-center gap-2.5 sm:mb-8">
        <div className="flex size-[34px] items-center justify-center rounded-lg bg-[var(--t-accent)] text-base font-black text-black">
          F
        </div>
        <span className="text-[21px] font-black tracking-tight text-[var(--t-txt0)]">{t.brand}</span>
      </div>

      {/* Progress navigation pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 sm:mb-8">
        {stepLabels.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={`whitespace-nowrap rounded-2xl border-[1.5px] px-2.5 py-1 text-[10px] font-bold ${
                i < step
                  ? "border-[var(--t-accent)] bg-[var(--t-accent)] text-black"
                  : i === step
                  ? "border-[var(--t-accent)] bg-[var(--t-bg3)] text-[var(--t-accent)]"
                  : "border-[var(--t-border)] bg-[var(--t-bg2)] text-[var(--t-txt2)]"
              }`}
            >
              {s}
            </div>
            {i < 4 && (
              <div
                className={`h-[1.5px] w-3 ${i < step ? "bg-[var(--t-accent)]" : "bg-[var(--t-border)]"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Screen body container — swipe right to go back on touch devices */}
      <div className="w-full max-w-2xl overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 48 : -48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -48 : 48 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            drag={step > 0 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (step > 0 && (info.offset.x > 90 || info.velocity.x > 600)) {
                goTo(step - 1);
              }
            }}
          >
            {steps[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back flow modifier trigger */}
      {step > 0 && (
        <button
          onClick={() => goTo(step - 1)}
          className="mt-5 min-h-11 cursor-pointer border-none bg-transparent text-xs text-[var(--t-txt1)] outline-none"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
