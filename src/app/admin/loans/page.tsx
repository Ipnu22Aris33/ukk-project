import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { LoanTable } from './_components/LoanTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <LoanTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
