"use client";

import type React from "react";

import { useEffect } from "react";
import { useThemeStore } from "../store/theme-store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    // Apply theme on mount
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Only auto-switch if user hasn't manually set a preference
      const storedTheme = localStorage.getItem("theme-storage");
      if (!storedTheme) {
        setTheme(mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, setTheme]);

  return <>{children}</>;
}
