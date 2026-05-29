"use client";

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

type NavItem = {
  id: string;
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  match: (path: string) => boolean;
};

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
    setProfileOpen
  } = useAppTheme();
  const { activeModule, activeLesson, learnHref } = useCourse();

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
            height: density.topBarHeight,
            background: T.navBg,
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 12,
            flexShrink: 0,
            boxShadow: T.shadow,
            zIndex: 10
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/logo.svg"
              alt="Fixeth Logo"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                objectFit: "contain"
              }}
            />
            <span style={{ fontSize: 15, fontWeight: 950, color: T.txt0, letterSpacing: -0.5 }}>
              {t.brand}
            </span>
            <span style={{ fontSize: 10, color: T.accent, fontStyle: "italic", fontWeight: 700 }}>
              {t.tagline}
            </span>
          </div>

          <div style={{ width: 1, height: 16, background: T.border, margin: "0 4px" }} />

          <span style={{ fontSize: 11, color: T.txt1, fontWeight: 700 }}>
            {lang === "bn" ? "আইটি প্লেসমেন্ট কারিকুলাম" : "Professional Syllabus"}
          </span>
          <span style={{ color: T.txt2, fontSize: 10 }}>›</span>
          <span style={{ fontSize: 11, color: T.txt0, fontWeight: 600 }}>
            {lang === "bn" ? `মডিউল ${activeModule?.id ?? 1}` : `Module ${activeModule?.id ?? 1}`}
          </span>
          <span style={{ color: T.txt2, fontSize: 10 }}>›</span>
          <span style={{ fontSize: 11, color: T.txt0, fontWeight: 600 }}>
            {activeLesson?.title ?? (lang === "bn" ? "লেসন নির্বাচন করুন" : "Select a lesson")}
          </span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
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
                    padding: "2px 8px",
                    fontSize: 8.5,
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

            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              style={{
                background: T.bg3,
                border: `1px solid ${T.border}`,
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 10.5,
                fontWeight: 700,
                color: T.txt0,
                cursor: "pointer"
              }}
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>

            <div style={{ position: "relative" }}>
              <div
                onClick={() => setProfileOpen((s) => !s)}
                title={user.name}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: T.accent,
                  color: "#000",
                  fontSize: 11,
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
                    top: 34,
                    background: T.bg1,
                    border: `1px solid ${T.border}`,
                    borderRadius: 8,
                    padding: 8,
                    minWidth: 180,
                    boxShadow: T.shadow,
                    zIndex: 200
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: T.txt0, padding: "6px 8px" }}>
                    {user.name}
                  </div>
                  <div style={{ height: 1, background: T.border, margin: "6px 0" }} />
                  <Link
                    href="/settings/profile?tab=profile"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 12
                    }}
                  >
                    {t.profileView}
                  </Link>
                  <Link
                    href="/settings/profile?tab=account"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 12
                    }}
                  >
                    {t.profileSettings}
                  </Link>
                  <Link
                    href="/settings/profile?tab=preferences"
                    onClick={() => setProfileOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px",
                      color: T.txt1,
                      textDecoration: "none",
                      fontSize: 12
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
          height: density.bottomBarHeight,
          background: T.navBg,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          flexShrink: 0,
          padding: "0 6px",
          zIndex: 10
        }}
      >
        {NAVIGATION_ITEMS.map((item) => {
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
                gap: 1.5,
                padding: density.navPadding,
                borderRadius: 8,
                background: isActive ? T.accentDim : "none",
                border: `1.5px solid ${isActive ? T.accent + "3c" : "transparent"}`,
                cursor: "pointer",
                minWidth: 68,
                textDecoration: "none",
                outline: "none"
              }}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.2 : 1.9} color={isActive ? T.accent : T.txt1} />
              <span
                style={{
                  fontSize: 8,
                  fontWeight: isActive ? 800 : 500,
                  color: isActive ? T.accent : T.txt1,
                  whiteSpace: "nowrap"
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
