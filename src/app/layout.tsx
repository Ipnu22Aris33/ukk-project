import '@/style/globals.css';

import { Header } from '@/components/templates/Header';
import { AppProvider } from './provider';
import { Main } from '@/components/templates/Main';
import { Footer } from '@/components/templates/Footer';
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
          <Main>{children}</Main>
          {/* <Footer /> */}
        </AppProvider>
      </body>
    </html>
  );
}
