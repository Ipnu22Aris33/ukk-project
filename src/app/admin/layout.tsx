import { DashboardLayout } from '@/components/layouts/AdminLayout';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
