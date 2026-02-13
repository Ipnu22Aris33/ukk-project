'use client';

import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { IconButton } from '@radix-ui/themes';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle({ variant = 'soft' }: { variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost' }) {
  const { toggleTheme, isDark } = useTheme();

  return (
    <IconButton size='2' variant={variant} onClick={toggleTheme} aria-label='Toggle theme'>
      {isDark ? <SunIcon width='16' height='16' /> : <MoonIcon width='16' height='16' />}
    </IconButton>
  );
}
