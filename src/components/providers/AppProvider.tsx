import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider />
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}
