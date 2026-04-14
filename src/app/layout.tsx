import '@/style/globals.css';

import { AppProvider } from '@/components/providers/AppProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nexa Library',
  icons: {
    icon: 'library.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
