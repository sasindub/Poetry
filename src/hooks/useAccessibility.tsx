import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FontSize = "normal" | "large" | "xlarge";
export type Contrast = "normal" | "high";
export type Density = "comfortable" | "normal" | "compact";

interface AccessibilityContextType {
  fontSize: FontSize;
  contrast: Contrast;
  density: Density;
  setFontSize: (s: FontSize) => void;
  setContrast: (c: Contrast) => void;
  setDensity: (d: Density) => void;
  reset: () => void;
}

const KEY = "aha_accessibility";

const AccessibilityContext = createContext<AccessibilityContextType>({
  fontSize: "normal",
  contrast: "normal",
  density: "normal",
  setFontSize: () => {},
  setContrast: () => {},
  setDensity: () => {},
  reset: () => {},
});

interface Stored {
  fontSize: FontSize;
  contrast: Contrast;
  density: Density;
}

const DEFAULT: Stored = { fontSize: "normal", contrast: "normal", density: "normal" };

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [contrast, setContrast] = useState<Contrast>("normal");
  const [density, setDensity] = useState<Density>("normal");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = { ...DEFAULT, ...JSON.parse(raw) };
        setFontSize(saved.fontSize);
        setContrast(saved.contrast);
        setDensity(saved.density);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-font-size", fontSize);
    root.setAttribute("data-contrast", contrast);
    root.setAttribute("data-density", density);
    root.style.fontSize =
      fontSize === "normal" ? "16px" : fontSize === "large" ? "17.5px" : "19px";
    localStorage.setItem(KEY, JSON.stringify({ fontSize, contrast, density }));
  }, [fontSize, contrast, density]);

  const reset = () => {
    setFontSize("normal");
    setContrast("normal");
    setDensity("normal");
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, contrast, density, setFontSize, setContrast, setDensity, reset }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
