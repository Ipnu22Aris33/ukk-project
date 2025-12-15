// hooks/use-theme.ts
"use client";

import { useTheme as useNextTheme } from "next-themes";

export function useTheme() {
  const { theme, setTheme, systemTheme, themes, resolvedTheme } =
    useNextTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = resolvedTheme === "dark";
  const isLight = resolvedTheme === "light";
  const isSystem = theme === "system";

  return {
    theme,
    setTheme,
    systemTheme, 
    resolvedTheme, 
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    themes,
  };
}
