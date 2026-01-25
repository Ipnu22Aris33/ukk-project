import '@/style/globals.css';
import "@radix-ui/themes/styles.css";


import { AppProvider } from './provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  icons: {
    icon: 'next.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
