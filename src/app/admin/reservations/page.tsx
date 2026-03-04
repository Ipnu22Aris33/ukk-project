import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { ReservationTable } from './ReservationTable';

export default function ReservationsPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <ReservationTable/>
      </AdminContent>
    </AdminContentWrapper>
  );
}
