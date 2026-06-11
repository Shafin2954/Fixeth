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
    setAiMsgs,
    activeTrackTier
  } = useCourse();
  const effectiveUiTier = activeTrackTier ?? uiTier;

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(290);
  const [isResizing, setIsResizing] = useState(false);

  // Mobile: collapse the in-flow sidebars into an off-canvas drawer so the
  // workspace shell never forces horizontal scroll on a phone viewport.
  const [isMobile, setIsMobile] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Close the drawer whenever we leave the mobile breakpoint.
  useEffect(() => {
    if (!isMobile) setMobileDrawerOpen(false);
  }, [isMobile]);

  const showLeftSidebar = ["/learn", "/quiz"].some((p) => pathname.startsWith(p));

  const showAiSidebar =
    !isMobile &&
    effectiveUiTier >= 2 &&
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

  const courseExplorer = (
    <CourseExplorerSidebar
      T={T}
      t={t}
      modules={modules}
      openMods={openMods}
      setOpenMods={setOpenMods}
      activeLessonId={activeLessonId}
      setActiveLessonId={(id: string) => {
        setActiveLessonId(id);
        if (isMobile) setMobileDrawerOpen(false);
      }}
      onPrevious={handlePreviousLesson}
      onNext={handleNextLesson}
      isCollapsed={isMobile ? false : sidebarCollapsed}
      onToggleCollapse={() =>
        isMobile ? setMobileDrawerOpen(false) : setSidebarCollapsed(true)
      }
    />
  );

  return (
    <>
      {showLeftSidebar && isMobile ? (
        <>
          {/* Edge toggle to reveal the lesson list on mobile. */}
          {!mobileDrawerOpen && (
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              title={lang === "bn" ? "পাঠ তালিকা" : "Lesson list"}
              style={{
                position: "fixed",
                left: 0,
                top: "42%",
                transform: "translateY(-50%)",
                background: T.accent,
                border: `1px solid ${T.border}`,
                borderRadius: "0 8px 8px 0",
                padding: "16px 8px",
                color: "#000000",
                cursor: "pointer",
                fontWeight: 900,
                fontSize: 10.5,
                zIndex: 55,
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
              ☰ {lang === "bn" ? "পাঠসমূহ" : "Lessons"}
            </button>
          )}

          {/* Backdrop */}
          {mobileDrawerOpen && (
            <div
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                zIndex: 60
              }}
            />
          )}

          {/* Off-canvas drawer */}
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 61,
              transform: mobileDrawerOpen ? "translateX(0)" : "translateX(-100%)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: mobileDrawerOpen ? T.shadow : "none"
            }}
          >
            {courseExplorer}
          </div>
        </>
      ) : showLeftSidebar ? (
        <>
          {courseExplorer}

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
              <span style={{ fontSize: 13, color: T.accent }}>▶</span>
            </button>
          )}
        </>
      ) : null}

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
          activeLessonId={activeLessonId}
        />
      )}
    </>
  );
}
