// lib/themes.ts
export const THEME_CONFIG = {
  accentColor: "violet" as const,
  grayColor: "mauve" as const,
  radius: "medium" as const,
  scaling: "100%" as const,
} as const;

export const THEME_OPTIONS = [
  { value: "light", label: "Light", emoji: "☀️" },
  { value: "dark", label: "Dark", emoji: "🌙" },
  { value: "system", label: "System", emoji: "⚙️" },
] as const;
