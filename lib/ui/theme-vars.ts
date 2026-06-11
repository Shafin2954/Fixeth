import type { CSSProperties } from "react";
import type { ThemeTokens } from "@/lib/ui/themes";

type ThemeWithAccent = ThemeTokens & { accentHi: string; accentDim: string };

/**
 * Bridge the runtime `T` theme object (dark/light + user accent) into CSS
 * custom properties so screens can be styled with Tailwind arbitrary-value
 * classes like `bg-[var(--t-bg1)]` / `text-[var(--t-txt0)]` while keeping
 * the dynamic theming intact.
 *
 * Spread the result onto a screen's root element:
 *   <div style={themeVars(T)} className="bg-[var(--t-bg0)] ...">
 */
export function themeVars(T: ThemeWithAccent): CSSProperties {
  return {
    "--t-bg0": T.bg0,
    "--t-bg1": T.bg1,
    "--t-bg2": T.bg2,
    "--t-bg3": T.bg3,
    "--t-bg4": T.bg4,
    "--t-border": T.border,
    "--t-border-hi": T.borderHi,
    "--t-txt0": T.txt0,
    "--t-txt1": T.txt1,
    "--t-txt2": T.txt2,
    "--t-accent": T.accent,
    "--t-accent-dim": T.accentDim,
    "--t-accent-hi": T.accentHi,
    "--t-amber": T.amber,
    "--t-amber-dim": T.amberDim,
    "--t-blue": T.blue,
    "--t-blue-dim": T.blueDim,
    "--t-red": T.red,
    "--t-red-dim": T.redDim,
    "--t-purple": T.purple,
    "--t-purple-dim": T.purpleDim,
    "--t-card-bg": T.cardBg,
    "--t-shadow": T.shadow,
    "--t-nav-bg": T.navBg
  } as CSSProperties;
}
