'use client';

import { useTheme as useNextTheme } from 'next-themes';

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme, themes } = useNextTheme();

  const isDark = resolvedTheme === 'dark';
  const isLight = resolvedTheme === 'light';
  const isSystem = theme === 'system';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const setThemeByChecked = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
  };

  return {
    theme,
    themes,
    systemTheme,
    resolvedTheme,

    isDark,
    isLight,
    isSystem,

    toggleTheme,
    setThemeByChecked,
    setTheme,
  };
}
