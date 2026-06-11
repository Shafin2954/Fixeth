"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { themes, type ThemeTokens } from "@/lib/ui/themes";
import { i18n } from "@/lib/i18n/messages";
import {
  type OnboardingPayload,
  type UserProfileRow,
  syncUserPreferences,
  syncUserProfile,
  toAppUser
} from "@/lib/supabase/queries/profile";
import { normalizeUiTier, type UiTier } from "@/lib/tier/config";
import type { UserPreferences, UserProfile } from "@/types/ui";

export type { UserPreferences, UserProfile };
export type AppUserProfile = UserProfile;

// Real Google Gemini model ids we expose, plus the local Ollama option.
const VALID_AI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "ollama"
] as const;

// Migrate any legacy friendly ids stored before we used real model names.
const LEGACY_AI_MODELS: Record<string, UserPreferences["ai"]["model"]> = {
  "gemini-flash": "gemini-2.5-flash",
  "gemini-pro": "gemini-2.5-pro",
  "gemini-1.5": "gemini-1.5-pro"
};

function normalizeAiModel(raw: unknown): UserPreferences["ai"]["model"] {
  const value = String(raw ?? "");
  if (LEGACY_AI_MODELS[value]) return LEGACY_AI_MODELS[value];
  if ((VALID_AI_MODELS as readonly string[]).includes(value)) {
    return value as UserPreferences["ai"]["model"];
  }
  return "gemini-2.5-flash";
}

const DEFAULT_USER: AppUserProfile = {
  name: "Learner",
  email: "",
  title: "Learner",
  location: "Dhaka, Bangladesh",
  bio: "Focused on practical, job-ready engineering skills.",
  division: "Dhaka",
  jobFocus: "job",
  certificateName: "",
  publicPortfolio: true
};

const DEFAULT_PREFERENCES: UserPreferences = {
  layoutDensity: "comfortable",
  colorPreset: "mint",
  accentColor: "#00C896",
  mentorTone: "balanced",
  weeklyGoal: 4,
  contentVisibility: {
    showCommunity: true,
    showCertificates: true,
    showMentor: true,
    showPortfolio: true
  },
  dataPreferences: {
    allowTelemetry: true,
    allowPersonalization: true,
    autoSaveProgress: true,
    downloadFormat: "json"
  },
  dataSaver: false,
  editor: {
    theme: "one-dark",
    fontSize: 12,
    lineWrapping: true,
    indentSize: 4,
    keymap: "standard"
  },
  ai: {
    apiKey: "",
    model: "gemini-2.5-flash",
    ollamaUrl: "http://localhost:11434",
    ollamaModel: "gemma:2b",
    persona: "bengali",
    defaultCognitiveLevel: "Student"
  }
};

const ACCENT_PRESETS: Record<UserPreferences["colorPreset"], string> = {
  mint: "#00C896",
  ocean: "#3AA0FF",
  sunset: "#FF8A3D",
  rose: "#FF5B8A"
};

