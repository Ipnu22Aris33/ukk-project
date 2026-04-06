'use client';

import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { DashboardContent } from './_components/DashboardContent';

export default function AdminPage() {
  return (
    <AdminContentWrapper columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
      <DashboardContent />
    </AdminContentWrapper>
  );
}
