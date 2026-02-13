import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { ReturnTable } from './ReturnTable';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <ReturnTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
