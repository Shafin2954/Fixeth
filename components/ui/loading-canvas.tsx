"use client";

type LoadingCanvasVariant =
  | "dashboard"
  | "workspace"
  | "learn"
  | "notebook"
  | "quiz"
  | "submissions"
  | "codespace"
  | "tools"
  | "community"
  | "certificates"
  | "mentor"
  | "list"
  | "library"
  | "auth"
  | "profile"
  | "centered";

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
      `}</style>

      {showTopBar ? <TopBar T={T} shimmer={shimmer} /> : null}

      <div
        style={{
          maxWidth: variant === "auth" ? 480 : 1080,
          margin: "0 auto",
          padding:
            variant === "auth"
              ? "32px 16px 48px"
              : variant === "workspace" || variant === "learn" || variant === "notebook" || variant === "quiz" || variant === "submissions"
                ? 0
                : "20px 16px 40px"
        }}
      >
        {variant === "auth" ? renderAuth(T, shimmer) : null}
        {variant === "dashboard" ? renderDashboard(T, shimmer) : null}
        {variant === "workspace" ? renderWorkspace(T, shimmer) : null}
        {variant === "learn" ? renderLearn(T, shimmer) : null}
        {variant === "notebook" ? renderNotebook(T, shimmer) : null}
        {variant === "quiz" ? renderQuiz(T, shimmer) : null}
        {variant === "submissions" ? renderSubmissions(T, shimmer) : null}
        {variant === "codespace" ? renderCodeSpace(T, shimmer) : null}
        {variant === "tools" ? renderTools(T, shimmer) : null}
        {variant === "community" ? renderCommunity(T, shimmer) : null}
        {variant === "certificates" ? renderCertificates(T, shimmer) : null}
        {variant === "mentor" ? renderMentor(T, shimmer) : null}
        {variant === "profile" ? renderProfile(T, shimmer) : null}
        {variant === "list" ? renderList(T, shimmer) : null}
        {variant === "library" ? renderLibrary(T, shimmer) : null}
        {variant === "centered" ? renderCentered(T, shimmer) : null}
      </div>
    </div>
  );
}

function TopBar({ T, shimmer }: { T: LoadingCanvasTheme; shimmer: string }) {
  return (
    <div style={{ height: 72, borderBottom: `1px solid ${T.border}`, background: T.bg0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px" }}>
      <div style={{ width: 140, height: 18, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
        <div style={{ width: 34, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
    </div>
  );
}

function bar(width: string, height = 12) {
  return <div style={{ width, height, borderRadius: 999, background: "linear-gradient(90deg, #1B1B24 0%, #242433 50%, #1B1B24 100%)", backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />;
}

function renderAuth(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ position: "relative", minHeight: "calc(100vh - 80px)", display: "grid", placeItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: -40, right: -20, width: 280, height: 280, borderRadius: 999, background: T.accent + "16", filter: "blur(32px)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -20, width: 300, height: 300, borderRadius: 999, background: T.accent + "10", filter: "blur(34px)" }} />
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

function renderDashboard(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ background: `linear-gradient(135deg, ${T.bg2} 0%, ${T.accent}14 100%)`, border: `1px solid ${T.border}`, borderRadius: 18, padding: 24, boxShadow: T.shadow }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)", gap: 18 }}>
          <div style={{ display: "grid", gap: 10, maxWidth: 440 }}>
            {bar("40%", 18)}
            <div style={{ width: "78%", height: 42, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
            {bar("62%", 14)}
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} style={{ width: 30, height: 30, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s` }} />
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <div style={{ width: 138, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
              <div style={{ width: 112, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
              <div style={{ width: 112, height: 42, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
            </div>
            {bar("170px", 12)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 16, boxShadow: T.shadow, minHeight: 96, display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center" }}>
            <div style={{ flex: 1, display: "grid", gap: 10 }}>
              {bar("58%", 10)}
              <div style={{ width: "42%", height: 20, borderRadius: 8, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06 + 0.05}s` }} />
              {bar("70%", 9)}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        {[0, 1].map((section) => (
          <div key={section} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow }}>
            {bar("36%", 13)}
            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    {bar("52%", 11)}
                    {bar("36px", 11)}
                  </div>
                  <div style={{ height: 4, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
                  {bar("40%", 9)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderWorkspace(T: LoadingCanvasTheme, shimmer: string) {
  return renderWorkspaceLike(T, shimmer);
}

function renderWorkspaceLike(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8, minWidth: 260 }}>
          {bar("42%", 14)}
          {bar("78%", 12)}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} style={{ width: 120, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, minHeight: 0 }}>
        <div style={{ flex: 1.3, minWidth: 300, display: "grid", gap: 12 }}>
          <div style={{ background: "#000", borderRadius: 12, overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: T.shadow }}>
            <div style={{ aspectRatio: "16 / 9", background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
            <div style={{ height: 54, background: T.bg2, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 12px", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
              <div style={{ flex: 1, display: "grid", gap: 6 }}>
                {bar("46%", 10)}
                {bar("72%", 6)}
              </div>
            </div>
          </div>
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
            {bar("26%", 12)}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={{ height: 20, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 280, display: "grid", gap: 12 }}>
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", boxShadow: T.shadow }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${T.border}` }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} style={{ flex: 1, height: 42, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
              ))}
            </div>
            <div style={{ padding: 14, display: "grid", gap: 12 }}>
              {bar("44%", 12)}
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} style={{ height: index === 0 ? 46 : 34, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
              ))}
            </div>
          </div>
          <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
            {bar("54%", 12)}
            <div style={{ height: 120, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function renderLearn(T: LoadingCanvasTheme, shimmer: string) {
  return renderWorkspaceLike(T, shimmer);
}

function renderNotebook(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 14, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "grid", gap: 12 }}>
        {bar("46%", 16)}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ width: 120, height: 30, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ display: "grid", gridTemplateColumns: "34px 1fr", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
            <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
              {bar("28%", 12)}
              <div style={{ height: 82, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
              <div style={{ height: 56, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.08}s` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderQuiz(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 14, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8, width: "58%", minWidth: 260 }}>
          {bar("48%", 16)}
          {bar("86%", 11)}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "grid", gap: 12 }}>
          {bar("78%", 14)}
          <div style={{ display: "grid", gap: 8 }}>
            {Array.from({ length: 4 }).map((_, optionIndex) => (
              <div key={optionIndex} style={{ height: 34, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + optionIndex * 0.04}s` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderSubmissions(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 14, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 8, width: "58%", minWidth: 260 }}>
          {bar("54%", 16)}
          {bar("84%", 11)}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ width: 96, height: 32, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite" }} />
          <div style={{ width: 96, height: 32, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {bar("68%", 14)}
          {bar("42%", 10)}
          <div style={{ height: 6, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
        </div>
      ))}
    </div>
  );
}

function renderCodeSpace(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gridTemplateRows: "40px minmax(0, 1fr) 180px", gap: 12, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 12, padding: 10, boxShadow: T.shadow, display: "flex", justifyContent: "space-between", gap: 8 }}>
        {bar("34%", 18)}
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ width: 56, height: 18, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "260px minmax(0, 1fr)", gap: 12, minHeight: 0 }}>
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} style={{ height: 34, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.04}s` }} />
          ))}
        </div>
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {bar("42%", 14)}
          <div style={{ flex: 1, borderRadius: 14, background: shimmer, backgroundSize: "400% 100%", minHeight: 360, animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
        </div>
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, boxShadow: T.shadow, display: "grid", gap: 10 }}>
        {bar("22%", 14)}
        <div style={{ height: 118, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
    </div>
  );
}

function renderTools(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {bar("32%", 20)}
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 12 }}>
        {bar("42%", 16)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} style={{ height: 74, borderRadius: 14, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
        <div style={{ height: 46, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ height: 56, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
        ))}
      </div>
    </div>
  );
}

function renderCommunity(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {bar("44%", 20)}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ height: 96, borderRadius: 14, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
        ))}
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 10 }}>
            {bar("70%", 14)}
            {bar("90%", 10)}
            <div style={{ height: 60, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.08}s` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function renderCertificates(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {bar("48%", 20)}
        <div style={{ width: 220, height: 34, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ width: 80, height: 24, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
              <div style={{ width: 56, height: 16, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
            </div>
            {bar("74%", 18)}
            {bar("58%", 10)}
            <div style={{ height: 36, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", marginTop: 8, animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.16}s` }} />
          </div>
        ))}
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 10 }}>
        {bar("28%", 14)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ height: 44, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderMentor(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) 320px", gap: 16, minHeight: "calc(100vh - 80px)" }}>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "grid", gap: 12 }}>
        {bar("36%", 18)}
        <div style={{ height: 280, borderRadius: 16, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
        <div style={{ height: 52, borderRadius: 12, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.16s" }} />
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {bar("54%", 16)}
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ height: 34, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function renderProfile(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {bar("45%", 34)}
        <div style={{ width: 160, height: 38, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.shadow, display: "grid", gap: 12 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} style={{ height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s` }} />
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, minHeight: 180, display: "grid", gap: 12 }}>
            {bar("38%", 14)}
            {Array.from({ length: 4 }).map((__, row) => (
              <div key={row} style={{ height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${row * 0.05 + index * 0.04}s` }} />
            ))}
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
        {bar("38%", 30)}
        <div style={{ width: 138, height: 40, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow, display: "grid", gap: 10 }}>
          {bar("28%", 12)}
          {bar("72%", 26)}
          {bar("58%", 10)}
          <div style={{ height: 6, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
        </div>
      ))}
    </div>
  );
}

function renderLibrary(T: LoadingCanvasTheme, shimmer: string) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {bar("36%", 30)}
        <div style={{ width: 170, height: 40, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: "fixeth-shimmer 1.3s ease-in-out infinite 0.08s" }} />
      </div>
      <div style={{ background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 16, padding: 18, boxShadow: T.shadow }}>
        {bar("32%", 13)}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14, marginTop: 16 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} style={{ minHeight: 168, borderRadius: 14, border: `1px solid ${T.border}`, background: T.bg2, padding: 16, display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05}s` }} />
                <div style={{ width: 68, height: 20, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.04}s` }} />
              </div>
              {bar("78%", 18)}
              {bar("60%", 12)}
              <div style={{ marginTop: "auto", width: 96, height: 36, borderRadius: 10, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.05 + 0.16}s` }} />
            </div>
          ))}
        </div>
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
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} style={{ height: 12, borderRadius: 999, background: shimmer, backgroundSize: "400% 100%", animation: `fixeth-shimmer 1.3s ease-in-out infinite ${index * 0.06}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}