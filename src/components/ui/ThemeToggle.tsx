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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        padding: '8px',
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        color: 'var(--gray-12)',
      }}
    >
      <Icon
        icon={isDark ? 'radix-icons:sun' : 'radix-icons:moon'}
        width={18}
        height={18}
      />
    </Toggle.Root>
  );
}