"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  Award,
  Bot,
  Clapperboard,
  Code2,
  House,
  NotebookPen,
  ClipboardList,
  Upload,
  UsersRound,
  Wrench
} from "lucide-react";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";
import { tierAllowsScreen, tierUsesLargeText, type NavScreenId } from "@/lib/tier/config";

type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  match: (path: string) => boolean;
};

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const {
    T,
    t,
    lang,
    setLang,
    isDark,
    setIsDark,
    user,
    density,
    preferences,
    profileOpen,
    setProfileOpen,
    uiTier
  } = useAppTheme();
  const { activeModule, activeLesson, learnHref, activeTrackTier } = useCourse();
  const effectiveUiTier = activeTrackTier ?? uiTier;
  const largeNav = tierUsesLargeText(effectiveUiTier);

  const isDashboard = pathname === "/dashboard";

  const NAVIGATION_ITEMS: NavItem[] = [
    {
      id: "dashboard",
      href: "/dashboard",
      label: t.dashboard,
      icon: House,
      match: (p) => p === "/dashboard"
    },
    {
      id: "video",
      href: learnHref,
      label: t.guidedVideo,
      icon: Clapperboard,
      match: (p) => p.startsWith("/learn")
    },
    {
      id: "notebook",
      href: "/notebook",
      label: t.notebook,
      icon: NotebookPen,
      match: (p) => p === "/notebook"
    },
    {
      id: "quiz",
      href: "/quiz",
      label: t.quizAssign,
      icon: ClipboardList,
      match: (p) => p === "/quiz"
    },
    {
      id: "submissions",
      href: "/submissions",
      label: t.submissions,
      icon: Upload,
      match: (p) => p === "/submissions"
    },
    {
      id: "codespace",
      href: "/codespace",
      label: t.codeSpace,
      icon: Code2,
      match: (p) => p === "/codespace"
    },
    {
      id: "tools",
      href: "/tools",
      label: t.tools,
      icon: Wrench,
      match: (p) => p === "/tools"
    },
    // Tier visibility for these is handled by tierAllowsScreen below; here we
    // only respect the user's content-visibility preferences.
    ...(preferences.contentVisibility.showMentor
      ? [
          {
            id: "mentor",
            href: "/mentor",
            label: t.aiMentor,
            icon: Bot,
            match: (p: string) => p === "/mentor"
          }
        ]
      : []),
    ...(preferences.contentVisibility.showCommunity
      ? [
          {
            id: "community",
            href: "/community",
            label: t.community,
            icon: UsersRound,
            match: (p: string) => p === "/community"
          }
        ]
      : []),
    ...(preferences.contentVisibility.showCertificates
      ? [
          {
            id: "certs",
            href: "/certificates",
            label: t.certs,
            icon: Award,
            match: (p: string) => p === "/certificates"
          }
        ]
      : [])
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: T.bg0,
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        color: T.txt0,
        overflow: "hidden"
      }}
    >
      {isDashboard && (
        <div
          style={{
            height: isMobile ? "auto" : density.topBarHeight,
            background: T.navBg,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            padding: isMobile ? "12px" : "0 16px",
            gap: isMobile ? 8 : 12,
            flexShrink: 0,
            boxShadow: T.shadow,
            zIndex: 10,
            flexWrap: isMobile ? "wrap" : "nowrap",
            justifyContent: isMobile ? "space-between" : "flex-start",
            minHeight: isMobile ? "auto" : density.topBarHeight
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: isMobile ? "1 1 auto" : "0 0 auto" }}>
            <img
              src="/logo.svg"
              alt="Fixeth Logo"
              style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: 6,
                objectFit: "contain"
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 2 : 0 }}>
              <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 950, color: T.txt0, letterSpacing: -0.5 }}>
                {t.brand}
              </span>
              <span style={{ fontSize: isMobile ? 11 : 12, color: T.accent, fontStyle: "italic", fontWeight: 700 }}>
                {t.tagline}
              </span>
            </div>
          </div>

          {!isMobile && (
            <>
              <div style={{ width: 1, height: 16, background: T.border, margin: "0 4px" }} />

              <span style={{ fontSize: 13, color: T.txt1, fontWeight: 700 }}>
                {lang === "bn" ? "আইটি প্লেসমেন্ট কারিকুলাম" : "Professional Syllabus"}
              </span>
              <span style={{ color: T.txt2, fontSize: 12 }}>›</span>
              <span style={{ fontSize: 13, color: T.txt0, fontWeight: 600 }}>
                {lang === "bn" ? `মডিউল ${activeModule?.id ?? 1}` : `Module ${activeModule?.id ?? 1}`}
              </span>
              <span style={{ color: T.txt2, fontSize: 12 }}>›</span>
              <span style={{ fontSize: 13, color: T.txt0, fontWeight: 600 }}>
                {activeLesson?.title ?? (lang === "bn" ? "লেসন নির্বাচন করুন" : "Select a lesson")}
              </span>
            </>
          )}

          <div style={{ marginLeft: isMobile ? "auto" : "auto", display: "flex", gap: isMobile ? 6 : 8, alignItems: "center" }}>
            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  background: T.bg3,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: `1px solid ${T.border}`,
                  padding: 1.5
                }}
              >
                {[
                  ["en", "EN"],
                  ["bn", "বাংলা"]
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLang(id)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      background: lang === id ? T.accent : "none",
                      color: lang === id ? "#000" : T.txt1,
                      border: "none",
                      cursor: "pointer",
                      borderRadius: 4
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}

            {!isMobile && (
              <button
                type="button"
                onClick={() => setIsDark(!isDark)}
                style={{
                  background: T.bg3,
                  border: `1px solid ${T.border}`,
                  borderRadius: 6,
                  padding: "6px 12px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: T.txt0,
                  cursor: "pointer"
                }}
              >
                {isDark ? "☀️ Light" : "🌙 Dark"}
              </button>
            )}

            <div style={{ position: "relative" }}>
              <div
                onClick={() => setProfileOpen((s) => !s)}
                title={user.name}
                style={{
                  width: isMobile ? 32 : 36,
                  height: isMobile ? 32 : 36,
                  borderRadius: "50%",
                  background: T.accent,
                  color: "#000",
                  fontSize: isMobile ? 13 : 14,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: isMobile ? 40 : 44,
                    background: T.bg1,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: 10,
                    minWidth: 200,
                    boxShadow: T.shadow,
                    zIndex: 200
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 800, color: T.txt0, padding: "8px 10px" }}>
                    {user.name}
                  </div>
                  <div style={{ height: 1, background: T.border, margin: "8px 0" }} />
                  <Link
                    href="/settings/profile?tab=profile"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 13
                    }}
                  >
                    {t.profileView}
                  </Link>
                  <Link
                    href="/settings/profile?tab=account"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 13
                    }}
                  >
                    {t.profileSettings}
                  </Link>
                  <Link
                    href="/settings/profile?tab=preferences"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "10px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 13
                    }}
                  >
                    {t.profilePreferences}
                  </Link>
                  <ProfileSignOutButton />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>{children}</div>

      <div
        style={{
          height: isMobile ? "auto" : density.bottomBarHeight,
          background: T.navBg,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "flex-start" : "center",
          gap: isMobile ? 0 : 2,
          flexShrink: 0,
          padding: isMobile ? "0" : "0 6px",
          zIndex: 10,
          overflowX: isMobile ? "auto" : "visible",
          overflowY: "hidden",
          minHeight: isMobile ? "70px" : density.bottomBarHeight
        }}
      >
        {NAVIGATION_ITEMS.filter((item) =>
          tierAllowsScreen(effectiveUiTier, item.id as NavScreenId)
        ).map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? 3 : 2,
                padding: isMobile ? "12px 16px" : density.navPadding,
                borderRadius: 8,
                background: isActive ? T.accentDim : "none",
                border: `1.5px solid ${isActive ? T.accent + "3c" : "transparent"}`,
                cursor: "pointer",
                minWidth: isMobile ? "70px" : "68px",
                textDecoration: "none",
                outline: "none",
                flex: isMobile ? "0 0 auto" : "none"
              }}
            >
              <item.icon 
                size={isMobile ? 22 : 18} 
                strokeWidth={isActive ? 2.2 : 1.9} 
                color={isActive ? T.accent : T.txt1} 
              />
              <span
                style={{
                  fontSize: largeNav ? (isMobile ? 11 : 10) : isMobile ? 10 : 8,
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? T.accent : T.txt1,
                  whiteSpace: "nowrap",
                  textAlign: "center"
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ProfileSignOutButton() {
  const { T, t, signOut, setProfileOpen } = useAppTheme();

  return (
    <button
      type="button"
      onClick={async () => {
        setProfileOpen(false);
        await signOut();
      }}
      style={{
        display: "block",
        width: "100%",
        padding: "8px",
        background: "none",
        border: "none",
        textAlign: "left",
        color: T.red,
        cursor: "pointer",
        fontWeight: 800,
        fontSize: 12
      }}
    >
      {t.profileSignOut}
    </button>
  );
}
