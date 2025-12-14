"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Theme } from "@radix-ui/themes";
import { useMounted } from "@client/hooks/useMounted";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <Theme appearance="light" accentColor="violet">
        <div style={{ visibility: "hidden" }}>{children}</div>
      </Theme>
    );
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <Theme appearance="inherit" accentColor="violet">
        {children}
      </Theme>
    </NextThemesProvider>
  );
}