export function normalizePreferences(raw: unknown): UserPreferences {
  const src = raw && typeof raw === "object" ? (raw as Partial<UserPreferences>) : {};
  const srcVisibility =
    src.contentVisibility && typeof src.contentVisibility === "object"
      ? src.contentVisibility
      : DEFAULT_PREFERENCES.contentVisibility;
  const srcDataPrefs =
    src.dataPreferences && typeof src.dataPreferences === "object"
      ? src.dataPreferences
      : DEFAULT_PREFERENCES.dataPreferences;
  const srcEditor =
    src.editor && typeof src.editor === "object" ? src.editor : DEFAULT_PREFERENCES.editor;
  const srcAi = src.ai && typeof src.ai === "object" ? src.ai : DEFAULT_PREFERENCES.ai;

  const layoutDensity = ["compact", "comfortable", "spacious"].includes(String(src.layoutDensity))
    ? (src.layoutDensity as UserPreferences["layoutDensity"])
    : DEFAULT_PREFERENCES.layoutDensity;
  const colorPreset = ["mint", "ocean", "sunset", "rose"].includes(String(src.colorPreset))
    ? (src.colorPreset as UserPreferences["colorPreset"])
    : DEFAULT_PREFERENCES.colorPreset;
  const mentorTone = ["concise", "balanced", "deep"].includes(String(src.mentorTone))
    ? (src.mentorTone as UserPreferences["mentorTone"])
    : DEFAULT_PREFERENCES.mentorTone;
  const weeklyGoal = Number.isFinite(src.weeklyGoal)
    ? Math.min(10, Math.max(1, Number(src.weeklyGoal)))
    : DEFAULT_PREFERENCES.weeklyGoal;
  const accentColor =
    typeof src.accentColor === "string" && /^#[0-9a-fA-F]{6}$/.test(src.accentColor)
      ? src.accentColor
      : ACCENT_PRESETS[colorPreset];

  return {
    layoutDensity,
    colorPreset,
    accentColor,
    mentorTone,
    weeklyGoal,
    contentVisibility: {
      showCommunity:
        srcVisibility.showCommunity ?? DEFAULT_PREFERENCES.contentVisibility.showCommunity,
      showCertificates:
        srcVisibility.showCertificates ?? DEFAULT_PREFERENCES.contentVisibility.showCertificates,
      showMentor: srcVisibility.showMentor ?? DEFAULT_PREFERENCES.contentVisibility.showMentor,
      showPortfolio:
        srcVisibility.showPortfolio ?? DEFAULT_PREFERENCES.contentVisibility.showPortfolio
    },
    dataPreferences: {
      allowTelemetry:
        srcDataPrefs.allowTelemetry ?? DEFAULT_PREFERENCES.dataPreferences.allowTelemetry,
      allowPersonalization:
        srcDataPrefs.allowPersonalization ??
        DEFAULT_PREFERENCES.dataPreferences.allowPersonalization,
      autoSaveProgress:
        srcDataPrefs.autoSaveProgress ?? DEFAULT_PREFERENCES.dataPreferences.autoSaveProgress,
      downloadFormat: srcDataPrefs.downloadFormat === "csv" ? "csv" : "json"
    },
    dataSaver: src.dataSaver ?? DEFAULT_PREFERENCES.dataSaver,
    editor: {
      theme: ["monokai", "one-dark", "solarized", "vibrant", "github-light"].includes(
        String(srcEditor.theme)
      )
        ? (srcEditor.theme as UserPreferences["editor"]["theme"])
        : DEFAULT_PREFERENCES.editor.theme,
      fontSize: Number.isFinite(srcEditor.fontSize)
        ? Math.min(18, Math.max(11, Number(srcEditor.fontSize)))
        : DEFAULT_PREFERENCES.editor.fontSize,
      lineWrapping: srcEditor.lineWrapping ?? DEFAULT_PREFERENCES.editor.lineWrapping,
      indentSize: [2, 4].includes(Number(srcEditor.indentSize))
        ? (Number(srcEditor.indentSize) as 2 | 4)
        : DEFAULT_PREFERENCES.editor.indentSize,
      keymap: ["standard", "vim", "emacs"].includes(String(srcEditor.keymap))
        ? (srcEditor.keymap as UserPreferences["editor"]["keymap"])
        : DEFAULT_PREFERENCES.editor.keymap
    },
    ai: {
      apiKey: typeof srcAi.apiKey === "string" ? srcAi.apiKey : DEFAULT_PREFERENCES.ai.apiKey,
      model: normalizeAiModel(srcAi.model),
      ollamaUrl:
        typeof srcAi.ollamaUrl === "string" ? srcAi.ollamaUrl : DEFAULT_PREFERENCES.ai.ollamaUrl,
      ollamaModel:
        typeof srcAi.ollamaModel === "string"
          ? srcAi.ollamaModel
          : DEFAULT_PREFERENCES.ai.ollamaModel,
      persona: ["socratic", "academic", "bengali", "rpg"].includes(String(srcAi.persona))
        ? (srcAi.persona as UserPreferences["ai"]["persona"])
        : DEFAULT_PREFERENCES.ai.persona,
      defaultCognitiveLevel: ["ELI5", "Student", "Pro", "Research"].includes(
        String(srcAi.defaultCognitiveLevel)
      )
        ? (srcAi.defaultCognitiveLevel as UserPreferences["ai"]["defaultCognitiveLevel"])
        : DEFAULT_PREFERENCES.ai.defaultCognitiveLevel
    }
  };
}

const toRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 6 ? normalized : "00C896";
  const r = parseInt(safe.slice(0, 2), 16);
  const g = parseInt(safe.slice(2, 4), 16);
  const b = parseInt(safe.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type AppThemeContextValue = {
  authUser: SupabaseUser;
  profileRow: UserProfileRow | null;
  uiTier: UiTier;
  user: AppUserProfile;
  setUser: React.Dispatch<React.SetStateAction<AppUserProfile>>;
  preferences: UserPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<UserPreferences>>;
  isDark: boolean;
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>;
  lang: string;
  setLang: React.Dispatch<React.SetStateAction<string>>;
  T: ThemeTokens & { accentHi: string; accentDim: string };
  t: Record<string, string>;
  density: { topBarHeight: number; bottomBarHeight: number; navPadding: string };
  profileOpen: boolean;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  syncUser: (next: AppUserProfile) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  DEFAULT_USER: AppUserProfile;
  DEFAULT_PREFERENCES: UserPreferences;
  normalizePreferences: (raw: unknown) => UserPreferences;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within AppThemeProvider");
  return ctx;
}

type AppThemeProviderProps = {
  authUser: SupabaseUser;
  initialProfile: UserProfileRow | null;
  refreshProfile: () => Promise<void>;
  onSignOut: () => Promise<void>;
  children: React.ReactNode;
};

export function AppThemeProvider({
  authUser,
  initialProfile,
  refreshProfile,
  onSignOut,
  children
}: AppThemeProviderProps) {
  const profileRow = initialProfile;
  const uiTier = normalizeUiTier(profileRow?.ui_tier);
  const [user, setUser] = useState<AppUserProfile>(() =>
    toAppUser(authUser, initialProfile)
  );
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const rawPrefs = localStorage.getItem("fixeth.userPreferences");
      return rawPrefs ? normalizePreferences(JSON.parse(rawPrefs)) : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return initialProfile?.preferred_theme !== "light";
    try {
      const rawTheme = localStorage.getItem("fixeth.isDark");
      if (rawTheme === "true" || rawTheme === "false") return rawTheme === "true";
    } catch {
      // ignore
    }
    return initialProfile?.preferred_theme !== "light";
  });
  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return initialProfile?.preferred_language || "en";
    try {
      const rawLang = localStorage.getItem("fixeth.lang");
      if (rawLang === "en" || rawLang === "bn") return rawLang;
    } catch {
      // ignore
    }
    return initialProfile?.preferred_language || "en";
  });
  const [profileOpen, setProfileOpen] = useState(false);

  const resolvedUser = useMemo(
    () => toAppUser(authUser, profileRow),
    [authUser, profileRow]
  );

  useEffect(() => {
    setUser(resolvedUser);
  }, [resolvedUser]);

  useEffect(() => {
    localStorage.setItem("fixeth.userProfile", JSON.stringify(user));
    void syncUserProfile(authUser.id, authUser.email || "", user);
  }, [authUser.email, authUser.id, user]);

  useEffect(() => {
    const nextPreferences = normalizePreferences(preferences);
    localStorage.setItem("fixeth.userPreferences", JSON.stringify(nextPreferences));
    void syncUserPreferences(authUser.id, lang, isDark);
  }, [authUser.id, isDark, lang, preferences]);

  useEffect(() => {
    localStorage.setItem("fixeth.lang", lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("fixeth.isDark", String(isDark));
  }, [isDark]);

  // Keep Tailwind's `dark:` variants in sync with the app theme toggle.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const accent = preferences.accentColor || ACCENT_PRESETS[preferences.colorPreset];
  const baseTheme = themes[isDark ? "dark" : "light"];
  const T = useMemo(
    () => ({
      ...baseTheme,
      accent,
      accentHi: accent,
      accentDim: toRgba(accent, 0.16)
    }),
    [accent, baseTheme]
  );
  const t = i18n[lang] || i18n.en;

  const densityConfig = {
    compact: { topBarHeight: 40, bottomBarHeight: 46, navPadding: "3px 6px" },
    comfortable: { topBarHeight: 44, bottomBarHeight: 52, navPadding: "4px 6px" },
    spacious: { topBarHeight: 52, bottomBarHeight: 58, navPadding: "6px 8px" }
  };
  const density = densityConfig[preferences.layoutDensity];

  const syncUser = useCallback(
    async (nextUser: AppUserProfile) => {
      setUser(nextUser);
    },
    []
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem("fixeth.userProfile");
    localStorage.removeItem("fixeth.userPreferences");
    await onSignOut();
  }, [onSignOut]);

  const value = useMemo(
    () => ({
      authUser,
      profileRow,
      uiTier,
      user,
      setUser,
      preferences,
      setPreferences,
      isDark,
      setIsDark,
      lang,
      setLang,
      T,
      t,
      density,
      profileOpen,
      setProfileOpen,
      syncUser,
      refreshProfile,
      signOut,
      DEFAULT_USER,
      DEFAULT_PREFERENCES,
      normalizePreferences
    }),
    [
      authUser,
      profileRow,
      uiTier,
      user,
      preferences,
      isDark,
      lang,
      T,
      t,
      density,
      profileOpen,
      syncUser,
      refreshProfile,
      signOut
    ]
  );

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>;
}

export { DEFAULT_USER, DEFAULT_PREFERENCES, type OnboardingPayload };
