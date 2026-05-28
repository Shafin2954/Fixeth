"use client";

import React, { useState, useEffect, useRef } from "react";
import { Module, ChatMessage } from "@/types/ui";

type PracticeItem = {
  q: string;
  opts: string[];
  ans: number;
};

const createLocalizedChatLog = (selectedLang: string): ChatMessage[] => [
  { role: "ai", text: selectedLang === "bn" ? "এই লেকচার ভিডিও সম্পর্কে কিছু জিজ্ঞেস করুন!" : "Ask me anything about this video's logic!" }
];

const createLocalizedPractices = (selectedLang: string): PracticeItem[] => [
  {
    q: selectedLang === "bn" ? "ফাংশন ডিক্লেয়ার করার সঠিক কীওয়ার্ড কোনটি?" : "Which keyword is used to declare a function in Python?",
    opts: ["func", "def", "lambda", "define"],
    ans: 1
  },
  {
    q: selectedLang === "bn" ? "ফাংশনের ভেতর ডিক্লেয়ার করা ভ্যারিয়েবলের স্কোপ কেমন হয়?" : "What scope does a variable declared inside a Python function have?",
    opts: ["Global scope", "Internal local scope", "Relational scope", "Shared outer scope"],
    ans: 1
  }
];

const createLocalizedNotes = (selectedLang: string) =>
  selectedLang === "bn"
    ? "📝 আমার কোর্স নোটস:\n• পাইথনে ফাংশন লেখার জন্য 'def' কীওয়ার্ড ব্যবহার করা হয়\n• 'return' স্টেটমেন্ট দিয়ে মান পাঠানো হয়\n• লোকাল স্কোপ ভ্যারিয়েবল শুধুমাত্র ফাংশনের ভেতরেই সক্রিয় থাকে।"
    : "📝 My Personal Lecture Notes:\n• Python functions are defined with the 'def' keyword\n• Use 'return' to send computed results back\n• Local scope keeps variables inside the function body only.";

