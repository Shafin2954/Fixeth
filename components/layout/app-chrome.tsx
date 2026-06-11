"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Bot,
  Clapperboard,
  Code2,
  House,
  Menu,
  NotebookPen,
  ClipboardList,
  Upload,
  UsersRound,
  X
} from "lucide-react";
import { useAppTheme } from "@/components/providers/app-theme-provider";
import { useCourse } from "@/components/providers/course-provider";
import { themeVars } from "@/lib/ui/theme-vars";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
      id: "jobs",
      href: "/jobs",
      label: t.jobs,
      icon: Briefcase,
      match: (p) => p === "/jobs"
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

  const allowedItems = NAVIGATION_ITEMS.filter((item) =>
    tierAllowsScreen(effectiveUiTier, item.id as NavScreenId)
  );
  // On mobile the bottom bar keeps the 4 primary destinations; everything
  // else lives in the hamburger drawer.
  const mobilePrimaryItems = allowedItems.slice(0, 4);

  const langToggle = (
    <div className="flex overflow-hidden rounded-md border border-[var(--t-border)] bg-[var(--t-bg3)] p-[1.5px]">
      {[
        ["en", "EN"],
        ["bn", "বাংলা"]
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => setLang(id)}
          className={`cursor-pointer rounded border-none px-2.5 py-1 text-[11px] font-bold ${
            lang === id ? "bg-[var(--t-accent)] text-black" : "bg-transparent text-[var(--t-txt1)]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const darkToggle = (
    <button
      type="button"
      onClick={() => setIsDark(!isDark)}
      className="cursor-pointer rounded-md border border-[var(--t-border)] bg-[var(--t-bg3)] px-3 py-1.5 text-xs font-bold text-[var(--t-txt0)]"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );

  return (
    <div
      style={{
        ...themeVars(T),
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif"
      }}
      className="flex h-screen flex-col overflow-hidden bg-[var(--t-bg0)] text-[var(--t-txt0)]"
    >
      {isDashboard && (
        <div
          style={!isMobile ? { height: density.topBarHeight, minHeight: density.topBarHeight } : undefined}
          className="z-10 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--t-border)] bg-[var(--t-nav-bg)] p-3 shadow-[var(--t-shadow)] lg:flex-nowrap lg:justify-start lg:gap-3 lg:px-4 lg:py-0"
        >
          <div className="flex flex-1 items-center gap-2.5 lg:flex-none">
            <img
              src="/logo.svg"
              alt="Fixeth Logo"
              className="size-7 rounded-md object-contain lg:size-8"
            />
            <div className="flex flex-col gap-0.5 lg:gap-0">
              <span className="text-base font-black tracking-tight text-[var(--t-txt0)] lg:text-lg">
                {t.brand}
              </span>
              <span className="text-[11px] font-bold italic text-[var(--t-accent)] lg:text-xs">
                {t.tagline}
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="mx-1 h-4 w-px bg-[var(--t-border)]" />

            <span className="text-[13px] font-bold text-[var(--t-txt1)]">
              {lang === "bn" ? "আইটি প্লেসমেন্ট কারিকুলাম" : "Professional Syllabus"}
            </span>
            <span className="text-xs text-[var(--t-txt2)]">›</span>
            <span className="text-[13px] font-semibold text-[var(--t-txt0)]">
              {activeModule?.title ?? (lang === "bn" ? "মডিউল" : "Module")}
            </span>
            <span className="text-xs text-[var(--t-txt2)]">›</span>
            <span className="text-[13px] font-semibold text-[var(--t-txt0)]">
              {activeLesson?.title ?? (lang === "bn" ? "লেসন নির্বাচন করুন" : "Select a lesson")}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:gap-2">
            <div className="hidden lg:block">{langToggle}</div>
            <div className="hidden lg:block">{darkToggle}</div>

            <div className="relative">
              <div
                onClick={() => setProfileOpen((s) => !s)}
                title={user.name}
                className="flex size-8 cursor-pointer select-none items-center justify-center rounded-full bg-[var(--t-accent)] text-[13px] font-black text-black lg:size-9 lg:text-sm"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {profileOpen && (
                <div className="absolute right-0 top-10 z-[200] min-w-[200px] rounded-lg border border-[var(--t-border)] bg-[var(--t-bg1)] p-2.5 shadow-[var(--t-shadow)] lg:top-11">
                  <div className="px-2.5 py-2 text-sm font-extrabold text-[var(--t-txt0)]">
                    {user.name}
                  </div>
                  <div className="my-2 h-px bg-[var(--t-border)]" />
                  <Link
                    href="/settings/profile?tab=profile"
                    onClick={() => setProfileOpen(false)}
                    className="block p-2.5 text-[13px] text-[var(--t-txt1)] no-underline"
                  >
                    {t.profileView}
                  </Link>
                  <Link
                    href="/settings/profile?tab=account"
                    onClick={() => setProfileOpen(false)}
                    className="block p-2.5 text-[13px] text-[var(--t-txt1)] no-underline"
                  >
                    {t.profileSettings}
                  </Link>
                  <Link
                    href="/settings/profile?tab=preferences"
                    onClick={() => setProfileOpen(false)}
                    className="block p-2.5 text-[13px] text-[var(--t-txt1)] no-underline"
                  >
                    {t.profilePreferences}
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setProfileOpen(false)}
                    className="block p-2.5 text-[13px] text-[var(--t-txt1)] no-underline"
                  >
                    {lang === "bn" ? "আমাদের সম্পর্কে" : "About"}
                  </Link>
                  <ProfileSignOutButton />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative flex min-h-0 flex-1">{children}</div>

      {/* Bottom navigation */}
      <div
        style={!isMobile ? { height: density.bottomBarHeight, minHeight: density.bottomBarHeight } : undefined}
        className="z-10 flex min-h-16 shrink-0 items-center justify-around border-t border-[var(--t-border)] bg-[var(--t-nav-bg)] lg:min-h-0 lg:justify-center lg:gap-0.5 lg:px-1.5"
      >
        {(isMobile ? mobilePrimaryItems : allowedItems).map((item) => {
          const isActive = item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              style={!isMobile ? { padding: density.navPadding } : undefined}
              className={`flex min-w-[64px] cursor-pointer flex-col items-center justify-center gap-[3px] rounded-lg border-[1.5px] px-3 py-2 no-underline outline-none lg:min-w-[68px] lg:gap-0.5 ${
                isActive
                  ? "border-[var(--t-accent)]/25 bg-[var(--t-accent-dim)]"
                  : "border-transparent bg-transparent"
              }`}
            >
              <item.icon
                size={isMobile ? 22 : 18}
                strokeWidth={isActive ? 2.2 : 1.9}
                color={isActive ? T.accent : T.txt1}
              />
              <span
                className={`whitespace-nowrap text-center ${
                  isActive ? "font-extrabold text-[var(--t-accent)]" : "font-medium text-[var(--t-txt1)]"
                } ${largeNav ? "text-[11px] lg:text-[10px]" : "text-[10px] lg:text-[8px]"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Mobile-only hamburger opens the full nav drawer */}
        {isMobile && (
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={lang === "bn" ? "মেনু খুলুন" : "Open menu"}
            className="flex min-w-[64px] cursor-pointer flex-col items-center justify-center gap-[3px] rounded-lg border-[1.5px] border-transparent bg-transparent px-3 py-2 outline-none"
          >
            <Menu size={22} strokeWidth={1.9} color={T.txt1} />
            <span className={`whitespace-nowrap font-medium text-[var(--t-txt1)] ${largeNav ? "text-[11px]" : "text-[10px]"}`}>
              {lang === "bn" ? "মেনু" : "Menu"}
            </span>
          </button>
        )}
      </div>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="drawer-overlay"
              className="fixed inset-0 z-40 bg-black/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              key="drawer-panel"
              className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-[var(--t-border)] bg-[var(--t-nav-bg)]"
              style={themeVars(T)}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 360 }}
            >
              <div className="flex items-center justify-between border-b border-[var(--t-border)] px-4 py-3.5">
                <div className="flex items-center gap-2.5">
                  <img src="/logo.svg" alt="Fixeth Logo" className="size-7 rounded-md object-contain" />
                  <span className="text-base font-black tracking-tight text-[var(--t-txt0)]">{t.brand}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label={lang === "bn" ? "মেনু বন্ধ করুন" : "Close menu"}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-[var(--t-border)] bg-[var(--t-bg2)] outline-none"
                >
                  <X size={18} color={T.txt1} />
                </button>
              </div>

              <nav className="min-h-0 flex-1 overflow-y-auto p-3">
                {allowedItems.map((item) => {
                  const isActive = item.match(pathname);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`mb-1 flex min-h-11 items-center gap-3 rounded-lg border px-3 py-2.5 no-underline ${
                        isActive
                          ? "border-[var(--t-accent)]/25 bg-[var(--t-accent-dim)]"
                          : "border-transparent bg-transparent"
                      }`}
                    >
                      <item.icon
                        size={19}
                        strokeWidth={isActive ? 2.2 : 1.9}
                        color={isActive ? T.accent : T.txt1}
                      />
                      <span
                        className={`text-[13px] ${
                          isActive ? "font-extrabold text-[var(--t-accent)]" : "font-medium text-[var(--t-txt1)]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="flex items-center justify-between gap-3 border-t border-[var(--t-border)] px-4 py-3.5">
                {langToggle}
                {darkToggle}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
      className="block w-full cursor-pointer border-none bg-transparent p-2 text-left text-xs font-extrabold text-[var(--t-red)]"
    >
      {t.profileSignOut}
    </button>
  );
}
