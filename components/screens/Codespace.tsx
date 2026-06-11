"use client";

import React, { useState, useRef, useEffect } from "react";
import { UserPreferences } from "@/types/ui";
import { runPython } from "@/lib/notebook/pyodide";
import {
  getCurrentUser,
  listRepos,
  listRepoFiles,
  getFileContent,
  getToken,
  setToken,
  hasToken,
  type GitHubUser,
  type GitHubRepo
} from "@/lib/github/client";

const THEME_CONFIGS = {
  monokai: { bg: "#272822", txt: "#f8f8f2", border: "#3e3d32", lineBg: "#1e1f1c", lineNum: "#75715e" },
  "one-dark": { bg: "#282c34", txt: "#abb2bf", border: "#181a1f", lineBg: "#21252b", lineNum: "#4b5263" },
  solarized: { bg: "#002b36", txt: "#839496", border: "#073642", lineBg: "#00212b", lineNum: "#586e75" },
  vibrant: { bg: "#0f0f16", txt: "#eeeeee", border: "#222233", lineBg: "#08080c", lineNum: "#555577" },
  "github-light": { bg: "#f6f8fa", txt: "#24292f", border: "#d0d7de", lineBg: "#eaeef2", lineNum: "#57606a" }
};

const STARTER_FILES: { [key: string]: string } = {
  "main.py": `# Real Python runs in your browser (Pyodide).\n# Type 'python main.py' in the terminal to execute.\n\nfor i in range(1, 6):\n    print(f"Line {i}: hello from Fixeth")\n\ntotal = sum(range(1, 101))\nprint("Sum 1..100 =", total)`,
  "utils.py": `def mean(data):\n    return sum(data) / len(data)\n\nif __name__ == "__main__":\n    print(mean([87, 92, 78, 95, 82]))`,
  "README.md": `# Fixeth Codespace\nAn in-browser IDE.\n\n- Edit files on the left, run Python in the terminal.\n- Click "Connect GitHub" to load files from your own repositories.`
};

