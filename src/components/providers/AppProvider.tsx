import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { DevtoolsProvider } from '@/components/providers/DevtoolsProvider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider />
        <DevtoolsProvider>{children}</DevtoolsProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
