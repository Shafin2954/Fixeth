"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserPreferences } from "@/types/ui";

const THEME_CONFIGS = {
  monokai: { bg: "#272822", txt: "#f8f8f2", border: "#3e3d32", lineBg: "#1e1f1c", lineNum: "#75715e" },
  "one-dark": { bg: "#282c34", txt: "#abb2bf", border: "#181a1f", lineBg: "#21252b", lineNum: "#4b5263" },
  solarized: { bg: "#002b36", txt: "#839496", border: "#073642", lineBg: "#00212b", lineNum: "#586e75" },
  vibrant: { bg: "#0f0f16", txt: "#eeeeee", border: "#222233", lineBg: "#08080c", lineNum: "#555577" },
  "github-light": { bg: "#f6f8fa", txt: "#24292f", border: "#d0d7de", lineBg: "#eaeef2", lineNum: "#57606a" }
};

interface FileEntry {
  name: string;
  content: string;
}

export default function CodeSpaceScreen({ T, t, preferences }: { T: any; t: any; preferences: UserPreferences }) {
  const [gitConnected, setGitConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("main.py");
  
  // Local reactive filesystem dictionary state
  const [files, setFiles] = useState<{ [key: string]: string }>({
    "main.py": `import pandas as pd\nimport numpy as np\n\n# Dynamic student analyzer\ndf = pd.read_csv("dataset.csv")\nprint("--- Student Dataset Summary ---")\nprint(df.describe())\nprint("\\nMean Score:", df["score"].mean())\nprint("Successfully parsed in Bangladesh!")`,
    "dataset.csv": `name,score,grade\nAlice,87,B\nBob,92,A\nCarol,78,C\nJawat,95,A\nFahim,82,B`,
    "utils.py": `def standard_scaler(data):\n    mean = sum(data) / len(data)\n    variance = sum((x - mean) ** 2 for x in data) / len(data)\n    std_dev = variance ** 0.5\n    return [(x - mean) / std_dev for x in data]\n`,
    "README.md": `# Fixeth Cloud Codespace\nWelcome to your in-browser CS50 IDE workspace.\n\n### Commands\n- Type \`python main.py\` to execute the script!\n- Type \`ls\` to list directories.\n- Add local files using "Fetch Local".`
  });

  const [termHistory, setTermHistory] = useState<string[]>([
    "Microsoft Terminal Service loaded.",
    "jawat@codespace:~/workspace$ python main.py",
    "--- Student Dataset Summary ---",
    "       score",
    "count    5.0",
    "mean    88.8",
    "std      5.2",
    "min     82.0",
    "max     95.0",
    "",
    "Mean Score: 88.8",
    "Successfully parsed in Bangladesh!",
    "jawat@codespace:~/workspace$ "
  ]);

  const [inputLine, setInputLine] = useState("");
  const termScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    termScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [termHistory]);

  const handleEditCode = (newCode: string) => {
    setFiles((p) => ({
      ...p,
      [activeTab]: newCode
    }));
  };

  // Mock terminal instruction execution
  const runTerminalCommand = () => {
    const rawCmd = inputLine.trim();
    if (!rawCmd) return;

    const newHistory = [...termHistory, `jawat@codespace:~/workspace$ ${rawCmd}`];
    const args = rawCmd.split(" ");
    const cmd = args[0].toLowerCase();

    if (cmd === "clear") {
      setTermHistory([]);
      setInputLine("");
      return;
    }

    if (cmd === "help") {
      newHistory.push(
        "Supported commands in this CS50 simulator:",
        "  python [filename]  - Execute python statements dynamically",
        "  ls                 - List directory contents",
        "  cat [filename]     - Visual print of file content",
        "  clear              - Wipe console logs",
        "  git push           - Synchronize active workspace with GitHub"
      );
    } else if (cmd === "ls") {
      newHistory.push(
        Object.keys(files)
          .map((n) => `  ${n}`)
          .join("\n")
      );
    } else if (cmd === "cat") {
      const target = args[1];
      if (files[target]) {
        newHistory.push(files[target]);
      } else {
        newHistory.push(`cat: ${target || ""}: No such file in active workspace directory.`);
      }
    } else if (cmd === "python") {
      const target = args[1];
      if (!target) {
        newHistory.push("python: Error: Specify file to execute.");
      } else if (target === "main.py") {
        newHistory.push("--- Student Dataset Summary ---");
        
        // Dynamic compiler simulator parsing print statements or custom logs
        const activeCode = files["main.py"];
        
        // Seek custom user edits like print("Hello")
        const printRegex = /print\s*\(\s*["'](.*?)["']\s*\)/g;
        let match;
        let foundCustomPrint = false;
        
        while ((match = printRegex.exec(activeCode)) !== null) {
          newHistory.push(match[1]);
          foundCustomPrint = true;
        }

        if (!foundCustomPrint) {
          newHistory.push(
            "       score",
            "count    5.0",
            "mean    88.8",
            "Mean Score: 88.8",
            "Successfully parsed in Bangladesh!"
          );
        }
      } else if (files[target]) {
        newHistory.push(`Module ${target} parsed successfully. Returned status [0].`);
      } else {
        newHistory.push(`python: error: file '${target}' not found.`);
      }
    } else if (rawCmd === "git push") {
      if (gitConnected) {
        newHistory.push(
          "Enumerating objects: 4, done.",
          "Counting objects: 100% (4/4), done.",
          "Delta compression using up to 4 threads",
          "Compressing objects: 100% (3/3), done.",
          "Writing objects: 100% (3/3), 420 bytes | 420.00 KiB/s, done.",
          "To github.com:jawat/ds-track-projects.git",
          "   48fa82b..c0c29f4  main -> main",
          "✓ GitHub repository synchronized successfully!"
        );
      } else {
        newHistory.push("git: Error: Remote connection missing. Please click 'Connect GitHub' in top toolbar.");
      }
    } else {
      newHistory.push(`bash: ${cmd}: command not found. Type 'help' to check instructions list.`);
    }

    newHistory.push("jawat@codespace:~/workspace$ ");
    setTermHistory(newHistory);
    setInputLine("");
  };

  // Drag & drop or local file upload mock implementation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setFiles((p) => ({
        ...p,
        [file.name]: content
      }));
      setActiveTab(file.name);
      setTermHistory((p) => [
        ...p,
        `[IDE System] Fetched local file: ${file.name} (${Math.round(file.size / 1024)} KB)`,
        "jawat@codespace:~/workspace$ "
      ]);
    };
    reader.readAsText(file);
  };

  return (
    <div
      style={{
        flex: 1,
        background: T.bg0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif"
      }}
    >
      {/* Codespace control toolbar */}
      <div
        style={{
          height: 40,
          background: T.navBg,
          borderBottom: `1px solid ${T.border}`,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0
        }}
      >
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: T.txt0 }}>Fixeth CS50 Codespace</span>
          <span
            style={{
              background: gitConnected ? "#00C8961a" : T.bg3,
              color: gitConnected ? T.accent : T.txt1,
              border: `1px solid ${gitConnected ? T.accent + "4d" : T.border}`,
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 9,
              fontWeight: 700
            }}
          >
            {gitConnected ? "● " + t.gitConnected : "Offline Repo"}
          </span>
          <span
            style={{
              background: `${T.accent}12`,
              color: T.accent,
              border: `1px solid ${T.accent}33`,
              borderRadius: 4,
              padding: "1px 6px",
              fontSize: 9,
              fontWeight: 700
            }}
          >
            Theme: {preferences?.editor?.theme || "one-dark"} | Size: {preferences?.editor?.fontSize || 12}px | Keymap: {preferences?.editor?.keymap || "standard"}
          </span>
        </div>

        {/* Action button slots */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setGitConnected(!gitConnected)}
            style={{
              padding: "4px 10px",
              fontSize: 10.5,
              fontWeight: 700,
              borderRadius: 6,
              background: gitConnected ? T.accentDim : T.accent,
              color: gitConnected ? T.accent : "#000",
              border: `1px solid ${gitConnected ? T.accent : "transparent"}`,
              cursor: "pointer"
            }}
          >
            {gitConnected ? "Disconnect GitHub" : "Connect GitHub"}
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "4px 10px",
              fontSize: 10.5,
              fontWeight: 700,
              borderRadius: 6,
              background: T.bg2,
              border: `1px solid ${T.border}`,
              color: T.txt0,
              cursor: "pointer"
            }}
          >
            📂 Fetch from Local
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
            accept=".py,.csv,.json,.txt,.md"
          />
        </div>
      </div>

      {/* Main IDE area */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Left side File Tree navigation bar */}
        <div
          style={{
            width: 200,
            background: T.bg1,
            borderRight: `1px solid ${T.border}`,
            flexShrink: 0,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 10, color: T.txt1, fontWeight: 700, letterSpacing: 1 }}>
            WORKSPACE FILES
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "6px" }}>
            {Object.keys(files).map((name) => {
              const active = name === activeTab;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 10px",
                    borderRadius: 6,
                    background: active ? T.accentDim : "none",
                    border: "none",
                    cursor: "pointer",
                    color: active ? T.accent : T.txt1,
                    textAlign: "left",
                    outline: "none",
                    fontSize: 11.5,
                    fontWeight: active ? 700 : 400
                  }}
                >
                  <span style={{ fontSize: 13 }}>{name.endsWith(".csv") ? "📊" : "📄"}</span>
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side editing pane + Bottom terminal console */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          
          {/* Main Code Editor section */}
          {(() => {
            const editorPrefs = preferences?.editor || {
              theme: "one-dark" as const,
              fontSize: 12,
              lineWrapping: true,
              indentSize: 4 as const,
              keymap: "standard" as const
            };
            const themeConfig = THEME_CONFIGS[editorPrefs.theme] || THEME_CONFIGS["one-dark"];
            return (
              <div style={{ flex: 1, display: "flex", background: themeConfig.bg, minHeight: 0, position: "relative" }}>
                
                {/* Editor line numbers column */}
                <div
                  style={{
                    width: 34,
                    background: themeConfig.lineBg,
                    borderRight: `1px solid ${themeConfig.border}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: editorPrefs.fontSize - 1,
                    fontFamily: "monospace",
                    color: themeConfig.lineNum,
                    lineHeight: 1.6,
                    padding: "10px 0",
                    userSelect: "none",
                    flexShrink: 0
                  }}
                >
                  {Array.from({ length: files[activeTab]?.split("\n").length || 1 }).map((_, idx) => (
                    <div key={idx} style={{ height: "19px" }}>
                      {idx + 1}
                    </div>
                  ))}
                </div>

                {/* Interactive textarea editor */}
                <textarea
                  value={files[activeTab]}
                  onChange={(e) => handleEditCode(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    resize: "none",
                    outline: "none",
                    padding: "8px 12px",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: editorPrefs.fontSize,
                    color: themeConfig.txt,
                    lineHeight: 1.6,
                    tabSize: editorPrefs.indentSize,
                    whiteSpace: editorPrefs.lineWrapping ? "pre-wrap" : "pre",
                    overflowX: editorPrefs.lineWrapping ? "hidden" : "auto"
                  }}
                />
              </div>
            );
          })()}

          {/* Bash Terminal section */}
          <div
            style={{
              height: 200,
              background: "#09090D",
              borderTop: `2px solid ${T.border}`,
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              overflow: "hidden"
            }}
          >
            <div
              style={{
                height: 26,
                background: "#0F0F14",
                borderBottom: "1px solid #1c1c24",
                padding: "0 10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <span style={{ fontSize: 9.5, color: "#888", fontWeight: 700, fontFamily: "monospace" }}>
                {t.terminalLabel.toUpperCase()}
              </span>
              <button
                onClick={() => setTermHistory([])}
                style={{
                  background: "none",
                  border: "none",
                  color: T.red,
                  fontSize: 9.5,
                  cursor: "pointer",
                  fontFamily: "monospace"
                }}
              >
                Clear Terminal
              </button>
            </div>

            {/* History stack area */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "8px 12px",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 11.5,
                color: "#00C896",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap"
              }}
            >
              {termHistory.map((line, idx) => (
                <div key={idx} style={{ minHeight: "16px" }}>
                  {line}
                </div>
              ))}
              <div ref={termScrollRef} />
              
              {/* Actively edited input terminal line */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ flexShrink: 0 }}>jawat@codespace:~/workspace$&nbsp;</span>
                <input
                  value={inputLine}
                  onChange={(e) => setInputLine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runTerminalCommand()}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    outline: "none",
                    color: "#FFF",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    padding: 0
                  }}
                  autoFocus
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
