"use client";

import React from "react";
import { Module, ChatMessage } from "@/types/ui";

const createNotebookCells = (lang: string) => [
  {
    type: "code",
    content:
      lang === "bn"
        ? "import pandas as pd\nimport numpy as np\n\n# শিক্ষার্থীর তথ্য বিশ্লেষণ\ndf = pd.read_csv('data/students.csv')\ndf.head()"
        : "import pandas as pd\nimport numpy as np\n\n# Baseline student records analysis\ndf = pd.read_csv('data/students.csv')\ndf.head()",
    output: "   name  score  grade\n0  Alice     87      B\n1    Bob     92      A\n2  Carol     78      C"
  },
  {
    type: "markdown",
    content:
      lang === "bn"
        ? "## অনুসন্ধানমূলক বিশ্লেষণ\nআমরা ডেটার গড়, ছড়ানো মান এবং সম্ভাব্য ফাঁকা অংশগুলো দেখব।"
        : "## Exploratory Analytics\nWe shall measure general dispersion ranges and identify potential empty slots."
  },
  {
    type: "code",
    content:
      lang === "bn"
        ? "# মান বিচ্যুতি যাচাই\ndf['score'].describe()"
        : "# Standard deviation checks\ndf['score'].describe()",
    output: "count    50.000000\nmean     82.340000\nstd       9.123000"
  }
];

export default function NotebookScreen({
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
  const [cells, setCells] = React.useState([
    ...createNotebookCells(lang)
  ]);

  React.useEffect(() => {
    setCells(createNotebookCells(lang));
  }, [lang]);

  const handleCellChange = (index: number, val: string) => {
    setCells((p) => {
      const copy = [...p];
      copy[index].content = val;
      return copy;
    });
  };

  const handleRunCell = (index: number) => {
    // Basic reactive execution simulator
    const cell = cells[index];
    if (cell.type === "markdown") return;

    setCells((p) => {
      const copy = [...p];
      if (cell.content.includes("head")) {
        copy[index].output = "   name  score  grade\n0  Alice     87      B\n1    Bob     92      A";
      } else if (cell.content.includes("describe")) {
        copy[index].output = "count    50.000000\nmean     82.340000";
      } else {
        copy[index].output = "Command executed successfully.\nKernel returned code status [0]";
      }
      return copy;
    });
  };

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>

      {/* 3.2 Center core Notebook container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: T.bg0,
          borderRight: `1px solid ${T.border}`,
          padding: 16,
          overflowY: "auto"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div>
            <h2 style={{ color: T.txt0, fontSize: 16, fontWeight: 900, margin: 0 }}>
              {lang === "bn" ? "জুপিটার নোটবুক সেল ল্যাব" : "JupyterLite Interactive Notebook"}
            </h2>
            <p style={{ color: T.txt1, fontSize: 11, margin: "3px 0 0" }}>
              In-browser Python Compiler sandbox · Local state auto-saved
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ background: "#00C8961a", color: T.accent, border: `1px solid ${T.accent}33`, padding: "2px 6px", borderRadius: 4, fontSize: 9.5, fontWeight: 700 }}>
              ● Kernel: Ready
            </span>
            <span style={{ background: T.blueDim, color: T.blue, border: `1px solid ${T.blue}33`, padding: "2px 6px", borderRadius: 4, fontSize: 9.5, fontWeight: 700 }}>
              v3.11-sandbox
            </span>
          </div>
        </div>

        {/* Notebook controller bar */}
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
          {["▶ Run", "+ Code Cell", "+ Markdown Cell", "⟳ Restart Kernel"].map((action) => {
            const isRun = action.startsWith("▶");
            return (
              <button
                key={action}
                onClick={() => {
                  if (isRun) {
                    cells.forEach((_, idx) => handleRunCell(idx));
                  } else if (action.includes("Code")) {
                    setCells((p) => [...p, { type: "code", content: "# Enter Python statements here", output: "" }]);
                  } else if (action.includes("Markdown")) {
                    setCells((p) => [...p, { type: "markdown", content: "### New Documentation\nWrite notes here" }]);
                  }
                }}
                style={{
                  padding: "4px 10px",
                  fontSize: 10.5,
                  borderRadius: 6,
                  background: isRun ? T.accent : T.bg3,
                  border: `1px solid ${T.border}`,
                  color: isRun ? "#000" : T.txt0,
                  cursor: "pointer",
                  fontWeight: 700
                }}
              >
                {action}
              </button>
            );
          })}
        </div>

        {/* Cells block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cells.map((cell, idx) => (
            <div key={idx} style={{ display: "flex", gap: 8 }}>
              {/* Line indicator */}
              <div style={{ fontSize: 9.5, color: T.txt2, padding: "8px 0", width: 34, textAlign: "right", fontFamily: "monospace", flexShrink: 0 }}>
                In [{idx + 1}]:
              </div>

              {/* Cell Card */}
              <div style={{ flex: 1, background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
                {/* Code input text area */}
                <textarea
                  value={cell.content}
                  onChange={(e) => handleCellChange(idx, e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "64px",
                    background: cell.type === "markdown" ? T.bg2 + "50" : T.bg2,
                    border: "none",
                    padding: "10px 12px",
                    fontFamily: cell.type === "markdown" ? "inherit" : "monospace",
                    fontSize: 12,
                    color: cell.type === "markdown" ? T.txt1 : T.accent,
                    lineHeight: 1.6,
                    resize: "vertical",
                    outline: "none"
                  }}
                />

                {/* Optional Output area */}
                {cell.output && (
                  <div
                    style={{
                      background: T.bg1,
                      borderTop: `1px solid ${T.border}`,
                      padding: "8px 12px",
                      fontSize: 11,
                      fontFamily: "monospace",
                      color: T.txt1,
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
