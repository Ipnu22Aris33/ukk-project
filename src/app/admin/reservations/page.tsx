import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';

export default function ReservationsPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <h1 className='text-2xl font-bold mb-4'>Reservations Management</h1>
      </AdminContent>
    </AdminContentWrapper>
  );
}
