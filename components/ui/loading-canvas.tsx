"use client";

type LoadingCanvasVariant = "dashboard" | "list" | "library" | "auth" | "profile" | "centered";

type LoadingCanvasTheme = {
  bg0: string;
  bg1: string;
  bg2: string;
  bg3: string;
  border: string;
  shadow: string;
  accent: string;
  txt0: string;
  txt1: string;
  txt2: string;
};

const DEFAULT_THEME: LoadingCanvasTheme = {
  bg0: "#0B0B0F",
  bg1: "#14141A",
  bg2: "#1B1B24",
  bg3: "#242433",
  border: "rgba(255, 255, 255, 0.08)",
  shadow: "0 20px 60px rgba(0, 0, 0, 0.28)",
  accent: "#00C896",
  txt0: "#EEEEF8",
  txt1: "#A5A5C2",
  txt2: "#7D7D97"
};

export default function LoadingCanvas({
  variant = "dashboard",
  theme = DEFAULT_THEME,
  showTopBar = false
}: {
  variant?: LoadingCanvasVariant;
  theme?: Partial<LoadingCanvasTheme>;
  showTopBar?: boolean;
}) {
  const T = { ...DEFAULT_THEME, ...theme };
  const shimmer = `linear-gradient(90deg, ${T.bg2} 0%, ${T.bg3} 50%, ${T.bg2} 100%)`;

  return (
    <div style={{ minHeight: "100vh", overflow: "hidden", background: T.bg0, color: T.txt0 }}>
      <style>{`
        @keyframes fixeth-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fixeth-breathe {
          0%, 100% { transform: translateY(0); opacity: 0.72; }
          50% { transform: translateY(-2px); opacity: 1; }
        }
        @keyframes fixeth-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
      `}</style>

      {showTopBar ? (
        <div style={{ height: 72, borderBottom: `1px solid ${T.border}`, background: T.bg0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
          <div style={{ width: 120, height: 18, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
            <div style={{ width: 34, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
          </div>
        </div>
      ) : null}

      <div style={{ maxWidth: variant === "auth" ? 480 : 1040, margin: "0 auto", padding: variant === "auth" ? "32px 16px 48px" : "20px 16px 40px" }}>
        {variant === "auth" ? renderAuth(T, shimmer) : null}
        {variant === "profile" ? renderProfile(T, shimmer) : null}
        {variant === "list" ? renderList(T, shimmer) : null}
        {variant === "library" ? renderLibrary(T, shimmer) : null}
        {variant === "dashboard" ? renderDashboard(T, shimmer) : null}
        {variant === "centered" ? renderCentered(T, shimmer) : null}
      </div>
    </div>
  );
}

function renderBars(widths: string[]) {
  return widths.map((width, index) => (
    <div
      key={`${width}-${index}`}
      style={{
        width,
        height: 12,
        borderRadius: 999,
        background: `linear-gradient(90deg, #1B1B24 0%, #242433 50%, #1B1B24 100%)`,
        backgroundSize: "400% 100%",
        animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s`
      }}
    />
  ));
}

function renderAuth(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 80px)", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -40, right: -20, width: 280, height: 280, borderRadius: "999px", background: T.accent + "16", filter: "blur(32px)", animation: "fixeth-float 5.5s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: -40, left: -20, width: 300, height: 300, borderRadius: "999px", background: T.accent + "10", filter: "blur(34px)", animation: "fixeth-float 7s ease-in-out infinite" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 120, height: 28, margin: "0 auto 10px", borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
          <div style={{ width: "72%", height: 12, margin: "0 auto", borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
        </div>
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 24, padding: 24, boxShadow: T.shadow }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <div style={{ flex: 1, height: 38, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
            <div style={{ flex: 1, height: 38, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ height: 44, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
            <div style={{ height: 44, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
            <div style={{ height: 44, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
            <div style={{ height: 44, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.24s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderProfile(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: "45%", height: 34, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ width: 160, height: 38, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.shadow }}>
        <div style={{ display: "grid", gap: 12 }}>
          {renderBars(["32%", "68%", "58%", "76%", "50%"])}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, minHeight: 180 }}>
            <div style={{ width: "38%", height: 14, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08}s` }} />
            <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
              {renderBars(["80%", "64%", "52%", "72%"])}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderList(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: "38%", height: 30, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ width: 138, height: 40, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 12 }}>
          <div style={{ width: "28%", height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08}s` }} />
          <div style={{ width: "72%", height: 26, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08 + 0.04}s` }} />
          <div style={{ width: "58%", height: 10, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08 + 0.08}s` }} />
          <div style={{ height: 6, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08 + 0.12}s` }} />
        </div>
      ))}
    </div>
  );
}

function renderLibrary(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ width: "36%", height: 30, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ width: 170, height: 40, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow }}>
        <div style={{ width: "32%", height: 13, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginTop: 16 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} style={{ minHeight: 168, borderRadius: 14, border: `1px solid ${T.border}`, background: T.bg2, padding: 16, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
                <div style={{ width: 68, height: 20, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
              </div>
              <div style={{ width: "78%", height: 18, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.08}s` }} />
              <div style={{ width: "60%", height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.12}s` }} />
              <div style={{ marginTop: "auto", width: 96, height: 36, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.16}s` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function renderDashboard(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}14 100%)`, border: `1px solid ${T.border}`, borderRadius: 18, padding: 24, boxShadow: T.shadow }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)", gap: 18 }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 440 }}>
            <div style={{ width: "40%", height: 18, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
            <div style={{ width: "78%", height: 42, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
            <div style={{ width: "62%", height: 14, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} style={{ width: 30, height: 30, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s` }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} style={{ width: index === 0 ? 138 : 112, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.08}s` }} />
              ))}
            </div>
            <div style={{ width: 170, height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.24s" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, boxShadow: T.shadow, minHeight: 96, display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
            <div style={{ flex: 1, display: "grid", gap: 10 }}>
              <div style={{ width: "58%", height: 10, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s` }} />
              <div style={{ width: "42%", height: 20, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06 + 0.05}s` }} />
              <div style={{ width: "70%", height: 9, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06 + 0.1}s` }} />
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {[0, 1].map((section) => (
          <div key={section} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow }}>
            <div style={{ width: "36%", height: 13, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${section * 0.08}s` }} />
            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ width: "52%", height: 11, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
                    <div style={{ width: 36, height: 11, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.08}s` }} />
                  <div style={{ width: "40%", height: 9, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.12}s` }} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderCentered(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ minHeight: "calc(100vh - 80px)", display: "grid", placeItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 360, display: "grid", gap: 14, textAlign: "center" }}>
        <div style={{ width: 84, height: 84, borderRadius: 28, margin: "0 auto", background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ width: "62%", height: 18, borderRadius: 999, margin: "0 auto", background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
        <div style={{ width: "82%", height: 12, borderRadius: 999, margin: "0 auto", background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {renderBars(["88%", "76%", "64%", "72%"])}
        </div>
      </div>
    </div>
  );
}