"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, useDragControls } from "framer-motion";
import { Module, ChatMessage } from "@/types/ui";
import { YouTubePlayer, type YouTubePlayerHandle } from "@/components/lesson/youtube-player";
import { LessonNotes } from "@/components/lesson/lesson-notes";
import { createClient } from "@/lib/supabase/client";
import { markLessonComplete } from "@/lib/supabase/queries/progress";
import {
  fetchTranscriptChunks,
  formatSeconds,
  buildTimedSegments,
  getTopicsWithChunks,
  type TranscriptChunk
} from "@/lib/supabase/queries/transcript";
import { runChat, isAiConfigured, AiNotConfiguredError, type AiPrefs } from "@/lib/ai/byoa";
import {
  buildContext,
  buildSystemPrompt,
  buildUserPrompt,
  parseAnswerSegments,
  buildTopicContext
} from "@/lib/ai/video-chat";
import { themeVars } from "@/lib/ui/theme-vars";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";
import type { Lesson } from "@/types";

type PracticeItem = {
  q: string;
  opts: string[];
  ans: number;
};

type SheetSnap = "peek" | "half" | "full";
type TabsPanelMode = "side" | "stacked" | "sheet";

const createLocalizedChatLog = (selectedLang: string): ChatMessage[] => [
  { role: "ai", text: selectedLang === "bn" ? "এই লেকচার ভিডিও সম্পর্কে কিছু জিজ্ঞেস করুন!" : "Ask me anything about this video's logic!" }
];

const createLocalizedPractices = (selectedLang: string): PracticeItem[] => [
  {
    q: selectedLang === "bn" ? "ফাংশন ডিক্লেয়ার করার সঠিক কীওয়ার্ড কোনটি?" : "Which keyword is used to declare a function in Python?",
    opts: ["func", "def", "lambda", "define"],
    ans: 1
  },
  {
    q: selectedLang === "bn" ? "ফাংশনের ভেতর ডিক্লেয়ার করা ভ্যারিয়েবলের স্কোপ কেমন হয়?" : "What scope does a variable declared inside a Python function have?",
    opts: ["Global scope", "Internal local scope", "Relational scope", "Shared outer scope"],
    ans: 1
  }
];

const createLocalizedNotes = (selectedLang: string) =>
  selectedLang === "bn"
    ? "📝 আমার কোর্স নোটস:\n• পাইথনে ফাংশন লেখার জন্য 'def' কীওয়ার্ড ব্যবহার করা হয়\n• 'return' স্টেটমেন্ট দিয়ে মান পাঠানো হয়\n• লোকাল স্কোপ ভ্যারিয়েবল শুধুমাত্র ফাংশনের ভেতরেই সক্রিয় থাকে।"
    : "📝 My Personal Lecture Notes:\n• Python functions are defined with the 'def' keyword\n• Use 'return' to send computed results back\n• Local scope keeps variables inside the function body only.";

