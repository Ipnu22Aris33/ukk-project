import '@/style/globals.css';
import '@radix-ui/themes/styles.css';

import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Header } from '@/components/layouts/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
