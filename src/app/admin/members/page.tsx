import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { MemberTable } from './MemberTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <MemberTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