export default function GuidedVideoScreen({
  T,
  t,
  modules,
  activeLessonId,
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
  const { authUser, preferences } = useAppTheme();
  const { activeLesson, enrollmentTrackId, refreshCurriculum } = useCourse();
  const [lessonRow, setLessonRow] = useState<Lesson | null>(null);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [completeMsg, setCompleteMsg] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [activeViewers, setActiveViewers] = useState(148);
  const [videoLang, setVideoLang] = useState<"en" | "bn" | "off">(lang === "bn" ? "bn" : "en");
  const [dockOnSide, setDockOnSide] = useState(true);

  const [transcript, setTranscript] = useState<TranscriptChunk[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chatLoading, setChatLoading] = useState(false);
  const playerHandleRef = useRef<YouTubePlayerHandle | null>(null);

  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Mobile bottom-sheet state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [containerH, setContainerH] = useState(0);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("peek");
  const sheetDragControls = useDragControls();

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setContainerH(containerRef.current?.clientHeight ?? 0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const sheetH = containerH || 600;
  const snapOffsets: Record<SheetSnap, number> = {
    full: Math.max(12, Math.round(sheetH * 0.06)),
    half: Math.round(sheetH * 0.5),
    peek: Math.max(0, sheetH - 104)
  };

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

  // Prefer the lesson row only when it matches the active lesson; otherwise
  // fall back to the curriculum list so switching lessons never shows the
  // previously loaded video while the new row is still being fetched.
  const youtubeId =
    (lessonRow && lessonRow.id === activeLessonId
      ? lessonRow.youtube_video_id
      : null) ||
    activeLesson?.youtubeVideoId ||
    null;

  // Rebuild plausible per-segment timestamps when the stored transcript lacks
  // real timing (single chunk @ 0:00). Recomputes once the real duration loads.
  const timedTranscript = useMemo(
    () => buildTimedSegments(transcript, duration),
    [transcript, duration]
  );

  useEffect(() => {
    if (!activeLessonId) {
      setTranscript([]);
      setLessonRow(null);
      return;
    }
    // Clear the stale row immediately so the player swaps to the new video.
    setLessonRow(null);
    setTranscript([]);
    const supabase = createClient();
    void supabase
      .from("lessons")
      .select("*")
      .eq("id", activeLessonId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setLessonRow(data as Lesson);
      });
    void fetchTranscriptChunks(activeLessonId).then(setTranscript);
    setCurrentTime(0);
    setDuration(0);
    setCompleteMsg(null);
  }, [activeLessonId]);

  // Track the real playback position to highlight the transcript and show time.
  useEffect(() => {
    const id = setInterval(() => {
      const handle = playerHandleRef.current;
      if (!handle) return;
      setCurrentTime(handle.getCurrentTime());
      const dur = handle.getDuration();
      if (dur && dur !== duration) setDuration(dur);
    }, 1000);
    return () => clearInterval(id);
  }, [duration]);

  const handlePlayerReady = useCallback((handle: YouTubePlayerHandle) => {
    playerHandleRef.current = handle;
    setTimeout(() => setDuration(handle.getDuration()), 600);
  }, []);

  useEffect(() => {
    setVideoLang(lang === "bn" ? "bn" : "en");
    setChatLog(createLocalizedChatLog(lang));
    setPractices(createLocalizedPractices(lang));
    if (!lessonRow?.notes_md && !lessonRow?.notes_bn_md) {
      setNotesText(createLocalizedNotes(lang));
    }
  }, [lang, lessonRow]);

  const handleMarkComplete = useCallback(async () => {
    if (!enrollmentTrackId || !activeLessonId) return;
    setMarkingComplete(true);
    setCompleteMsg(null);
    const result = await markLessonComplete(
      authUser.id,
      activeLessonId,
      enrollmentTrackId
    );
    setMarkingComplete(false);
    if (result.error) {
      setCompleteMsg(result.error);
      return;
    }
    setCompleteMsg(lang === "bn" ? "লেসন সম্পন্ন!" : "Lesson marked complete!");
    await refreshCurriculum();
  }, [activeLessonId, authUser.id, enrollmentTrackId, lang, refreshCurriculum]);

  const subtitles = {
    en: "Functions group reusable segments of logic to avoid redundant boilerplate code execution.",
    bn: "ফাংশন মূলত কোডের পুনঃব্যবহারযোগ্য অংশগুলোকে এক গ্রুপে সাজায় যাতে একই কোড বারবার লিখতে না হয়।"
  };

  const activeLessonTitle =
    modules
      .find((m) => m.lessons.some((l) => l.id === activeLessonId))
      ?.lessons.find((l) => l.id === activeLessonId)?.title ||
    lessonRow?.title_en ||
    (lang === "bn" ? "এই লেসন" : "this lesson");

  const seekToSeconds = useCallback((seconds: number) => {
    setPlaying(true);
    const handle = playerHandleRef.current;
    if (handle) {
      handle.seekTo(seconds);
      handle.play();
    } else {
      window.dispatchEvent(new CustomEvent("seekVideo", { detail: { seconds } }));
    }
    setCurrentTime(seconds);
    setSeekTime(formatSeconds(seconds));
    setTimeout(() => setSeekTime(null), 2000);
  }, []);

  const handleChat = useCallback(async () => {
    const question = chatInput.trim();
    if (!question || chatLoading) return;
    setChatInput("");
    setChatLog((p) => [...p, { role: "user", text: question }]);

    const prefs = preferences.ai as unknown as AiPrefs;
    const configHint =
      lang === "bn"
        ? "চ্যাট চালু করতে সেটিংস → AI মেন্টর-এ আপনার নিজের API কী যুক্ত করুন (BYOA)।"
        : "Add your own API key in Settings → AI Mentor (BYOA) to enable chat with this video.";

    // Determine context: topic-anchored if available, else flat timed transcript
    let context: string;
    try {
      const topics = await getTopicsWithChunks(activeLessonId);
      if (topics && topics.length > 0) {
        context = buildTopicContext(topics);
      } else {
        // Fallback to flat timed transcript
        const liveDuration = playerHandleRef.current?.getDuration?.() || duration;
        const timed = buildTimedSegments(transcript, liveDuration);
        context = buildContext(timed);
      }
    } catch (topicError) {
      console.warn("[handleChat] Failed to fetch topics, falling back to flat transcript", topicError);
      const liveDuration = playerHandleRef.current?.getDuration?.() || duration;
      const timed = buildTimedSegments(transcript, liveDuration);
      context = buildContext(timed);
    }

    const system = buildSystemPrompt(activeLessonTitle, lang, prefs.persona);
    const prompt = buildUserPrompt(question, context);

    if (isAiConfigured(prefs)) {
      // Existing BYOA flow
      setChatLoading(true);
      try {
        const answer = await runChat(prefs, system, [
          { role: "user", content: prompt }
        ]);
        setChatLog((p) => [...p, { role: "ai", text: answer }]);
      } catch (err) {
        const text =
          err instanceof AiNotConfiguredError
            ? configHint
            : `⚠️ ${(err as Error).message}`;
        setChatLog((p) => [...p, { role: "ai", text }]);
      } finally {
        setChatLoading(false);
      }
    } else {
      // No BYOA key, use server-fallback via /api/chat
      setChatLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            lesson_id: activeLessonId,
            language: lang
          })
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Chat failed");
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        const answer = data.data.answer;
        setChatLog((p) => [...p, { role: "ai", text: answer }]);
      } catch (err) {
        setChatLog((p) => [...p, { role: "ai", text: err instanceof Error ? err.message : "Unknown error" }]);
      } finally {
        setChatLoading(false);
      }
    }
  }, [chatInput, chatLoading, preferences, transcript, duration, activeLessonTitle, lang]);

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

  const lessonNotesMd =
    lang === "bn" && lessonRow?.notes_bn_md
      ? lessonRow.notes_bn_md
      : lessonRow?.notes_md || "";

  // Modular Video Player render logic
  const renderVideoPlayer = () => {
    return (
      <div className="flex w-full flex-col overflow-hidden">
        <div ref={videoContainerRef} className="relative">
          {youtubeId ? (
            <YouTubePlayer videoId={youtubeId} onReady={handlePlayerReady} />
          ) : (
            <div className="flex aspect-video items-center justify-center bg-[var(--t-bg2)] text-[13px] text-[var(--t-txt1)]">
              {lang === "bn" ? "ভিডিও শীঘ্রই আসছে" : "Video coming soon"}
            </div>
          )}

          {seekTime && (
            <div className="absolute right-2.5 top-2.5 z-[4] rounded-md bg-[var(--t-amber)] px-2 py-1 text-[10px] font-black text-black">
              ⏱ Jumped to {seekTime}
            </div>
          )}

          {videoLang !== "off" && !youtubeId && (
            <div className="absolute bottom-3 left-1/2 z-[2] max-w-[85%] -translate-x-1/2 rounded-md border border-white/10 bg-black/80 px-3.5 py-1.5 text-center text-[11px] leading-snug text-white">
              {videoLang === "bn" ? subtitles.bn : subtitles.en}
            </div>
          )}
        </div>

        {/* Sub Player Control strip */}
        <div className="flex flex-wrap items-center gap-3 border-t border-[var(--t-border)] bg-[var(--t-bg2)] px-3 py-2">
          <button
            onClick={() => {
              const handle = playerHandleRef.current;
              if (!handle) return;
              if (playing) {
                handle.pause();
                setPlaying(false);
              } else {
                handle.play();
                setPlaying(true);
              }
            }}
            className="cursor-pointer border-none bg-transparent p-1 text-[13px] text-[var(--t-txt0)] outline-none"
          >
            {playing ? "⏸" : "▶"}
          </button>

          {/* Seekable progress line (click to jump) */}
          <div
            onClick={(e) => {
              if (!duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
              seekToSeconds(ratio * duration);
            }}
            className="relative h-[5px] min-w-[100px] flex-1 cursor-pointer rounded-sm bg-[var(--t-bg4)]"
          >
            <div
              className="h-full rounded-sm bg-[var(--t-accent)]"
              style={{ width: `${duration ? Math.min(100, (currentTime / duration) * 100) : 0}%` }}
            />
          </div>

          <span className="font-mono text-[9px] text-[var(--t-txt1)]">
            {formatSeconds(currentTime)} / {formatSeconds(duration)}
          </span>

          {/* Captions selector */}
          <div className="flex overflow-hidden rounded-md border border-[var(--t-border)] bg-[var(--t-bg3)] p-[1.5px]">
            {[
              ["en", "EN"],
              ["bn", "বাংলা"],
              ["off", "OFF"]
            ].map(([lCode, label]) => (
              <button
                key={lCode}
                onClick={() => setVideoLang(lCode as any)}
                className={`cursor-pointer rounded border-none px-1.5 py-0.5 text-[8.5px] font-bold ${
                  videoLang === lCode
                    ? "bg-[var(--t-accent)] text-black"
                    : "bg-transparent text-[var(--t-txt1)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Native Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            title={lang === "bn" ? "ফুল স্ক্রিন" : "Fullscreen"}
            aria-label={lang === "bn" ? "ফুল স্ক্রিন" : "Fullscreen"}
            className="flex cursor-pointer items-center border-none bg-transparent px-1.5 py-0.5 text-[13px] text-[var(--t-txt0)] outline-none"
          >
            📺
          </button>

          {/* Minimal Live Viewers Counter Badge */}
          <div
            className="flex items-center gap-1 rounded-md border border-[var(--t-accent)]/20 bg-[var(--t-accent-dim)] px-2 py-[3px] text-[9.5px] font-bold text-[var(--t-accent)]"
            title={lang === "bn" ? `${activeViewers} জন লাইভ শিখছেন` : `${activeViewers} students active now`}
          >
            <span
              className="inline-block size-[5px] rounded-full bg-[var(--t-accent)]"
              style={{ boxShadow: `0 0 6px ${T.accent}` }}
            />
            {activeViewers} live
          </div>

          <button
            type="button"
            onClick={() => void handleMarkComplete()}
            disabled={markingComplete || activeLesson?.done}
            className={`ml-auto rounded-md border-none px-3 py-1.5 text-[10px] font-extrabold ${
              activeLesson?.done
                ? "cursor-default bg-[var(--t-bg4)] text-[var(--t-txt1)]"
                : "cursor-pointer bg-[var(--t-accent)] text-black"
            }`}
          >
            {markingComplete
              ? "..."
              : activeLesson?.done
                ? lang === "bn"
                  ? "✓ সম্পন্ন"
                  : "✓ Done"
                : lang === "bn"
                  ? "সম্পন্ন করুন"
                  : "Mark Complete"}
          </button>
        </div>

        {completeMsg && (
          <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--t-accent)]">
            {completeMsg}
          </div>
        )}

        {lessonNotesMd && (
          <div className="max-h-[220px] overflow-y-auto border-t border-[var(--t-border)] bg-[var(--t-bg1)] px-4 py-3.5">
            <div className="mb-2 text-[11px] font-extrabold text-[var(--t-txt1)]">
              {lang === "bn" ? "লেসন নোট" : "Lesson notes"}
            </div>
            <LessonNotes markdown={lessonNotesMd} lang={lang} />
          </div>
        )}
      </div>
    );
  };

  // Modular Tabs panel render logic
  const renderTabsPanel = (mode: TabsPanelMode) => {
    const isSideMode = mode === "side";
    const shellClasses =
      mode === "sheet"
        ? "flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent"
        : `flex flex-1 flex-col overflow-hidden rounded-xl border border-[var(--t-border)] bg-[var(--t-bg1)] shadow-[var(--t-shadow)] ${
            isSideMode ? "mx-1 min-h-full" : "mt-1 min-h-[280px]"
          }`;

    return (
      <div className={shellClasses}>
        {/* Tabs selector bar */}
        <div
          className={`flex border-b border-[var(--t-border)] ${
            mode === "sheet" ? "bg-transparent" : "bg-[var(--t-bg2)]"
          }`}
        >
          {tabs.map((tab, idx) => {
            const tabKeys = ["Notes", "Transcript", "Chat with Video", "Practice"];
            const currentKey = tabKeys[idx];
            const isSelected = activeTab === currentKey;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(currentKey);
                  if (mode === "sheet" && sheetSnap === "peek") setSheetSnap("half");
                }}
                className={`cursor-pointer border-none bg-transparent py-2.5 font-bold outline-none ${
                  mode === "sheet"
                    ? "flex-1 px-1 text-[11px]"
                    : isSideMode
                      ? "px-3 text-[10.5px]"
                      : "px-[18px] text-[11.5px]"
                } ${isSelected ? "bg-[var(--t-bg1)] text-[var(--t-accent)]" : "text-[var(--t-txt1)]"}`}
                style={{
                  borderBottom: isSelected ? `2.5px solid ${T.accent}` : "2.5px solid transparent"
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Tab active content layout */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3.5">
          {activeTab === "Notes" && (
            <div className="flex h-full flex-col">
              {lessonNotesMd ? (
                <div className="mb-2.5 max-h-[140px] overflow-y-auto">
                  <LessonNotes markdown={lessonNotesMd} lang={lang} />
                </div>
              ) : null}
              <textarea
                value={notesText}
                onChange={(e) => setNotesText(e.target.value)}
                className="w-full flex-1 resize-none rounded-lg border border-[var(--t-border)] bg-[var(--t-bg2)] p-3 font-[inherit] text-xs leading-relaxed text-[var(--t-txt0)] outline-none"
              />
              <div className="h-1" />
              <div className="text-right text-[10px] text-[var(--t-txt2)]">
                ✦ {lang === "bn" ? "ক্লাউড সিংক্রোনাইজেশন আর্কাইভে সংরক্ষিত হয়েছে" : "Auto-saved to Cloud Sync Archive"}
              </div>
            </div>
          )}

          {activeTab === "Transcript" && (
            <div className="flex flex-col gap-1.5">
              {timedTranscript.length === 0 ? (
                <div className="px-1 py-2 text-xs leading-normal text-[var(--t-txt2)]">
                  {lang === "bn"
                    ? "এই ভিডিওর জন্য ট্রান্সক্রিপ্ট এখনো প্রস্তুত হয়নি।"
                    : "Transcript is not available for this video yet."}
                </div>
              ) : (
                timedTranscript.map((chunk) => {
                  const start = chunk.start_time ?? 0;
                  const end = chunk.end_time ?? start + 30;
                  const isActive = currentTime >= start && currentTime < end;
                  return (
                    <div
                      key={chunk.id}
                      onClick={() => seekToSeconds(start)}
                      className={`flex cursor-pointer gap-3 rounded-lg border px-2.5 py-2 transition-colors ${
                        isActive
                          ? "border-[var(--t-accent)]/20 bg-[var(--t-accent-dim)]"
                          : "border-[var(--t-border)]/20 bg-transparent"
                      }`}
                    >
                      <span className="shrink-0 font-mono text-[10px] font-black text-[var(--t-accent)]">
                        {formatSeconds(start)}
                      </span>
                      <span className="text-xs leading-snug text-[var(--t-txt0)]">
                        {chunk.chunk_text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "Chat with Video" && (
            <div className="flex h-full flex-col justify-between">
              <div className="mb-2 flex-1 overflow-y-auto">
                {chatLog.map((chat, idx) => {
                  const isUser = chat.role === "user";
                  return (
                    <div key={idx} className={`mb-2.5 flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                      <div
                        className={`max-w-[80%] px-3 py-1.5 text-[11.5px] leading-normal ${
                          isUser
                            ? "rounded-[10px_10px_2px_10px] bg-[var(--t-accent)] text-black"
                            : "rounded-[10px_10px_10px_2px] bg-[var(--t-bg3)] text-[var(--t-txt0)]"
                        }`}
                      >
                        {isUser
                          ? chat.text
                          : parseAnswerSegments(chat.text).map((seg, sIdx) =>
                              seg.type === "text" ? (
                                <span key={sIdx}>{seg.value}</span>
                              ) : (
                                <button
                                  key={sIdx}
                                  onClick={() => seekToSeconds(seg.seconds)}
                                  className="mx-0.5 inline-flex cursor-pointer items-center rounded border border-[var(--t-amber)]/25 bg-[var(--t-amber-dim)] px-1.5 font-mono text-[10px] font-bold text-[var(--t-amber)]"
                                >
                                  ⏱ {seg.value}
                                </button>
                              )
                            )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1.5 border-t border-[var(--t-border)] pt-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void handleChat()}
                  disabled={chatLoading}
                  placeholder={
                    chatLoading
                      ? lang === "bn"
                        ? "ভাবছি..."
                        : "Thinking..."
                      : lang === "bn"
                        ? "ভিডিওর যেকোনো রেফারেন্সে প্রশ্ন করুন..."
                        : "Ask anything about this video..."
                  }
                  className="min-h-9 flex-1 rounded-lg border border-[var(--t-border)] bg-[var(--t-bg2)] px-2.5 py-1.5 text-xs text-[var(--t-txt0)] outline-none"
                />
                <button
                  onClick={() => void handleChat()}
                  disabled={chatLoading}
                  aria-label={lang === "bn" ? "পাঠান" : "Send"}
                  className={`flex size-9 items-center justify-center rounded-lg border-none bg-[var(--t-accent)] font-bold text-black ${
                    chatLoading ? "cursor-default opacity-60" : "cursor-pointer"
                  }`}
                >
                  {chatLoading ? "…" : "↑"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "Practice" && (
            <div>
              {practices.map((quiz, qIdx) => (
                <div
                  key={qIdx}
                  className="mb-2.5 rounded-[10px] border border-[var(--t-border)] bg-[var(--t-bg2)] p-3"
                >
                  <div className="mb-2 text-xs font-bold text-[var(--t-txt0)]">
                    {qIdx + 1}. {quiz.q}
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    {quiz.opts.map((opt: string, oIdx: number) => {
                      const isPicked = userAssessAnswers[qIdx] === oIdx;
                      const isCorrect = userAssessAnswers[qIdx] !== undefined && oIdx === quiz.ans;
                      const isWrong = isPicked && oIdx !== quiz.ans;

                      return (
                        <button
                          key={oIdx}
                          onClick={() => setUserAssessAnswers((p) => ({ ...p, [qIdx]: oIdx }))}
                          className={`flex w-full cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1.5 text-left text-[11px] text-[var(--t-txt0)] ${
                            isCorrect
                              ? "border-[var(--t-accent)]/40 bg-[var(--t-accent-dim)]"
                              : isWrong
                                ? "border-[var(--t-red)]/40 bg-[var(--t-red-dim)]"
                                : isPicked
                                  ? "border-[var(--t-blue)]/25 bg-[var(--t-blue-dim)]"
                                  : "border-[var(--t-border)] bg-[var(--t-bg3)]"
                          }`}
                        >
                          <span
                            className={`size-3 shrink-0 rounded-full border-[1.5px] ${
                              isPicked
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
          )}
        </div>
      </div>
    );
  };

  const topicHeader = (
    <div className="mb-3.5 flex items-center justify-between rounded-[10px] border border-[var(--t-border)] bg-[var(--t-bg1)] px-4 py-2.5 shadow-[var(--t-shadow)]">
      <div className="min-w-0">
        <div className="text-[9.5px] font-extrabold uppercase tracking-wider text-[var(--t-accent)]">
          {lang === "bn" ? "ভিডিও লেকচার" : "ACTIVE LESSON VIDEO"}
        </div>
        <h3 className="m-0 mt-0.5 truncate text-[13px] font-black text-[var(--t-txt0)]">
          {modules.find((m) => m.lessons.some((l) => l.id === activeLessonId))?.lessons.find((l) => l.id === activeLessonId)?.title || "1.3 Scopes and Scuttles Check"}
        </h3>
      </div>

      {/* Dock Control Toggle — desktop layout only */}
      <button
        onClick={() => setDockOnSide(!dockOnSide)}
        className="hidden cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--t-border)] bg-[var(--t-bg2)] px-3 py-1.5 text-[10.5px] font-extrabold text-[var(--t-accent)] outline-none md:flex"
      >
        {dockOnSide ? "🥞 Move Notes Below" : "📋 Dock Notes to Side"}
      </button>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={themeVars(T)}
      className={`relative flex min-w-0 flex-1 flex-col bg-[var(--t-bg0)] p-3 md:p-4 ${
        isMobile ? "overflow-hidden" : "overflow-y-auto"
      }`}
    >
      {isMobile ? (
        <>
          {/* Mobile: video pinned top, content scrolls behind the bottom sheet */}
          <div className="min-h-0 flex-1 overflow-y-auto pb-32">
            {topicHeader}
            <div className="overflow-hidden rounded-xl border border-[var(--t-border)] bg-black shadow-[var(--t-shadow)]">
              {renderVideoPlayer()}
            </div>
          </div>

          {/* Mobile bottom sheet hosting the Notes/Transcript/Chat/Practice tabs */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-2xl border border-b-0 border-[var(--t-border)] bg-[var(--t-bg1)] shadow-[0_-10px_36px_rgba(0,0,0,0.4)]"
            style={{ height: sheetH }}
            initial={false}
            animate={{ y: snapOffsets[sheetSnap] }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            drag="y"
            dragListener={false}
            dragControls={sheetDragControls}
            dragConstraints={{ top: snapOffsets.full, bottom: snapOffsets.peek }}
            dragElastic={0.04}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              const projected =
                snapOffsets[sheetSnap] + info.offset.y + info.velocity.y * 0.12;
              let best: SheetSnap = sheetSnap;
              let bestDistance = Infinity;
              (Object.keys(snapOffsets) as SheetSnap[]).forEach((key) => {
                const distance = Math.abs(projected - snapOffsets[key]);
                if (distance < bestDistance) {
                  bestDistance = distance;
                  best = key;
                }
              });
              setSheetSnap(best);
            }}
          >
            <div
              onPointerDown={(e) => sheetDragControls.start(e)}
              className="flex shrink-0 cursor-grab touch-none items-center justify-center pb-1.5 pt-2.5 active:cursor-grabbing"
              aria-label={lang === "bn" ? "প্যানেল টানুন" : "Drag panel"}
            >
              <div className="h-1.5 w-10 rounded-full bg-[var(--t-bg4)]" />
            </div>
            {renderTabsPanel("sheet")}
          </motion.div>
        </>
      ) : (
        <>
          {topicHeader}

          {/* Main Layout Area */}
          <div className="flex min-h-0 flex-1 flex-col">
            {dockOnSide ? (
              /* Side-by-Side Split View */
              <div className="flex min-h-0 flex-1 gap-3.5 pb-1.5">
                {/* Left Column: Video player */}
                <div className="flex min-w-[300px] flex-[1.3] flex-col justify-start">
                  <div className="w-full overflow-hidden rounded-xl border border-[var(--t-border)] bg-black shadow-[var(--t-shadow)]">
                    {renderVideoPlayer()}
                  </div>
                </div>

                {/* Right Column: Interactive Tabs panel */}
                <div className="flex min-w-[280px] flex-1 flex-col">
                  {renderTabsPanel("side")}
                </div>
              </div>
            ) : (
              /* Stacked View (Video on top, Tabs below) */
              <div className="flex flex-1 flex-col gap-3">
                {/* Centered Video Player */}
                <div className="mx-auto w-full max-w-[720px] overflow-hidden rounded-xl border border-[var(--t-border)] bg-black shadow-[var(--t-shadow)]">
                  {renderVideoPlayer()}
                </div>

                {/* Bottom tabs block */}
                {renderTabsPanel("stacked")}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
