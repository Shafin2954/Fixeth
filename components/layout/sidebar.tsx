"use client";

import React from "react";
import { Module, ChatMessage } from "@/types/ui";
import { PanelLeftClose } from "lucide-react";
import { TypingDots } from "@/components/ai/TypingDots";
import { ChatMarkdown } from "@/components/ai/ChatMarkdown";

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR: LEFT SIDE OUTLINE COURSE EXPLORER
// ═══════════════════════════════════════════════════════════════════
export function CourseExplorerSidebar({
  T,
  t,
  modules,
  openMods,
  setOpenMods,
  activeLessonId,
  setActiveLessonId,
  onPrevious,
  onNext,
  isCollapsed = false,
  onToggleCollapse
}: {
  T: any;
  t: any;
  modules: Module[];
  openMods: { [key: string]: boolean };
  setOpenMods: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div
      style={{
        width: isCollapsed ? 0 : 250,
        minWidth: isCollapsed ? 0 : 220,
        borderRight: isCollapsed ? "0 solid transparent" : `1px solid ${T.border}`,
        background: T.bg1,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        userSelect: "none",
        overflow: "hidden",
        overflowX: "hidden",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {/* Title block */}
      <div style={{ padding: "16px 18px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <div style={{ fontSize: 10, color: T.txt1, fontWeight: 700, letterSpacing: 1.2 }}>
            {t.activeTrack.toUpperCase()}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              style={{
                background: "none",
                border: "none",
                color: T.txt1,
                cursor: "pointer",
                padding: "2px 4px",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none"
              }}
            >
              <PanelLeftClose size={14} style={{ color: T.accent }} />
            </button>
          )}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: T.txt0, marginBottom: 10 }}>
          {t.brand === "Fixeth" ? "Python & Foundations" : "পাইথন এবং কারিগরি বেসিক"}
        </div>
        
        {/* Ring progress indicators */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", width: 36, height: 36, flexShrink: 0 }}>
            <svg width="36" height="36" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="14" fill="none" stroke={T.bg4} strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={T.accent}
                strokeWidth="3"
                strokeDasharray={88}
                strokeDashoffset={88 * (1 - 0.42)}
                strokeLinecap="round"
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: T.txt0 }}>
              42%
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: T.txt0, fontWeight: 700 }}>3 of 7 Complete</div>
            <div style={{ fontSize: 10, color: T.txt1 }}>Module 1 · Python</div>
          </div>
        </div>
      </div>

      {/* Accordion Module List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {modules.map((mod) => (
          <div key={mod.id} style={{ marginBottom: 4 }}>
            <button
              onClick={() => setOpenMods((p) => ({ ...p, [mod.id]: !p[mod.id] }))}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: T.txt0,
                textAlign: "left"
              }}
            >
              <span style={{ fontSize: 10, color: T.txt2, transition: "transform 0.2s" }}>
                {openMods[mod.id] ? "▼" : "▶"}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, flex: 1 }}>{mod.title}</span>
            </button>
            
            {openMods[mod.id] && (
              <div style={{ paddingLeft: 12 }}>
                {mod.lessons.map((lesson) => {
                  const isActive = activeLessonId === lesson.id;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 16px 8px 16px",
                        background: isActive ? T.accentDim : "none",
                        borderLeft: isActive ? `3px solid ${T.accent}` : "3px solid transparent",
                        cursor: "pointer",
                        transition: "background 0.1s"
                      }}
                    >
                      <div
                        style={{
                          width: 15,
                          height: 15,
                          borderRadius: "50%",
                          border: `1.5px solid ${lesson.done ? T.accent : T.borderHi}`,
                          background: lesson.done ? T.accent : "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 8,
                          color: "#000",
                          fontWeight: 900,
                          flexShrink: 0
                        }}
                      >
                        {lesson.done ? "✓" : ""}
                      </div>
                      <span style={{ fontSize: 11, color: isActive ? T.txt0 : T.txt1, flex: 1, lineHeight: 1.4, fontWeight: isActive ? 600 : 400 }}>
                        {lesson.title}
                      </span>
                      <span style={{ fontSize: 9, color: T.txt2, fontFamily: "monospace" }}>
                        {lesson.dur}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Nav Actions Footer */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8, background: T.bg1 }}>
        <button
          onClick={onPrevious}
          style={{
            flex: 1,
            background: T.bg3,
            border: `1px solid ${T.border}`,
            borderRadius: 8,
            padding: "8px 0",
            fontSize: 11,
            color: T.txt0,
            cursor: "pointer",
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          ← {t.brand === "Fixeth" ? "Previous" : "পূর্ববর্তী"}
        </button>
        <button
          onClick={onNext}
          style={{
            flex: 1,
            background: T.accent,
            border: "none",
            borderRadius: 8,
            padding: "8px 0",
            fontSize: 11,
            color: "#000",
            fontWeight: 700,
            cursor: "pointer",
            textAlign: "center"
          }}
        >
          {t.brand === "Fixeth" ? "Next" : "পরবর্তী"} →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDEBAR: RIGHT SIDE PORTABLE AI STUDIO MENTOR COMPANION
// ═══════════════════════════════════════════════════════════════════
export function AIChatSidebar({
  T,
  t,
  msgs,
  setMsgs,
  lang,
  width = 290,
  activeLessonId
}: {
  T: any;
  t: any;
  msgs: ChatMessage[];
  setMsgs: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  lang: string;
  width?: number;
  activeLessonId?: string;
}) {
  const [chatInput, setChatInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const aiAccent = "#10b981";

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isLoading]);

  const handleSend = async (overrideTxt?: string) => {
    const textToSend = (overrideTxt || chatInput).trim();
    if (!textToSend || isLoading) return;
    if (!overrideTxt) setChatInput("");

    setMsgs((p) => [...p, { role: "user", text: textToSend }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          lesson_id: activeLessonId || "",
          language: lang
        })
      });
      const json = await res.json();
      if (json?.data?.answer) {
        setMsgs((p) => [...p, { role: "ai", text: json.data.answer }]);
      } else {
        const errText = json?.error || (lang === "bn"
          ? "AI সাময়িকভাবে অনুপলব্ধ।"
          : "AI temporarily unavailable. Add an API key in the Admin Panel.");
        setMsgs((p) => [...p, { role: "ai", text: errText }]);
      }
    } catch {
      setMsgs((p) => [...p, { role: "ai", text: lang === "bn" ? "নেটওয়ার্ক ত্রুটি।" : "Network error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPills = lang === "bn"
    ? ["কোড উদাহরণ", "সহজ ব্যাখ্যা", "ভিডিও সারসংক্ষেপ", "কুইজ দাও"]
    : ["Code Example", "Explain Simple", "Video Summary", "Give Quiz"];

  return (
    <div
      style={{
        width: width,
        borderLeft: width === 0 ? "none" : `1px solid ${T.border}`,
        background: T.bg1,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden"
      }}
    >
      {/* Sidebar header matching attached premium mock */}
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: `${aiAccent}20`,
              border: `1.5px solid ${aiAccent}60`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: aiAccent,
              flexShrink: 0
            }}
          >
            ✦
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: "bold", color: T.txt0, letterSpacing: "0.2px" }}>
              {t.aiMentorTitle || "AI Studio Mentor"}
            </div>
            <div style={{ fontSize: 11, color: aiAccent, display: "flex", alignItems: "center", gap: 4, marginTop: 1, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: aiAccent, boxShadow: `0 0 6px ${aiAccent}` }} />
              Active AI Tutor (Online)
            </div>
          </div>
        </div>

        {/* Dynamic Topic badges matching the mock image */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div
            style={{
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#60a5fa",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            📹 {lang === "bn" ? "ফাংশন ও স্কোপ" : "Functions & Scope"}
          </div>
          <div
            style={{
              background: "rgba(139, 92, 246, 0.12)",
              border: "1px solid rgba(139, 92, 246, 0.35)",
              borderRadius: "6px",
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#c084fc",
              display: "flex",
              alignItems: "center",
              gap: 4
            }}
          >
            🗺️ {lang === "bn" ? "ডেটা সাইন্স" : "DS Track"}
          </div>
        </div>
      </div>

      {/* Scroll area for chatting */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px" }}>
        {msgs.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: isUser ? "row-reverse" : "row",
                gap: 10,
                marginBottom: 14,
                alignItems: "flex-start"
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: `${aiAccent}20`,
                    border: `1px solid ${aiAccent}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    color: aiAccent,
                    flexShrink: 0,
                    marginTop: 2
                  }}
                >
                  ✦
                </div>
              )}
              <div style={{ maxWidth: "80%", display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    background: isUser ? T.accent : T.bg2,
                    color: isUser ? "#000000" : T.txt0,
                    borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    fontSize: "13px",
                    border: isUser ? "none" : `1px solid ${T.border}`,
                    fontWeight: isUser ? 600 : "normal"
                  }}
                >
                  {isUser ? m.text : <ChatMarkdown text={m.text} color={T.txt0} />}
                </div>
                {m.timestamp && (
                  <button
                    onClick={() => {
                      // Trigger seek event dynamically across screens if supported
                      const evt = new CustomEvent("seekVideo", { detail: m.timestamp });
                      window.dispatchEvent(evt);
                    }}
                    style={{
                      marginTop: 6,
                      background: "rgba(245, 158, 11, 0.08)",
                      border: "1px solid rgba(245, 158, 11, 0.45)",
                      borderRadius: "8px",
                      padding: "5px 11px",
                      fontSize: "10.5px",
                      fontWeight: "bold",
                      color: "#f59e0b",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "box-shadow 0.15s, background 0.15s"
                    }}
                  >
                    ⏱ {lang === "bn" ? `টাইমস্ট্যাম্পে যান: ${m.timestamp}` : `Jump to ${m.timestamp}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div style={{ display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-start" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${aiAccent}20`, border: `1px solid ${aiAccent}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: aiAccent, flexShrink: 0, marginTop: 2 }}>✦</div>
            <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: "16px 16px 16px 4px", padding: "10px 14px" }}>
              <TypingDots color={aiAccent} />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested quick pills with clean round tags */}
      <div style={{ padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: `1px solid ${T.border}` }}>
        {quickPills.map((pill) => (
          <button
            key={pill}
            onClick={() => handleSend(pill)}
            style={{
              padding: "5px 12px",
              fontSize: "10px",
              fontWeight: 600,
              borderRadius: "14px",
              background: T.bg3,
              border: `1px solid ${T.border}`,
              color: T.txt1,
              cursor: "pointer",
              transition: "all 0.1s ease"
            }}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Input keyboard console with exact mockup layout */}
      <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: `1px solid ${T.border}`, alignItems: "center" }}>
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={lang === "bn" ? "মেন্টরকে যেকোনো প্রশ্ন করুন..." : "Ask AI mentor..."}
          style={{
            flex: 1,
            background: T.bg2,
            border: `1px solid ${T.border}`,
            borderRadius: "20px",
            padding: "8px 14px",
            color: T.txt0,
            fontSize: "12px",
            outline: "none"
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading}
          style={{
            background: T.accent,
            border: "none",
            borderRadius: "50%",
            width: 34,
            height: 34,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            color: "#000000",
            flexShrink: 0
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}
