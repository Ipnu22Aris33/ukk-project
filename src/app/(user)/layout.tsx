import UserLayout from '@/components/layouts/UserLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Dashboard',
   icons: {
    icon: 'library.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
