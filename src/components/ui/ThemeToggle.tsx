'use client';

import * as Toggle from '@radix-ui/react-toggle';
import { Icon } from '@iconify/react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Toggle.Root
      pressed={isDark}
      onPressedChange={toggleTheme}
      aria-label='Toggle theme'
      className='inline-flex items-center justify-center rounded-md p-2 hover:bg-muted transition'
    >
      <Icon
        icon={isDark ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'}
        width={18}
        height={18}
      />
    </Toggle.Root>
  );
}
