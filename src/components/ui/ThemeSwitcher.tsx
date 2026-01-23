'use client';

import { Switch } from '@radix-ui/themes';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSwitcher() {
  const { isDark, setThemeByChecked } = useTheme();

  return (
    <Switch
      checked={isDark}
      onCheckedChange={setThemeByChecked}
      radius="full"
      size="2"
    />
  );
}
