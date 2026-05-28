"use client";

import React, { useState } from "react";
import { Module, ChatMessage } from "@/types/ui";

export default function SubmissionsScreen({
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
  activeLessonId: number;
  setActiveLessonId: any;
  onPrevious: any;
  onNext: any;
  aiMsgs: ChatMessage[];
  setAiMsgs: any;
  lang: string;
}) {
  const [view, setView] = useState<"list" | "submit" | "detail">("list");
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("rubric");

  const listItems = [
    { id: 1, title: "Functions & Scope — Module Homework", status: "Graded", score: 88, max: 100, date: "May 22" },
    { id: 2, title: "NumPy Vector Integration Setup", status: "Peer Review", score: null, max: 100, date: "May 24" },
    { id: 3, title: "Pandas Data Cleaning Pipeline", status: "Submitted", score: null, max: 100, date: "May 26" }
  ];

  const statusColor: { [key: string]: string } = {
    "Graded": T.accent,
    "Peer Review": T.blue,
    "Submitted": T.amber
  };

  const rubric = [
    { criterion: "Logic & Correctness", weight: 40, score: 36 },
    { criterion: "Modularity & Structure", weight: 30, score: 26 },
    { criterion: "Scope & Edge Cases", weight: 20, score: 18 },
    { criterion: "Inline Comments", weight: 10, score: 8 }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>

      {/* 5.2 Center Submissions List & Forms */}
      <div style={{ maxWidth: 850, margin: "0 auto", padding: "24px 16px 60px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h2 style={{ color: T.txt0, fontSize: 16, fontWeight: 900, margin: 0 }}>
              {t.submissions}
            </h2>
            <p style={{ color: T.txt1, fontSize: 11, margin: "3px 0 0" }}>
              Submit, track, and examine compiler analytics of assignments
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["list", "submit"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                style={{
                  padding: "6px 12px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  borderRadius: 6,
                  background: view === v ? T.accent : T.bg3,
                  color: view === v ? "#000" : T.txt1,
                  border: `1px solid ${T.border}`,
                  cursor: "pointer"
                }}
              >
                {v === "list" ? "📋 Hub Archive" : "📤 Submit New"}
              </button>
            ))}
          </div>
        </div>

        {view === "list" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {listItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setView("detail")}
                style={{
                  background: T.bg1,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  cursor: "pointer",
                  boxShadow: T.shadow,
                  transition: "border 0.1s"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 800, color: T.txt0, margin: "0 0 6px" }}>{item.title}</h3>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span
                        style={{
                          background: (statusColor[item.status] || T.txt2) + "1c",
                          color: statusColor[item.status] || T.txt0,
                          border: `1px solid ${(statusColor[item.status] || T.txt2)}3d`,
                          borderRadius: 4,
                          padding: "1px 6px",
                          fontSize: 9,
                          fontWeight: 700
                        }}
                      >
                        {item.status}
                      </span>
                      <span style={{ fontSize: 10, color: T.txt2 }}>Uploaded {item.date}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    {item.score !== null ? (
                      <div>
                        <span style={{ fontSize: 18, fontWeight: 900, color: T.accent }}>{item.score}</span>
                        <span style={{ fontSize: 10, color: T.txt1 }}> / {item.max}</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: T.txt2 }}>Awaiting Grader</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : view === "submit" ? (
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, boxShadow: T.shadow }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.txt0, margin: "0 0 6px" }}>
              Submit: Hands-on Scope Project
            </h3>
            <p style={{ color: T.txt1, fontSize: 11.5, margin: "0 0 16px", lineHeight: 1.4 }}>
              Submit your finalized Python module files or Jupyter Notebooks. Ensure clean, modular documentation.
            </p>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                setFileUploaded(true);
              }}
              style={{
                border: `1.5px dashed ${dragActive ? T.accent : T.border}`,
                borderRadius: 10,
                background: dragActive ? T.accentDim : "none",
                padding: "36px 16px",
                textAlign: "center",
                cursor: "pointer"
              }}
            >
              {fileUploaded ? (
                <div>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>✅</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.accent }}>homework_submission.py successfully attached!</span>
                  <span style={{ fontSize: 10, color: T.txt1, display: "block", marginTop: 4 }}>18.4 KB · Click to replace</span>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: 24, display: "block", marginBottom: 6 }}>📥</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.txt0 }}>{t.dragDrop}</span>
                  <span style={{ fontSize: 10, color: T.txt2, display: "block", marginTop: 4 }}>Accepts .py · .ipynb · .zip · Max 10MB</span>
                </div>
              )}
            </div>

            {fileUploaded && (
              <div style={{ marginTop: 14 }}>
                <textarea
                  placeholder="Insert notes for academic consensus scoring (optional)..."
                  style={{
                    width: "100%",
                    height: 60,
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: "8px 12px",
                    color: T.txt0,
                    fontSize: 12,
                    outline: "none",
                    resize: "none",
                    fontFamily: "inherit"
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
                  <button
                    onClick={() => {
                      setView("list");
                      setFileUploaded(false);
                    }}
                    style={{
                      background: "none",
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 11,
                      color: T.txt1,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setView("list");
                      setFileUploaded(false);
                    }}
                    style={{
                      background: T.accent,
                      border: "none",
                      borderRadius: 6,
                      color: "#000",
                      fontWeight: 700,
                      padding: "6px 14px",
                      fontSize: 11,
                      cursor: "pointer"
                    }}
                  >
                    Submit Assignment ➜
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Detail scorecard mode */
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, boxShadow: T.shadow }}>
            <button
              onClick={() => setView("list")}
              style={{ background: "none", border: "none", color: T.accent, fontSize: 11.5, cursor: "pointer", padding: "0 0 12px", outline: "none" }}
            >
              ← Back to Overview
            </button>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${T.border}`, paddingBottom: 12, marginBottom: 14 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: T.txt0, margin: "0 0 4px" }}>Functions & Scope — Module Homework</h3>
                <span style={{ background: T.accentDim, color: T.accent, border: `1px solid ${T.accent}33`, padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                  Consensus Graded
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: T.accent }}>88</span>
                <span style={{ fontSize: 11, color: T.txt1 }}> / 100</span>
              </div>
            </div>

            {/* Rubrics Subtabs */}
            <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
              {[
                ["rubric", t.rubric],
                ["peer", t.peerReview]
              ].map(([tKey, label]) => {
                const isSel = activeSubTab === tKey;
                return (
                  <button
                    key={tKey}
                    onClick={() => setActiveSubTab(tKey)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 10.5,
                      borderRadius: 6,
                      background: isSel ? T.accent : T.bg2,
                      color: isSel ? "#000" : T.txt1,
                      border: `1px solid ${T.border}`,
                      cursor: "pointer",
                      fontWeight: 700
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {activeSubTab === "rubric" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rubric.map((rub, rIdx) => (
                  <div key={rIdx}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: T.txt0, marginBottom: 4, fontWeight: 600 }}>
                      <span>{rub.criterion}</span>
                      <span>{rub.score}/{rub.weight}</span>
                    </div>
                    {/* Progress tracking line */}
                    <div style={{ height: 4, background: T.bg4, borderRadius: 2 }}>
                      <div style={{ width: `${(rub.score / rub.weight) * 100}%`, height: "100%", background: T.accent, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSubTab === "peer" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { reviewer: "User #8421", pct: 90, comment: "Highly readable code structure. Excellent comment notation." },
                  { reviewer: "User #0412", pct: 86, comment: "Pure scoping checks were cleanly traced. Handles arrays beautifully." }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: T.bg2, borderRadius: 6, padding: 10, border: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4, fontWeight: 700, color: T.txt0 }}>
                      <span>{item.reviewer}</span>
                      <span style={{ color: T.accent }}>{item.pct}/100</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 11, color: T.txt1, lineHeight: 1.4 }}>{item.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