export default function CodeSpaceScreen({ T, t, preferences }: { T: any; t: any; preferences: UserPreferences }) {
  const [activeTab, setActiveTab] = useState("main.py");
  const [files, setFiles] = useState<{ [key: string]: string }>({ ...STARTER_FILES });

  // GitHub state
  const [ghUser, setGhUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [activeRepo, setActiveRepo] = useState<GitHubRepo | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [ghError, setGhError] = useState<string | null>(null);
  const [ghLoading, setGhLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);
  const [filePanelOpen, setFilePanelOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const [termHistory, setTermHistory] = useState<string[]>([
    "Fixeth codespace ready. Real Python (Pyodide) compiled to WebAssembly.",
    "Type 'help' for available commands.",
    ""
  ]);
  const [inputLine, setInputLine] = useState("");
  const [busy, setBusy] = useState(false);
  const termScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const prompt = ghUser ? `${ghUser.login}@codespace:~$ ` : "guest@codespace:~$ ";

  useEffect(() => {
    termScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [termHistory]);

  // Restore an existing GitHub session on mount.
  useEffect(() => {
    if (!hasToken()) return;
    setGhLoading(true);
    getCurrentUser()
      .then(async (u) => {
        setGhUser(u);
        setRepos(await listRepos());
      })
      .catch(() => setToken(""))
      .finally(() => setGhLoading(false));
  }, []);

  const handleConnect = async () => {
    setGhError(null);
    setGhLoading(true);
    setToken(tokenInput.trim());
    try {
      const u = await getCurrentUser();
      setGhUser(u);
      setRepos(await listRepos());
      setShowConnect(false);
      setTokenInput("");
      pushTerm(`Connected to GitHub as ${u.login}.`);
    } catch (err) {
      setToken("");
      setGhError((err as Error).message);
    } finally {
      setGhLoading(false);
    }
  };

  const handleDisconnect = () => {
    setToken("");
    setGhUser(null);
    setRepos([]);
    setActiveRepo(null);
    setFiles({ ...STARTER_FILES });
    setActiveTab("main.py");
    pushTerm("Disconnected from GitHub.");
  };

  const openRepo = async (repo: GitHubRepo) => {
    setActiveRepo(repo);
    setGhLoading(true);
    pushTerm(`Cloning ${repo.full_name} (${repo.default_branch})…`);
    try {
      const tree = await listRepoFiles(repo.full_name, repo.default_branch);
      // Load a manageable subset of text files up front.
      const textFiles = tree
        .filter((f) => /\.(py|js|ts|tsx|jsx|md|txt|csv|json|html|css|c|cpp|java|go|rs|sh)$/i.test(f.path))
        .slice(0, 40);
      const loaded: { [k: string]: string } = {};
      for (const f of textFiles) {
        loaded[f.path] = await getFileContent(repo.full_name, f.path);
      }
      setFiles(loaded);
      setActiveTab(textFiles[0]?.path ?? "");
      pushTerm(`Loaded ${textFiles.length} files from ${repo.full_name}.`);
    } catch (err) {
      pushTerm(`Error loading repo: ${(err as Error).message}`);
    } finally {
      setGhLoading(false);
    }
  };

  const pushTerm = (...lines: string[]) => setTermHistory((p) => [...p, ...lines]);

  const handleEditCode = (newCode: string) =>
    setFiles((p) => ({ ...p, [activeTab]: newCode }));

  const runTerminalCommand = async () => {
    const rawCmd = inputLine.trim();
    setInputLine("");
    if (!rawCmd) return;
    pushTerm(`${prompt}${rawCmd}`);
    const args = rawCmd.split(/\s+/);
    const cmd = args[0].toLowerCase();

    if (cmd === "clear") {
      setTermHistory([]);
      return;
    }
    if (cmd === "help") {
      pushTerm(
        "Available commands:",
        "  python <file>   run a Python file with the real interpreter",
        "  ls              list workspace files",
        "  cat <file>      print file contents",
        "  pwd             print working directory",
        "  whoami          show GitHub user",
        "  clear           clear the terminal"
      );
      return;
    }
    if (cmd === "ls") {
      pushTerm(Object.keys(files).map((n) => "  " + n).join("\n") || "  (empty)");
      return;
    }
    if (cmd === "pwd") {
      pushTerm(activeRepo ? `/workspace/${activeRepo.name}` : "/workspace");
      return;
    }
    if (cmd === "whoami") {
      pushTerm(ghUser ? ghUser.login : "guest (not connected to GitHub)");
      return;
    }
    if (cmd === "cat") {
      const target = args[1];
      pushTerm(files[target] !== undefined ? files[target] : `cat: ${target || ""}: No such file`);
      return;
    }
    if (cmd === "python" || cmd === "python3") {
      const target = args[1];
      if (!target) return pushTerm("usage: python <file>");
      const code = files[target];
      if (code === undefined) return pushTerm(`python: can't open file '${target}': No such file`);
      setBusy(true);
      pushTerm("(running… first run boots the Python runtime)");
      try {
        const res = await runPython(code);
        if (res.stdout) pushTerm(res.stdout);
        if (res.result) pushTerm(res.result);
        if (res.stderr) pushTerm(res.stderr);
        if (!res.stdout && !res.result && !res.stderr) pushTerm("(no output)");
      } catch (err) {
        pushTerm(`Runtime error: ${(err as Error).message}`);
      } finally {
        setBusy(false);
      }
      return;
    }
    pushTerm(`bash: ${cmd}: command not found. Type 'help'.`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setFiles((p) => ({ ...p, [file.name]: content }));
      setActiveTab(file.name);
      pushTerm(`[upload] ${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsText(file);
  };

  const editorPrefs = preferences?.editor || {
    theme: "one-dark" as const,
    fontSize: 12,
    lineWrapping: true,
    indentSize: 4 as const,
    keymap: "standard" as const
  };
  const themeConfig = THEME_CONFIGS[editorPrefs.theme] || THEME_CONFIGS["one-dark"];

  return (
    <div style={{ flex: 1, background: T.bg0, display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Toolbar */}
      <div style={{ height: 40, background: T.navBg, borderBottom: `1px solid ${T.border}`, padding: "0 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: T.txt0 }}>Fixeth Codespace</span>
          <span style={{ background: ghUser ? "#00C8961a" : T.bg3, color: ghUser ? T.accent : T.txt1, border: `1px solid ${ghUser ? T.accent + "4d" : T.border}`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>
            {ghUser ? `● ${ghUser.login}` : "Local workspace"}
          </span>
          {activeRepo && (
            <span style={{ background: `${T.blue}12`, color: T.blue, border: `1px solid ${T.blue}33`, borderRadius: 4, padding: "1px 6px", fontSize: 9, fontWeight: 700 }}>
              {activeRepo.full_name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {ghUser ? (
            <button onClick={handleDisconnect} style={pill(T, "ghost")}>Disconnect GitHub</button>
          ) : (
            <button onClick={() => setShowConnect(true)} style={pill(T, "solid")}>Connect GitHub</button>
          )}
          <button onClick={() => fileInputRef.current?.click()} style={pill(T, "outline")}>Upload file</button>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: "none" }} accept=".py,.csv,.json,.txt,.md,.js,.ts" />
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>
        {/* Mobile overlay */}
        {isMobile && filePanelOpen && (
          <div onClick={() => setFilePanelOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 50 }} />
        )}

        {/* Mobile toggle button */}
        {isMobile && !filePanelOpen && (
          <button
            onClick={() => setFilePanelOpen(true)}
            style={{ position: "absolute", top: 10, left: 10, zIndex: 45, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", color: T.txt1, cursor: "pointer", fontSize: 12, fontWeight: 700 }}
          >
            📁 Files
          </button>
        )}

        {/* Sidebar: repos + files */}
        <div style={{ width: 220, background: T.bg1, borderRight: `1px solid ${T.border}`, flexShrink: 0, display: isMobile ? (filePanelOpen ? "flex" : "none") : "flex", flexDirection: "column", ...(isMobile ? { position: "fixed", top: 40, bottom: 0, left: 0, zIndex: 51 } : {}) }}>
          {ghUser && (
            <div style={{ borderBottom: `1px solid ${T.border}`, maxHeight: 180, overflowY: "auto" }}>
              <div style={{ padding: "10px 14px 6px", fontSize: 10, color: T.txt1, fontWeight: 700, letterSpacing: 1 }}>
                REPOSITORIES {ghLoading && "…"}
              </div>
              {repos.map((r) => (
                <button
                  key={r.id}
                  onClick={() => void openRepo(r)}
                  style={{ width: "100%", textAlign: "left", padding: "5px 12px", background: activeRepo?.id === r.id ? T.accentDim : "none", border: "none", cursor: "pointer", color: activeRepo?.id === r.id ? T.accent : T.txt1, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}
                >
                  <span style={{ opacity: 0.7 }}>{r.private ? "🔒" : "○"}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                </button>
              ))}
            </div>
          )}
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, fontSize: 10, color: T.txt1, fontWeight: 700, letterSpacing: 1 }}>
            {activeRepo ? "REPO FILES" : "WORKSPACE FILES"}
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 6 }}>
            {Object.keys(files).map((name) => {
              const active = name === activeTab;
              return (
                <button
                  key={name}
                  onClick={() => setActiveTab(name)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, background: active ? T.accentDim : "none", border: "none", cursor: "pointer", color: active ? T.accent : T.txt1, textAlign: "left", outline: "none", fontSize: 11, fontWeight: active ? 700 : 400 }}
                >
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                </button>
              );
            })}
            {Object.keys(files).length === 0 && (
              <p style={{ fontSize: 10.5, color: T.txt2, padding: "4px 8px" }}>No files loaded.</p>
            )}
          </div>
        </div>

        {/* Editor + terminal */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ flex: 1, display: "flex", background: themeConfig.bg, minHeight: 0 }}>
            <div style={{ width: 34, background: themeConfig.lineBg, borderRight: `1px solid ${themeConfig.border}`, display: "flex", flexDirection: "column", alignItems: "center", fontSize: editorPrefs.fontSize - 1, fontFamily: "monospace", color: themeConfig.lineNum, lineHeight: 1.6, padding: "10px 0", userSelect: "none", flexShrink: 0 }}>
              {Array.from({ length: files[activeTab]?.split("\n").length || 1 }).map((_, idx) => (
                <div key={idx} style={{ height: "19px" }}>{idx + 1}</div>
              ))}
            </div>
            <textarea
              value={files[activeTab] ?? ""}
              onChange={(e) => handleEditCode(e.target.value)}
              spellCheck={false}
              style={{ flex: 1, background: "transparent", border: "none", resize: "none", outline: "none", padding: "8px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: editorPrefs.fontSize, color: themeConfig.txt, lineHeight: 1.6, tabSize: editorPrefs.indentSize, whiteSpace: editorPrefs.lineWrapping ? "pre-wrap" : "pre", overflowX: editorPrefs.lineWrapping ? "hidden" : "auto" }}
            />
          </div>

          {/* Terminal */}
          <div style={{ height: 200, background: "#09090D", borderTop: `2px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden" }}>
            <div style={{ height: 26, background: "#0F0F14", borderBottom: "1px solid #1c1c24", padding: "0 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9.5, color: "#888", fontWeight: 700, fontFamily: "monospace" }}>
                {(t.terminalLabel || "TERMINAL").toUpperCase()} {busy && "· running"}
              </span>
              <button onClick={() => setTermHistory([])} style={{ background: "none", border: "none", color: T.red, fontSize: 9.5, cursor: "pointer", fontFamily: "monospace" }}>
                Clear
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px", fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#00C896", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {termHistory.map((line, idx) => (
                <div key={idx} style={{ minHeight: "16px" }}>{line}</div>
              ))}
              <div ref={termScrollRef} />
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ flexShrink: 0 }}>{prompt}</span>
                <input
                  value={inputLine}
                  onChange={(e) => setInputLine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !busy && void runTerminalCommand()}
                  disabled={busy}
                  style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#FFF", fontFamily: "inherit", fontSize: "inherit", padding: 0 }}
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect GitHub modal */}
      {showConnect && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }} onClick={() => setShowConnect(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, width: 420, maxWidth: "90vw" }}>
            <h3 style={{ margin: 0, color: T.txt0, fontSize: 15, fontWeight: 900 }}>Connect GitHub</h3>
            <p style={{ color: T.txt1, fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>
              Paste a Personal Access Token to load your repositories. The token is stored only in your browser and is never sent to our servers.
            </p>
            <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noreferrer" style={{ color: T.accent, fontSize: 11.5, textDecoration: "underline" }}>
              Create a fine-grained token (repo contents: read) →
            </a>
            <input
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_… or github_pat_…"
              type="password"
              style={{ width: "100%", marginTop: 12, background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", color: T.txt0, fontSize: 12, outline: "none" }}
            />
            {ghError && <p style={{ color: T.red, fontSize: 11, marginTop: 6 }}>{ghError}</p>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button onClick={() => setShowConnect(false)} style={pill(T, "outline")}>Cancel</button>
              <button onClick={() => void handleConnect()} disabled={ghLoading || !tokenInput.trim()} style={pill(T, "solid")}>
                {ghLoading ? "Connecting…" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function pill(T: any, variant: "solid" | "outline" | "ghost"): React.CSSProperties {
  const base: React.CSSProperties = { padding: "4px 10px", fontSize: 10.5, fontWeight: 700, borderRadius: 6, cursor: "pointer" };
  if (variant === "solid") return { ...base, background: T.accent, color: "#000", border: "1px solid transparent" };
  if (variant === "ghost") return { ...base, background: T.accentDim, color: T.accent, border: `1px solid ${T.accent}` };
  return { ...base, background: T.bg2, color: T.txt0, border: `1px solid ${T.border}` };
}
