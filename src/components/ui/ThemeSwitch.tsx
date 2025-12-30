'use client';

import * as Switch from '@radix-ui/react-switch';
import { Icon } from '@iconify/react';
import { useTheme } from '@/hooks/useTheme';

const themeSwitchStyles = {
  root: `
    relative inline-flex h-6 w-12 items-center cursor-pointer rounded-full
    transition-colors duration-200
    // bg-(--gray-3) 
    data-[state=checked]:bg-(--gray-3)
  `,
  thumb: `
    pointer-events-none flex h-5 w-5 items-center justify-center rounded-full
    transition-all duration-200
    bg-(--gray-1)
    data-[state=checked]:bg-(--gray-1)
    translate-x-0.5
    data-[state=checked]:translate-x-6
  `,
  icon: `
    text-(--gray-12)
    data-[state=checked]:text-(--gray-1)
  `,
};

export function ThemeSwitch() {
  const { isDark, setThemeByChecked } = useTheme();

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={setThemeByChecked}
      aria-label='Theme switch'
      className={themeSwitchStyles.root}
    >
      <Switch.Thumb className={themeSwitchStyles.thumb}>
        <Icon
          icon={isDark ? 'mdi:weather-night' : 'mdi:white-balance-sunny'}
          width={14}
          height={14}
          color={isDark ? 'var(--gray-12)' : 'var(--amber-9)'}
          className={themeSwitchStyles.icon}
        />
      </Switch.Thumb>
    </Switch.Root>
  );
}
