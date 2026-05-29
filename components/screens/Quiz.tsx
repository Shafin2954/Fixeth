"use client";

import React, { useState } from "react";
import { Module, ChatMessage } from "@/types/ui";

export default function QuizScreen({
  T,
  t,
  modules,
  openMods,
  setOpenMods,
  activeLessonId,
  setActiveLessonId,
  onPrevious,
  onNext,
  aiMsgs,
  setAiMsgs,
  lang
}: {
  T: any;
  t: any;
  modules: Module[];
  openMods: any;
  setOpenMods: any;
  activeLessonId: string;
  setActiveLessonId: any;
  onPrevious: any;
  onNext: any;
  aiMsgs: ChatMessage[];
  setAiMsgs: any;
  lang: string;
}) {
  const [picked, setPicked] = useState<{ [key: number]: number }>({});
  const [complete, setComplete] = useState(false);

  const questions = [
    {
      q: lang === "bn"
        ? "list(map(lambda x: x**2, [1, 2, 3])) কোডটির আউটপুট কী হবে?"
        : "What is the output of the expression: list(map(lambda x: x**2, [1, 2, 3]))?",
      opts: ["[1, 4, 9]", "[2, 4, 6]", "[1, 2, 3]", "SyntaxError"],
      ans: 0
    },
    {
      q: lang === "bn"
        ? "পাইথনে কোনো লিস্টের শেষ উপাদান অপসারণ করতে এবং ফেরত পেতে কোন পদ্ধতিটি ব্যবহার করা হয়?"
        : "Which method is utilized to pop and return the final element of a list in Python?",
      opts: [".remove()", ".delete()", ".pop()", ".last()"],
      ans: 2
    },
    {
      q: lang === "bn"
        ? "জাভাস্ক্রিপ্ট এবং পাইথন হুকে বিশুদ্ধ ফাংশন ব্যবহারের প্রধান সুবিধা কী?"
        : "What is the key benefit of utilizing pure functions in your programming pipeline?",
      opts: [
        lang === "bn" ? "কোন রিয়েল স্টেট পরিবর্তন ছাড়াই একই ইনপুটের জন্য একই আউটপুট দেওয়া" : "Yields identical outputs for identical inputs with zero mutated side-effects",
        lang === "bn" ? "কম মেমরি ব্যবহার এবং দ্রুত ফাইল রিড করা" : "Uses less system cache pages and fetches local files exponentially fast",
        lang === "bn" ? "ওলামা লোকাল এআই এর সাথে গ্লোবাল সিঙ্ক করা" : "Synchronizes parameters perfectly with local Ollama clients",
        lang === "bn" ? "ডাটাবেজ লিংক সিকিউর এনক্রিপশন করা" : "Triggers automatic backup processes onto self-hosted clouds"
      ],
      ans: 0
    }
  ];

  const totalQuestions = questions.length;
  const attemptedCount = Object.keys(picked).length;
  const correctCount = Object.keys(picked).filter((k) => questions[Number(k)].ans === picked[Number(k)]).length;

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

      {/* 4.2 Center Quiz question list */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: T.bg0,
          borderRight: `1px solid ${T.border}`,
          overflowY: "auto"
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px 60px", width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ color: T.txt0, fontSize: 16, fontWeight: 900, margin: 0 }}>
                {lang === "bn" ? "মডিউল পরীক্ষা ও ক্যুইজ" : "Module Core Appraisal Quiz"}
              </h2>
              <p style={{ color: T.txt1, fontSize: 11, margin: "3px 0 0" }}>
                Adaptive grading checkpoint · Minimum 75% required to proceed
              </p>
            </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Progress indicator */}
            <div style={{ position: "relative", width: 34, height: 34 }}>
              <svg width="34" height="34" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="17" cy="17" r="13" fill="none" stroke={T.bg4} strokeWidth="3" />
                <circle
                  cx="17"
                  cy="17"
                  r="13"
                  fill="none"
                  stroke={T.accent}
                  strokeWidth="3"
                  strokeDasharray={82}
                  strokeDashoffset={82 * (1 - attemptedCount / totalQuestions)}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: T.txt0 }}>
                {attemptedCount}/{totalQuestions}
              </div>
            </div>

            {attemptedCount === totalQuestions && (
              <span style={{ background: "#00C8961a", color: T.accent, border: `1px solid ${T.accent}4d`, padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 700 }}>
                {correctCount}/{totalQuestions} Correct
              </span>
            )}
          </div>
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              style={{
                background: T.bg1,
                border: `1px solid ${T.border}`,
                borderRadius: 12,
                padding: "16px",
                boxShadow: T.shadow
              }}
            >
              <div style={{ fontSize: 12.5, fontWeight: 800, color: T.txt0, marginBottom: 12, lineHeight: 1.55 }}>
                {qIdx + 1}. {q.q}
              </div>

              {/* Options list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.opts.map((opt, oIdx) => {
                  const isPicked = picked[qIdx] === oIdx;
                  const isCorrect = picked[qIdx] !== undefined && oIdx === q.ans;
                  const isWrong = isPicked && oIdx !== q.ans;

                  return (
                    <button
                      key={oIdx}
                      onClick={() => setPicked((p) => ({ ...p, [qIdx]: oIdx }))}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "8px 12px",
                        background: isCorrect ? T.accentDim : isWrong ? T.redDim : isPicked ? T.blueDim : T.bg2,
                        border: `1px solid ${
                          isCorrect
                            ? T.accent + "50"
                            : isWrong
                            ? T.red + "50"
                            : isPicked
                            ? T.blue + "40"
                            : T.border
                        }`,
                        borderRadius: 8,
                        color: T.txt0,
                        fontSize: 11.5,
                        cursor: "pointer",
                        textAlign: "left",
                        outline: "none"
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          border: `1.5px solid ${isPicked ? T.accent : T.borderHi}`,
                          background: isPicked ? T.accent : "none",
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
        </div>
      </div>

    </div>
  );
}
