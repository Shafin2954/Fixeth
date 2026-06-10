/** Adaptive UI tiers — controls bottom nav and feature visibility */

export type UiTier = 1 | 2 | 3;

export const NAV_SCREEN_IDS = [
  "dashboard",
  "jobs",
  "video",
  "notebook",
  "quiz",
  "submissions",
  "codespace",
  "tools",
  "mentor",
  "community",
  "certs"
] as const;

export type NavScreenId = (typeof NAV_SCREEN_IDS)[number];

/**
 * Screens allowed per UI tier. The progression stays additive (each tier
 * unlocks more), but "certs" is available at every level so achievements are
 * never hidden, and tier 3 also surfaces the community hub.
 */
export const TIER_NAV_SCREENS: Record<UiTier, NavScreenId[]> = {
  1: ["dashboard", "jobs", "video", "quiz", "certs"],
  2: ["dashboard", "jobs", "video", "quiz", "submissions", "mentor", "certs"],
  3: [
    "dashboard",
    "jobs",
    "video",
    "notebook",
    "quiz",
    "submissions",
    "codespace",
    "tools",
    "mentor",
    "community",
    "certs"
  ]
};

export function normalizeUiTier(value: unknown): UiTier {
  const n = Number(value);
  if (n === 2 || n === 3) return n;
  return 1;
}

export function tierAllowsScreen(tier: UiTier, screenId: NavScreenId): boolean {
  return TIER_NAV_SCREENS[tier].includes(screenId);
}

export function tierUsesLargeText(tier: UiTier): boolean {
  return tier === 1;
}
