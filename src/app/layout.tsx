import '@/style/globals.css';

import { AppProvider } from './provider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  icons: {
    icon: './svg/globe.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <AppProvider>
          {/* <Header /> */}
          {children}
          {/* <Footer /> */}
        </AppProvider>
      </body>
    </html>
  );
}
