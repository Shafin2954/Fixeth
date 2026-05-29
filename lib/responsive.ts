import { useEffect, useState } from "react";

// Responsive font size utility hook
export function useResponsiveFontSize() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Scale font sizes based on device
  // Pass base desktop font size, get responsive size
  const scale = (desktopSize: number, mobileSize?: number): number => {
    if (isMobile) {
      return mobileSize ?? Math.ceil(desktopSize * 1.2); // Default: 20% larger on mobile
    }
    return desktopSize;
  };

  return { isMobile, scale };
}

// Preset responsive font sizes for consistency
export const responsiveFontSizes = {
  // Extra large
  xs: { desktop: 8, mobile: 10 },
  sm: { desktop: 10, mobile: 12 },
  base: { desktop: 12, mobile: 14 },
  md: { desktop: 14, mobile: 16 },
  lg: { desktop: 16, mobile: 18 },
  xl: { desktop: 18, mobile: 20 },
  "2xl": { desktop: 20, mobile: 24 },
  "3xl": { desktop: 24, mobile: 28 },

  // Specific for UI elements
  label: { desktop: 11, mobile: 13 },
  button: { desktop: 12, mobile: 14 },
  heading: { desktop: 16, mobile: 20 },
  subheading: { desktop: 14, mobile: 16 },
  caption: { desktop: 9, mobile: 11 },
};

// Helper to get responsive size from preset
export function getResponsiveSize(preset: keyof typeof responsiveFontSizes, isMobile: boolean): number {
  return isMobile ? responsiveFontSizes[preset].mobile : responsiveFontSizes[preset].desktop;
}
