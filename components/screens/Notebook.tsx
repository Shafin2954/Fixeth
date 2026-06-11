"use client";

import React, { useEffect, useState } from "react";
import { Module, ChatMessage } from "@/types/ui";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { runPython, getPyodide } from "@/lib/notebook/pyodide";
import {
  listNotebooks,
  saveNotebook,
  deleteNotebook,
  type NotebookCell,
  type NotebookDoc
} from "@/lib/supabase/queries/notebooks";

const uid = () => Math.random().toString(36).slice(2, 10);

const starterCells = (lang: string): NotebookCell[] => [
  {
    id: uid(),
    type: "markdown",
    content:
      lang === "bn"
        ? "## স্বাগতম\nএটি একটি বাস্তব Python নোটবুক — ব্রাউজারেই কোড চলে (Pyodide)। নিচের সেলটি চালিয়ে দেখুন।"
        : "## Welcome\nThis is a real Python notebook running in your browser (Pyodide). Run the cell below to try it."
  },
  {
    id: uid(),
    type: "code",
    content: "import sys\nprint('Python', sys.version.split()[0])\n\nfor i in range(1, 4):\n    print('Line', i)"
  }
];

export default function NotebookScreen({
  T,
  lang
}: {
  T: any;
  t?: any;
  modules?: Module[];
  openMods?: any;
  setOpenMods?: any;
  activeLessonId?: string;
  setActiveLessonId?: any;
  onPrevious?: any;
  onNext?: any;
  aiMsgs?: ChatMessage[];
  setAiMsgs?: any;
  lang: string;
}) {
  const { authUser } = useAppTheme();
  const userId = authUser?.id ?? null;

  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [docs, setDocs] = React.useState<NotebookDoc[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState("Untitled notebook");
  const [cells, setCells] = React.useState<NotebookCell[]>(starterCells(lang));
  const [running, setRunning] = React.useState<string | null>(null);
  const [kernelState, setKernelState] = React.useState<"idle" | "loading" | "ready">("idle");
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<string | null>(null);

  // Load the user's saved notebooks once.
  React.useEffect(() => {
    void listNotebooks(userId).then((list) => {
      setDocs(list);
      if (list.length > 0) {
        setActiveId(list[0].id);
        setTitle(list[0].title);
        setCells(list[0].cells?.length ? list[0].cells : starterCells(lang));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const bootKernel = React.useCallback(async () => {
    if (kernelState === "ready") return;
    setKernelState("loading");
    try {
      await getPyodide();
      setKernelState("ready");
    } catch {
      setKernelState("idle");
    }
  }, [kernelState]);

  const updateCell = (id: string, patch: Partial<NotebookCell>) =>
    setCells((p) => p.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const runCell = async (id: string) => {
    const cell = cells.find((c) => c.id === id);
    if (!cell || cell.type !== "code") return;
    setRunning(id);
    if (kernelState !== "ready") setKernelState("loading");
    try {
      const res = await runPython(cell.content);
      setKernelState("ready");
      const parts = [res.stdout, res.result ?? "", res.stderr].filter(Boolean);
      updateCell(id, { output: parts.join("\n").trim() || "(no output)", error: !res.ok });
    } catch (err) {
      updateCell(id, { output: (err as Error).message, error: true });
    } finally {
      setRunning(null);
    }
  };

  const runAll = async () => {
    for (const c of cells) {
      if (c.type === "code") await runCell(c.id);
    }
  };

  const addCell = (type: "code" | "markdown") =>
    setCells((p) => [
      ...p,
      {
        id: uid(),
        type,
        content: type === "code" ? "# New code cell" : "### Notes"
      }
    ]);

  const removeCell = (id: string) => setCells((p) => p.filter((c) => c.id !== id));

  const moveCell = (id: string, dir: -1 | 1) =>
    setCells((p) => {
      const i = p.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= p.length) return p;
      const copy = [...p];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const newNotebook = () => {
    const fresh = starterCells(lang);
    setActiveId(null);
    setTitle(lang === "bn" ? "নতুন নোটবুক" : "Untitled notebook");
    setCells(fresh);
    setSavedAt(null);
  };

  const openNotebook = (doc: NotebookDoc) => {
    setActiveId(doc.id);
    setTitle(doc.title);
    setCells(doc.cells?.length ? doc.cells : starterCells(lang));
    setSavedAt(doc.updated_at ?? null);
  };

  const handleSave = async () => {
    setSaving(true);
    const doc: NotebookDoc = {
      id: activeId ?? uid(),
      title: title.trim() || "Untitled notebook",
      cells
    };
    const saved = await saveNotebook(doc, userId);
    setActiveId(saved.id);
    setSavedAt(saved.updated_at ?? new Date().toISOString());
    setDocs(await listNotebooks(userId));
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await deleteNotebook(id, userId);
    const list = await listNotebooks(userId);
    setDocs(list);
    if (activeId === id) newNotebook();
  };

  const kernelBadge =
    kernelState === "ready"
      ? { label: lang === "bn" ? "● কার্নেল প্রস্তুত" : "● Kernel ready", color: T.accent, bg: "#00C8961a", bd: `${T.accent}33` }
      : kernelState === "loading"
        ? { label: lang === "bn" ? "◌ কার্নেল লোড হচ্ছে…" : "◌ Booting kernel…", color: T.amber, bg: T.amberDim, bd: `${T.amber}33` }
        : { label: lang === "bn" ? "○ কার্নেল নিষ্ক্রিয়" : "○ Kernel idle", color: T.txt2, bg: T.bg3, bd: T.border };

  const sidebarContent = (
    <>
      <div style={{ padding: "12px 12px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 900, color: T.txt1, letterSpacing: 0.4 }}>
          {lang === "bn" ? "আমার নোটবুক" : "MY NOTEBOOKS"}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            onClick={newNotebook}
            title={lang === "bn" ? "নতুন" : "New notebook"}
            style={{ background: T.accent, color: "#000", border: "none", borderRadius: 6, width: 22, height: 22, cursor: "pointer", fontWeight: 900, fontSize: 14, lineHeight: 1 }}
          >
            +
          </button>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: T.bg3, color: T.txt1, border: `1px solid ${T.border}`, borderRadius: 6, width: 22, height: 22, cursor: "pointer", fontSize: 14, lineHeight: 1 }}
            >
              ×
            </button>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 8px 8px" }}>
        {docs.length === 0 && (
          <p style={{ fontSize: 10.5, color: T.txt2, padding: "4px 6px", lineHeight: 1.5 }}>
            {lang === "bn" ? "এখনো কোনো নোটবুক সংরক্ষিত নেই।" : "No saved notebooks yet."}
          </p>
        )}
        {docs.map((d) => (
          <div
            key={d.id}
            onClick={() => { openNotebook(d); if (isMobile) setSidebarOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              padding: "6px 8px",
              borderRadius: 6,
              cursor: "pointer",
              background: d.id === activeId ? T.accentDim : "transparent",
              border: d.id === activeId ? `1px solid ${T.accent}33` : "1px solid transparent"
            }}
          >
            <span style={{ fontSize: 11.5, color: T.txt0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {d.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                void handleDelete(d.id);
              }}
              style={{ background: "none", border: "none", color: T.txt2, cursor: "pointer", fontSize: 13, lineHeight: 1, flexShrink: 0 }}
              title={lang === "bn" ? "মুছুন" : "Delete"}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, position: "relative" }}>
      {/* Mobile: off-canvas drawer */}
      {isMobile ? (
        <>
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              title={lang === "bn" ? "নোটবুক তালিকা" : "Notebooks"}
              style={{
                position: "fixed",
                left: 0,
                top: "42%",
                transform: "translateY(-50%)",
                background: T.accent,
                border: `1px solid ${T.border}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 8px",
                color: "#000",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 10.5,
                zIndex: 55,
                writingMode: "vertical-rl",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                boxShadow: T.shadow,
                outline: "none"
              }}
            >
              ☰ {lang === "bn" ? "নোটবুক" : "Notebooks"}
            </button>
          )}
          {sidebarOpen && (
            <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 60 }} />
          )}
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 220,
              zIndex: 61,
              background: T.bg1,
              borderRight: `1px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {sidebarContent}
          </aside>
        </>
      ) : (
        /* Desktop: in-flow sidebar */
        <aside
          style={{
            width: 220,
            flexShrink: 0,
            background: T.bg1,
            borderRight: `1px solid ${T.border}`,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto"
          }}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Notebook editor */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: T.bg0,
          padding: 16,
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              color: T.txt0,
              fontSize: 16,
              fontWeight: 900,
              background: "transparent",
              border: "none",
              borderBottom: `1px solid ${T.border}`,
              outline: "none",
              padding: "2px 0",
              minWidth: 200
            }}
          />
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ background: kernelBadge.bg, color: kernelBadge.color, border: `1px solid ${kernelBadge.bd}`, padding: "2px 6px", borderRadius: 4, fontSize: 9.5, fontWeight: 700 }}>
              {kernelBadge.label}
            </span>
            {savedAt && (
              <span style={{ fontSize: 9.5, color: T.txt2 }}>
                {lang === "bn" ? "সংরক্ষিত" : "Saved"}
              </span>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            background: T.bg1,
            borderRadius: 8,
            border: `1px solid ${T.border}`,
            padding: "6px 12px",
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 14,
            overflowX: "auto"
          }}
        >
          <button onClick={() => void runAll()} style={btn(T, true)}>
            ▶ {lang === "bn" ? "সব চালান" : "Run all"}
          </button>
          <button onClick={() => addCell("code")} style={btn(T)}>
            + {lang === "bn" ? "কোড" : "Code"}
          </button>
          <button onClick={() => addCell("markdown")} style={btn(T)}>
            + Markdown
          </button>
          <button onClick={() => void bootKernel()} style={btn(T)}>
            ⟳ {lang === "bn" ? "কার্নেল" : "Kernel"}
          </button>
          <div style={{ flex: 1 }} />
          <button onClick={() => void handleSave()} disabled={saving} style={btn(T, true)}>
            {saving ? (lang === "bn" ? "সংরক্ষণ…" : "Saving…") : lang === "bn" ? "সংরক্ষণ" : "Save"}
          </button>
        </div>

        {/* Cells */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cells.map((cell, idx) => (
            <div key={cell.id} style={{ display: "flex", gap: 8 }}>
              <div style={{ width: 40, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, paddingTop: 6 }}>
                <span style={{ fontSize: 9.5, color: T.txt2, fontFamily: "monospace" }}>
                  {cell.type === "code" ? `[${idx + 1}]` : "md"}
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <button onClick={() => moveCell(cell.id, -1)} style={miniBtn(T)} title="Move up">↑</button>
                  <button onClick={() => moveCell(cell.id, 1)} style={miniBtn(T)} title="Move down">↓</button>
                  <button onClick={() => removeCell(cell.id)} style={miniBtn(T)} title="Delete">×</button>
                </div>
              </div>

              <div style={{ flex: 1, background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
                {cell.type === "code" && (
                  <div style={{ display: "flex", justifyContent: "flex-end", padding: "4px 6px", borderBottom: `1px solid ${T.border}`, background: T.bg2 + "60" }}>
                    <button
                      onClick={() => void runCell(cell.id)}
                      disabled={running === cell.id}
                      style={{ ...btn(T, true), padding: "2px 10px", fontSize: 10 }}
                    >
                      {running === cell.id ? "…" : `▶ ${lang === "bn" ? "চালান" : "Run"}`}
                    </button>
                  </div>
                )}
                <textarea
                  value={cell.content}
                  onChange={(e) => updateCell(cell.id, { content: e.target.value })}
                  spellCheck={false}
                  style={{
                    width: "100%",
                    minHeight: cell.type === "markdown" ? "48px" : "72px",
                    background: cell.type === "markdown" ? T.bg2 + "50" : T.bg2,
                    border: "none",
                    padding: "10px 12px",
                    fontFamily: cell.type === "markdown" ? "inherit" : "monospace",
                    fontSize: 12.5,
                    color: cell.type === "markdown" ? T.txt1 : T.accent,
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none",
                    display: "block"
                  }}
                />
                {cell.type === "code" && cell.output !== undefined && cell.output !== "" && (
                  <div
                    style={{
                      background: T.bg1,
                      borderTop: `1px solid ${T.border}`,
                      padding: "8px 12px",
                      fontSize: 11.5,
                      fontFamily: "monospace",
                      color: cell.error ? T.rose || "#ff6b6b" : T.txt1,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {cell.output}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function btn(T: any, primary = false): React.CSSProperties {
  return {
    padding: "4px 10px",
    fontSize: 10.5,
    borderRadius: 6,
    background: primary ? T.accent : T.bg3,
    border: `1px solid ${T.border}`,
    color: primary ? "#000" : T.txt0,
    cursor: "pointer",
    fontWeight: 700,
    whiteSpace: "nowrap"
  };
}

function miniBtn(T: any): React.CSSProperties {
  return {
    background: T.bg3,
    border: `1px solid ${T.border}`,
    color: T.txt1,
    borderRadius: 4,
    width: 18,
    height: 16,
    fontSize: 10,
    lineHeight: 1,
    cursor: "pointer",
    padding: 0
  };
}
