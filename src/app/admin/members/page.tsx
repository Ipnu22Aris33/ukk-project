import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { MemberTable } from './_components/MemberTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <MemberTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
