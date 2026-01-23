'use client';

import { Icon } from '@iconify/react';
import { Button } from '@radix-ui/themes';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      // aria-label='Toggle theme'
    >
      <Icon
        icon={isDark ? 'radix-icons:sun' : 'radix-icons:moon'}
        width={18}
        height={18}
      />
    </Button>
  );
}