import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { LoanTable } from './LoanTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <h1>Hello Admin</h1>
      </AdminContent>
      <AdminContent>
        <LoanTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
