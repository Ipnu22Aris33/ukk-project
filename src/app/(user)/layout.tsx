import UserLayout from '@/components/layouts/UserLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <UserLayout>{children}</UserLayout>;
}
