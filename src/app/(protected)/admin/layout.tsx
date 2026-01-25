import { DashboardLayout } from '@/components/layouts/AdminLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};
  
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
