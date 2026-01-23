'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';
import { useMounted } from '@/hooks/useMounted';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider attribute='class' defaultTheme='system' enableSystem>
      <Theme appearance='inherit' accentColor='purple' grayColor='slate'>
        {children}
      </Theme>
    </NextThemesProvider>
  );
}
