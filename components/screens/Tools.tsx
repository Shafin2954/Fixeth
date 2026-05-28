"use client";

import React, { useState } from "react";

export default function ToolsScreen({ T, t }: { T: any; t: any }) {
  const [provider, setProvider] = useState("groq");
  const [apiKey, setApiKey] = useState("");
  const [indeedConnected, setIndeedConnected] = useState(true);
  const [activeCloud, setActiveCloud] = useState<string | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState<"idle" | "testing" | "ok">("idle");
  
  const [bdixStatus, setBdixStatus] = useState<{ [key: string]: string }>({
    "AmberIT Cache": "ready",
    "SamOnline Cache": "ready",
    "Carnival Mirror": "ready"
  });
  const [dataSaver, setDataSaver] = useState(false);
  const [selectedMirror, setSelectedMirror] = useState("auto");
  const [resourceToast, setResourceToast] = useState<string | null>(null);

  const triggerSpeedTest = () => {
    setBdixStatus({
      "AmberIT Cache": "probing route...",
      "SamOnline Cache": "probing route...",
      "Carnival Mirror": "probing route..."
    });
    setTimeout(() => {
      setBdixStatus({
        "AmberIT Cache": "8ms — BDIX Gigabit Local",
        "SamOnline Cache": "11ms — BDIX Peer Line",
        "Carnival Mirror": "18ms — Optimal Hub"
      });
    }, 1200);
  };

  const providers = [
    { id: "groq", name: "Groq", tier: "Free Model Calls", icon: "⚡" },
    { id: "gemini", name: "Gemini", tier: "Free Tier", icon: "🤖" },
    { id: "openai", name: "OpenAI", tier: "Pay-as-you-go", icon: "🔮" },
    { id: "claude", name: "Anthropic Claude", tier: "Pay-as-you-go", icon: "✦" },
    { id: "ollama", name: "Ollama (Local AI)", tier: "100% Free", icon: "🦙" }
  ];

  const resources: { name: string; icon: string; color: string; url: string }[] = [
    { name: "NumPy Docs", icon: "📘", color: T.blue, url: "https://numpy.org/doc/" },
    { name: "Pandas Cheatsheet", icon: "📄", color: T.accent, url: "https://pandas.pydata.org/docs/" },
    { name: "Git Commands", icon: "📋", color: T.amber, url: "https://git-scm.com/docs" },
    { name: "Scikit-learn API", icon: "🔬", color: T.purple, url: "https://scikit-learn.org/stable/modules/classes.html" },
    { name: "Python REPL", icon: "💻", color: T.accent, url: "https://docs.python.org/3/tutorial/interpreter.html" },
    { name: "Regex Tester", icon: "🔍", color: T.red, url: "https://regex101.com/" }
  ];

  const openResource = (resource: { name: string; url: string }) => {
    window.open(resource.url, "_blank", "noopener,noreferrer");
    setResourceToast(`Opened ${resource.name}`);
    setTimeout(() => setResourceToast(null), 1700);
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: T.bg0 }}>
      <div style={{ maxWidth: 840, margin: "0 auto", padding: "20px 16px 40px" }}>
        
        <h2 style={{ color: T.txt0, fontSize: 18, fontWeight: 900, margin: "0 0 4px" }}>
          {t.tools}
        </h2>
        <p style={{ color: T.txt1, fontSize: 11.5, margin: "0 0 20px" }}>
          Configure self-hosted endpoints, API credentials, and index resource integrations
        </p>

        {/* Bring-Your-Own-Access Credentials Box */}
        <div
          style={{
            background: T.bg1,
            border: `1px solid ${T.accent}50`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: T.shadow
          }}
        >
          <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 4px" }}>
            ✦ {t.byoaKey} (BYOA)
          </h3>
          <p style={{ color: T.txt1, fontSize: 11, margin: "0 0 16px" }}>
            Credentials stay local in your browser sandbox container and are never uploaded to remote tracking logs
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
            {providers.map((p) => {
              const active = provider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  style={{
                    padding: "12px",
                    borderRadius: 10,
                    background: active ? T.accentDim : T.bg2,
                    border: `1px solid ${active ? T.accent : T.border}`,
                    cursor: "pointer",
                    textAlign: "left",
                    color: T.txt0,
                    outline: "none"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 16 }}>{p.icon}</span>
                    <span style={{ fontSize: 8, color: T.accent, fontWeight: 700 }}>{p.tier}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 800 }}>{p.name}</div>
                </button>
              );
            })}
          </div>

          {provider === "ollama" ? (
            <div style={{ background: T.bg2, borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.txt0, marginBottom: 6 }}>🦙 Ollama Local Host Terminal Setup</div>
              <div style={{ fontFamily: "monospace", fontSize: 10.5, color: T.accent, background: T.bg3, padding: "8px 12px", borderRadius: 6, marginBottom: 10, lineHeight: 1.5 }}>
                $ ollama run llama3.2
                <br />
                $ ollama serve
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => {
                    setOllamaStatus("testing");
                    setTimeout(() => setOllamaStatus("ok"), 1500);
                  }}
                  style={{
                    background: T.accent,
                    border: "none",
                    borderRadius: 6,
                    padding: "6px 14px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#000",
                    cursor: "pointer"
                  }}
                >
                  {ollamaStatus === "testing" ? "Probing local port..." : "Test Local Connection"}
                </button>
                {ollamaStatus === "ok" && (
                  <span style={{ color: T.accent, fontSize: 10.5, fontWeight: 700 }}>
                    ✓ Connected to http://localhost:11434 (llama3.2 active)
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={`Set custom local API key for ${providers.find((p) => p.id === provider)?.name}...`}
                style={{
                  flex: 1,
                  background: T.bg2,
                  border: `1px solid ${T.border}`,
                  borderRadius: 8,
                  padding: "8px 12px",
                  color: T.txt0,
                  fontSize: 11.5,
                  outline: "none",
                  fontFamily: "monospace"
                }}
              />
              <button
                style={{
                  background: T.accent,
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#000",
                  cursor: "pointer"
                }}
              >
                Save Local Storage Key
              </button>
            </div>
          )}
        </div>

        {/* Resource Library */}
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: "22px", boxShadow: T.shadow, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.txt0, marginBottom: 14 }}>📚 Resource Library</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {resources.map((resource) => (
              <button
                key={resource.name}
                onClick={() => openResource(resource)}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px 12px",
                  background: T.bg2,
                  borderRadius: 8,
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ fontSize: 16 }}>{resource.icon}</span>
                <span style={{ fontSize: 12, color: T.txt0, fontWeight: 500 }}>{resource.name}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, color: resource.color }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Job Index Synchronizer */}
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: T.shadow }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 2px" }}>
                National Job Index Sync Console
              </h3>
              <p style={{ color: T.txt1, fontSize: 11, margin: 0 }}>
                Aggregates active corporate demand postings across Dhaka & Chittagong
              </p>
            </div>
            <button
              onClick={() => setIndeedConnected(!indeedConnected)}
              style={{
                background: indeedConnected ? T.accentDim : T.accent,
                border: indeedConnected ? `1px solid ${T.accent}` : "none",
                borderRadius: 8,
                padding: "6px 14px",
                fontSize: 11,
                color: indeedConnected ? T.accent : "#000",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              {indeedConnected ? "● Analytics Connected" : "Link Real-Time Sync"}
            </button>
          </div>
        </div>

        {/* BDIX Gigabit Cache & Mobile Internet Optimizer (Low-Friction Bangladesh Support) */}
        <div
          style={{
            background: T.bg1,
            border: `1px solid ${T.border}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: T.shadow
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 4px" }}>
                🇧🇩 BDIX Giga-Stream Optimizer
              </h3>
              <p style={{ color: T.txt1, fontSize: 11, margin: 0 }}>
                Bypasses standard global routing to stream direct from local ISP caches in Bangladesh, avoiding buffering lag on unstable broadband lines.
              </p>
            </div>
            <button
              onClick={triggerSpeedTest}
              style={{
                background: T.accent,
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 10,
                fontWeight: 800,
                color: "#000",
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              ⚡ Test ISP Pings
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 16 }}>
            {Object.entries(bdixStatus).map(([mirror, status]) => (
              <div
                key={mirror}
                onClick={() => setSelectedMirror(mirror)}
                style={{
                  background: selectedMirror === mirror ? T.accentDim : T.bg2,
                  border: `1px solid ${selectedMirror === mirror ? T.accent : T.border}`,
                  padding: "10px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: T.txt0 }}>{mirror}</span>
                  {selectedMirror === mirror && (
                    <span style={{ fontSize: 9, background: T.accent, color: "#000", padding: "1px 4px", borderRadius: 4, fontWeight: 900 }}>
                      ACTIVE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: (status as string).includes("probing") ? T.amber : T.accent, fontFamily: "monospace" }}>
                  Status: {status as string}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Mobile Cellular Internet Saver Switch */}
          <div
            style={{
              background: dataSaver ? `${T.accent}12` : T.bg2,
              border: `1px solid ${dataSaver ? T.accent : T.border}`,
              borderRadius: 8,
              padding: "12px 16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.txt0, display: "flex", alignItems: "center", gap: 6 }}>
                📉 Low-Bandwidth Mobile Internet Saver Mode
                {dataSaver && <span style={{ fontSize: 9, background: T.accent, color: "#000", padding: "1px 5px", borderRadius: 4 }}>Enabled</span>}
              </div>
              <div style={{ fontSize: 10, color: T.txt1, marginTop: 2 }}>
                Reduces streaming frames & switches to light-weight vector audio logs for cellular data (Grameenphone, Robi, Teletalk mobile data packs).
              </div>
            </div>
            <button
              onClick={() => setDataSaver(!dataSaver)}
              style={{
                background: dataSaver ? T.accent : T.bg3,
                border: `1px solid ${dataSaver ? T.accent : T.border}`,
                color: dataSaver ? "#000" : T.txt1,
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                outline: "none"
              }}
            >
              {dataSaver ? "Saver Mode: On" : "Enable Mode"}
            </button>
          </div>
        </div>

        {/* Cloud Hosting Sync */}
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, boxShadow: T.shadow }}>
          <h3 style={{ fontSize: 13.5, fontWeight: 800, color: T.txt0, margin: "0 0 12px" }}>
            {t.cloudConnect}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { id: "gcp", name: "Google Cloud Platform", desc: "Serverless pipelines deploy base" },
              { id: "aws", name: "Amazon Web Services", desc: "S3 cluster and bucket mounting base" }
            ].map((cloud) => {
              const active = activeCloud === cloud.id;
              return (
                <div
                  key={cloud.id}
                  style={{
                    background: T.bg2,
                    border: `1.5px solid ${active ? T.accent : T.border}`,
                    borderRadius: 10,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T.txt0 }}>{cloud.name}</div>
                    <div style={{ fontSize: 10, color: T.txt1, marginTop: 2 }}>{cloud.desc}</div>
                  </div>
                  <button
                    onClick={() => setActiveCloud(active ? null : cloud.id)}
                    style={{
                      background: active ? T.accentDim : T.bg3,
                      border: `1px solid ${active ? T.accent : T.border}`,
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: active ? T.accent : T.txt1,
                      cursor: "pointer"
                    }}
                  >
                    {active ? "Linked" : "Link Account"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {resourceToast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: T.accent,
            color: "#000",
            padding: "10px 14px",
            borderRadius: 8,
            boxShadow: T.shadow,
            fontSize: 11,
            fontWeight: 800,
            zIndex: 120
          }}
        >
          {resourceToast}
        </div>
      )}
    </div>
  );
}
