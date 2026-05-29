"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CourseExplorerSidebar, AIChatSidebar } from "@/components/layout/sidebar";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { T, t, lang, preferences, uiTier } = useAppTheme();
  const {
    modules,
    openMods,
    setOpenMods,
    activeLessonId,
    setActiveLessonId,
    handlePreviousLesson,
    handleNextLesson,
    aiMsgs,
    setAiMsgs
  } = useCourse();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(290);
  const [isResizing, setIsResizing] = useState(false);

  const showAiSidebar =
    uiTier >= 2 &&
    preferences.contentVisibility.showMentor &&
    ["/learn", "/notebook", "/quiz"].some((p) => pathname.startsWith(p));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 160 && newWidth < 550) {
        setRightSidebarWidth(newWidth);
      } else if (newWidth <= 160) {
        setRightSidebarWidth(0);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <>
      <CourseExplorerSidebar
        T={T}
        t={t}
        modules={modules}
        openMods={openMods}
        setOpenMods={setOpenMods}
        activeLessonId={activeLessonId}
        setActiveLessonId={setActiveLessonId}
        onPrevious={handlePreviousLesson}
        onNext={handleNextLesson}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(true)}
      />

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          title="Expand sidebar"
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            zIndex: 50,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: T.bg2,
            border: `1px solid ${T.border}`,
            color: T.accent,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: T.shadow,
            outline: "none"
          }}
        >
          <span style={{ fontSize: 13, color: T.accent }}>
            ▶
          </span>
        </button>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        {children}
      </div>

      {showAiSidebar && rightSidebarWidth > 0 && (
        <div
          onMouseDown={() => setIsResizing(true)}
          style={{
            width: 4,
            cursor: "col-resize",
            background: isResizing ? T.accent : "transparent",
            borderLeft: `1px solid ${T.border}`,
            borderRight: `1px solid ${T.border}`,
            transition: "background 0.15s ease",
            alignSelf: "stretch",
            zIndex: 40
          }}
          title="Drag left/right to resize AI Mentor sidebar"
        />
      )}

      {showAiSidebar && rightSidebarWidth === 0 && (
        <button
          type="button"
          onClick={() => setRightSidebarWidth(290)}
          title="Expand AI Mentor Sidebar"
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            background: T.accent,
            border: `1px solid ${T.border}`,
            borderRadius: "8px 0 0 8px",
            padding: "16px 8px",
            color: "#000000",
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 10.5,
            zIndex: 100,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            boxShadow: T.shadow,
            outline: "none"
          }}
        >
          ✦ Expand AI Mentor
        </button>
      )}

      {showAiSidebar && (
        <AIChatSidebar
          T={T}
          t={t}
          msgs={aiMsgs}
          setMsgs={setAiMsgs}
          lang={lang}
          width={rightSidebarWidth}
        />
      )}
    </>
  );
}
