"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type PublicLang = "en" | "bn";

type PublicPrefsValue = {
  lang: PublicLang;
  setLang: (lang: PublicLang) => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
};

const PublicPrefsContext = createContext<PublicPrefsValue | null>(null);

export function usePublicPrefs() {
  const ctx = useContext(PublicPrefsContext);
  if (!ctx) throw new Error("usePublicPrefs must be used within PublicPrefsProvider");
  return ctx;
}

/**
 * Lang + theme state for the public (logged-out) pages. Shares the same
 * localStorage keys as the in-app AppThemeProvider so the choice carries
 * over seamlessly once the visitor signs up and lands in the app.
 */
export function PublicPrefsProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<PublicLang>("en");
  const [isDark, setIsDark] = useState(true);

  // Read persisted values after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const rawLang = localStorage.getItem("fixeth.lang");
      if (rawLang === "en" || rawLang === "bn") setLang(rawLang);
      const rawTheme = localStorage.getItem("fixeth.isDark");
      if (rawTheme === "true" || rawTheme === "false") setIsDark(rawTheme === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("fixeth.lang", lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem("fixeth.isDark", String(isDark));
    } catch {
      // ignore
    }
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <PublicPrefsContext.Provider value={{ lang, setLang, isDark, setIsDark }}>
      {children}
    </PublicPrefsContext.Provider>
  );
}