export default function GuidedVideoScreen({
  T,
  t,
  modules,
  activeLessonId,
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
  const [playing, setPlaying] = useState(false);
  const [activeViewers, setActiveViewers] = useState(148);
  const [videoLang, setVideoLang] = useState<"en" | "bn" | "off">(lang === "bn" ? "bn" : "en");
  const [dockOnSide, setDockOnSide] = useState(true);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveViewers((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return next < 10 ? 12 : next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState("Notes");
  const [seekTime, setSeekTime] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>(() => createLocalizedChatLog(lang));
  const [practices, setPractices] = useState<PracticeItem[]>(() => createLocalizedPractices(lang));
  const [userAssessAnswers, setUserAssessAnswers] = useState<{ [key: number]: number }>({});
  const [notesText, setNotesText] = useState(() => createLocalizedNotes(lang));

  useEffect(() => {
    setVideoLang(lang === "bn" ? "bn" : "en");
    setChatLog(createLocalizedChatLog(lang));
    setPractices(createLocalizedPractices(lang));
    setNotesText(createLocalizedNotes(lang));
  }, [lang]);

  const subtitles = {
    en: "Functions group reusable segments of logic to avoid redundant boilerplate code execution.",
    bn: "ফাংশন মূলত কোডের পুনঃব্যবহারযোগ্য অংশগুলোকে এক গ্রুপে সাজায় যাতে একই কোড বারবার লিখতে না হয়।"
  };

  const handleSeek = (time: string) => {
    setSeekTime(time);
    setPlaying(true);
    setTimeout(() => setSeekTime(null), 2000);
  };

  const handleLocalChat = () => {
    if (!chatInput.trim()) return;
    const txt = chatInput;
    setChatInput("");

    const isQuestionWanted = /quiz|questions|test|অনুশীলন|কুইজ/i.test(txt);

    const userMsg: ChatMessage = { role: "user", text: txt };
    let aiMsg: ChatMessage = { role: "ai", text: "" };

    if (isQuestionWanted) {
      aiMsg.text = lang === "bn"
        ? "ভিডিও থেকে অনুশীলনীর কুইজ প্রশ্ন প্রস্তুত করা হয়েছে! নিচে 'অনুশীলনী' ট্যাব চেক করুন।"
        : "I have prepared custom practice statements for you! Check the 'Practice' tab below.";
      setActiveTab("Practice");
    } else if (txt.toLowerCase().includes("return") || txt.includes("রিটার্ন")) {
      aiMsg.text = lang === "bn"
        ? "হ্যাঁ! রিটার্ন কিওয়ার্ড ফাংশনের কাজ শেষ করে মান প্রেরণ করে। উদাহরণস্বরূপ ভিডিওর ১৪:৩২ সেকেন্ডের অংশটি দেখুন।"
        : "Perfect scope tracker. The `return` keyword is fully covered around 14:32 in this sequence.";
      aiMsg.timestamp = "14:32";
    } else {
      aiMsg.text = lang === "bn"
        ? "আমি আপনার প্রশ্নটি ভিডিওর ট্রান্সক্রিপ্ট এবং নোটে মিলিয়ে খুঁজেছি। এ বিষয়ে আরো বিস্তারিত তথ্য নিচে যুক্ত রয়েছে।"
        : "I've indexed your question against the lesson transcripts. Refer to the specific timestamps below.";
    }

    setChatLog((p) => [...p, userMsg, aiMsg]);
  };

  const handleFullscreen = () => {
    if (videoContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoContainerRef.current.requestFullscreen().catch((err) => {
          console.error("Error enabling fullscreen", err);
        });
      }
    }
  };

  const tabs = lang === "bn"
    ? ["নোটস", "ট্রান্সক্রিপ্ট", "ভিডিও চ্যাট", "অনুশীলনী"]
    : ["Notes", "Transcript", "Chat with Video", "Practice"];

  // Modular Video Player render logic
  const renderVideoPlayer = () => {
    return (
      <div style={{ width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div
          ref={videoContainerRef}
          style={{
            aspectRatio: "16/9",
            background: "linear-gradient(135deg, #090911 0%, #0c182c 50%, #03140a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}
        >
          {/* Visual simulation screen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "16px",
              fontFamily: "monospace",
              fontSize: 11,
              color: "rgba(0, 200, 150, 0.4)",
              lineHeight: 1.7,
              userSelect: "none"
            }}
          >
            <div style={{ color: "rgba(167, 139, 250, 0.7)" }}>def process_analytics(df):</div>
            <div style={{ paddingLeft: 20, color: "rgba(74, 158, 255, 0.7)" }}>cleaned = df.dropna()</div>
            <div style={{ paddingLeft: 20, color: "rgba(74, 158, 255, 0.7)" }}>return cleaned.describe()</div>
          </div>

          {/* Play button overlay */}
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.15)",
              border: "1.5px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              zIndex: 3,
              backdropFilter: "blur(4px)",
              fontSize: 16,
              color: "#fff",
              outline: "none"
            }}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Jump Moment Indicators */}
          {seekTime && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: T.amber,
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 10,
                color: "#000",
                fontWeight: 900,
                zIndex: 4
              }}
            >
              ⏱ Jumped to {seekTime}
            </div>
          )}

          {/* Simulated Live localized Caption */}
          {videoLang !== "off" && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(0, 0, 0, 0.8)",
                borderRadius: 6,
                padding: "6px 14px",
                fontSize: 11,
                color: "#FFF",
                textAlign: "center",
                maxWidth: "85%",
                zIndex: 2,
                lineHeight: 1.4,
                border: "1px solid rgba(255,255,255,0.1)"
              }}
            >
              {videoLang === "bn" ? subtitles.bn : subtitles.en}
            </div>
          )}
        </div>

        {/* Sub Player Control strip */}
        <div style={{ background: T.bg2, padding: "8px 12px", display: "flex", alignItems: "center", gap: 12, borderTop: `1px solid ${T.border}`, flexWrap: "wrap" }}>
          <button
            onClick={() => setPlaying(!playing)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: T.txt0, outline: "none" }}
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Play Line */}
          <div style={{ flex: 1, minWidth: 100, height: 3, background: T.bg4, borderRadius: 2, position: "relative" }}>
            <div style={{ width: "52%", height: "100%", background: T.accent, borderRadius: 2 }} />
            <div style={{ position: "absolute", left: "14%", top: "50%", transform: "translateY(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.amber }} />
            <div style={{ position: "absolute", left: "52%", top: "50%", transform: "translateY(-50%)", width: 4, height: 4, borderRadius: "50%", background: T.amber }} />
          </div>

          <span style={{ fontSize: 9, color: T.txt1, fontFamily: "monospace" }}>
            14:32 / 24:18
          </span>

          {/* Captions selector */}
          <div style={{ display: "flex", background: T.bg3, borderRadius: 6, overflow: "hidden", border: `1px solid ${T.border}`, padding: 1.5 }}>
            {[
              ["en", "EN"],
              ["bn", "বাংলা"],
              ["off", "OFF"]
            ].map(([lCode, label]) => (
              <button
                key={lCode}
                onClick={() => setVideoLang(lCode as any)}
                style={{
                  padding: "2px 6px",
                  fontSize: 8.5,
                  fontWeight: 700,
                  background: videoLang === lCode ? T.accent : "none",
                  color: videoLang === lCode ? "#000" : T.txt1,
                  border: "none",
                  cursor: "pointer",
                  borderRadius: 4
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Native Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            title={lang === "bn" ? "ফুল স্ক্রিন" : "Fullscreen"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              color: T.txt0,
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              outline: "none"
            }}
          >
            📺
          </button>

          {/* Minimal Live Viewers Counter Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: T.accentDim,
              border: `1px solid ${T.accent}33`,
              borderRadius: 6,
              padding: "3px 8px",
              fontSize: 9.5,
              fontWeight: 700,
              color: T.accent
            }}
            title={lang === "bn" ? `${activeViewers} জন লাইভ শিখছেন` : `${activeViewers} students active now`}
          >
            <span style={{ width: 5, height: 5, background: T.accent, borderRadius: "50%", display: "inline-block", boxShadow: `0 0 6px ${T.accent}` }} />
            {activeViewers} live
          </div>
        </div>
      </div>
    );
  };

  // Modular Tabs panel render logic
  const renderTabsPanel = (isSideMode: boolean = false) => {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          margin: isSideMode ? "0 4px" : "4px 0 0",
          background: T.bg1,
          border: `1px solid ${T.border}`,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: T.shadow,
          minHeight: isSideMode ? "100%" : 280
        }}
      >
        {/* Tabs selector bar */}
        <div style={{ display: "flex", borderBottom: `1px solid ${T.border}`, background: T.bg2 }}>
          {tabs.map((tab, idx) => {
            const tabKeys = ["Notes", "Transcript", "Chat with Video", "Practice"];
            const currentKey = tabKeys[idx];
            const isSelected = activeTab === currentKey;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(currentKey)}
                style={{
                  padding: isSideMode ? "10px 12px" : "10px 18px",
                  fontSize: isSideMode ? 10.5 : 11.5,
                  fontWeight: 700,
                  background: isSelected ? T.bg1 : "none",
                  border: "none",
                  borderBottom: isSelected ? `2.5px solid ${T.accent}` : "2.5px solid transparent",
                  color: isSelected ? T.accent : T.txt1,
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab active content layout */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
          {activeTab === "Notes" && (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                style={{
                  width: "100%",
                  flex: 1,
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 12,
                  color: T.txt0,
                  lineHeight: 1.6,
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit"
                }}
              />
              <div style={{ height: 4 }} />
              <div style={{ fontSize: 10, color: T.txt2, textAlign: "right" }}>
                ✦ {lang === "bn" ? "ক্লাউড সিঙ্ক্রোনাইজেশন আর্কাইভে সংরক্ষিত হয়েছে" : "Auto-saved to Cloud Sync Archive"}
              </div>
            </div>
          )}

          {activeTab === "Transcript" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { time: "12:05", textEn: "Today we will analyze how variables act inside scoped blocks.", textBn: "আজকে আমরা আলোচনা করব কীভাবে ভ্যারিয়েবল লোকাল ব্লকের ভেতর কাজ করে।" },
                { time: "14:32", textEn: "The 'return' parameter yields a value and releases process threads.", textBn: "রিটার্ন কিওয়ার্ডটি ফাংশন সম্পন্ন করে এবং প্রস্তুতকৃত মানটিকে ব্যাক করে পাঠায়।", highlight: true },
                { time: "18:50", textEn: "Let us review an exercise using pandas DataFrame instances.", textBn: "চলুন এবার প্যান্ডাস ডেটাফ্রেম ব্যবহার করে একটি বাস্তব ব্যবহারিক উদাহরণ দেখি।" }
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSeek(item.time)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: item.highlight ? T.accentDim : "transparent",
                    border: item.highlight ? `1px solid ${T.accent}33` : `1px solid ${T.border}33`,
                    transition: "background 0.1s"
                  }}
                >
                  <span style={{ fontSize: 10, color: T.accent, fontWeight: 900, fontFamily: "monospace" }}>
                    {item.time}
                  </span>
                  <span style={{ fontSize: 12, color: T.txt0, lineHeight: 1.4 }}>
                    {lang === "bn" ? item.textBn : item.textEn}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "Chat with Video" && (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
                {chatLog.map((chat, idx) => {
                  const isUser = chat.role === "user";
                  return (
                    <div key={idx} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: 8, marginBottom: 10 }}>
                      <div
                        style={{
                          background: isUser ? T.accent : T.bg3,
                          color: isUser ? "#000" : T.txt0,
                          borderRadius: isUser ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
                          padding: "6px 12px",
                          fontSize: 11.5,
                          lineHeight: 1.5,
                          maxWidth: "80%"
                        }}
                      >
                        {chat.text}
                        {chat.timestamp && (
                          <button
                            onClick={() => handleSeek(chat.timestamp!)}
                            style={{
                              display: "block",
                              marginTop: 4,
                              background: T.amberDim,
                              border: `1px solid ${T.amber}40`,
                              color: T.amber,
                              borderRadius: 4,
                              padding: "1px 6px",
                              fontSize: 9.5,
                              cursor: "pointer"
                            }}
                          >
                            ⏱ Jump {chat.timestamp}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6, borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLocalChat()}
                  placeholder={lang === "bn" ? "ভিডিওর যেকোনো রেফারেন্সে প্রশ্ন করুন..." : "Inquire about this specific segment..."}
                  style={{
                    flex: 1,
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: "6px 10px",
                    color: T.txt0,
                    fontSize: 12,
                    outline: "none"
                  }}
                />
                <button
                  onClick={handleLocalChat}
                  style={{
                    background: T.accent,
                    border: "none",
                    borderRadius: 8,
                    width: 32,
                    height: 32,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                    fontWeight: 700
                  }}
                >
                  ↑
                </button>
              </div>
            </div>
          )}

          {activeTab === "Practice" && (
            <div>
              {practices.map((quiz, qIdx) => (
                <div
                  key={qIdx}
                  style={{
                    background: T.bg2,
                    border: `1px solid ${T.border}`,
                    borderRadius: 10,
                    padding: "12px",
                    marginBottom: 10
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, color: T.txt0, marginBottom: 8 }}>
                    {qIdx + 1}. {quiz.q}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {quiz.opts.map((opt: string, oIdx: number) => {
                      const isPicked = userAssessAnswers[qIdx] === oIdx;
                      const isCorrect = userAssessAnswers[qIdx] !== undefined && oIdx === quiz.ans;
                      const isWrong = isPicked && oIdx !== quiz.ans;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => setUserAssessAnswers((p) => ({ ...p, [qIdx]: oIdx }))}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "6px 10px",
                            background: isCorrect ? T.accentDim : isWrong ? T.redDim : isPicked ? T.blueDim : T.bg3,
                            border: `1px solid ${
                              isCorrect
                                ? T.accent + "60"
                                : isWrong
                                ? T.red + "60"
                                : isPicked
                                ? T.blue + "40"
                                : T.border
                            }`,
                            borderRadius: 6,
                            color: T.txt0,
                            fontSize: 11,
                            cursor: "pointer",
                            textAlign: "left"
                          }}
                        >
                          <span
                            style={{
                              width: 12,
                              height: 12,
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
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        background: T.bg0,
        position: "relative",
        overflowY: "auto",
        padding: "16px"
      }}
    >
      {/* Topic header with Dock Toggle */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: T.bg1,
          border: `1px solid ${T.border}`,
          borderRadius: 10,
          padding: "10px 16px",
          marginBottom: 14,
          boxShadow: T.shadow
        }}
      >
        <div>
          <div style={{ fontSize: 9.5, color: T.accent, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>
            {lang === "bn" ? "ভিডিও লেকচার" : "ACTIVE LESSON VIDEO"}
          </div>
          <h3 style={{ fontSize: 13, fontWeight: 900, color: T.txt0, margin: "2px 0 0" }}>
            {modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))?.lessons.find((l) => l.id === activeLessonId)?.title || "1.3 Scopes and Scuttles Check"}
          </h3>
        </div>

        {/* Dock Control Toggle */}
        <button
          onClick={() => setDockOnSide(!dockOnSide)}
          style={{
            background: T.bg2,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "6px 12px",
            color: T.accent,
            fontSize: 10.5,
            fontWeight: 800,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            outline: "none"
          }}
        >
          {dockOnSide ? "🥞 Move Notes Below" : "📋 Dock Notes to Side"}
        </button>
      </div>

      {/* Main Layout Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        {dockOnSide ? (
          /* Side-by-Side Split View */
          <div style={{ flex: 1, display: "flex", gap: 14, minHeight: 0, paddingBottom: 6 }}>
            {/* Left Column: Video player */}
            <div style={{ flex: 1.3, display: "flex", flexDirection: "column", minWidth: 300, justifyContent: "flex-start" }}>
              <div style={{ width: "100%", background: "#000", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
                {renderVideoPlayer()}
              </div>
            </div>

            {/* Right Column: Interactive Tabs panel */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 280 }}>
              {renderTabsPanel(true)}
            </div>
          </div>
        ) : (
          /* Stacked View (Video on top, Tabs below) */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Centered Video Player */}
            <div style={{ width: "100%", maxWidth: "720px", margin: "0 auto", background: "#000", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
              {renderVideoPlayer()}
            </div>

            {/* Bottom tabs block */}
            {renderTabsPanel(false)}
          </div>
        )}
      </div>
    </div>
  );
}
