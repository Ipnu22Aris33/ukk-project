import { DashboardLayout } from '@components/layouts/DahsboardLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <DashboardLayout>
          {children}
        </DashboardLayout>
  );
}