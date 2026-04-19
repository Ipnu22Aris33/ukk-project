import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { ReturnTable } from './_components/ReturnTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <ReturnTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
