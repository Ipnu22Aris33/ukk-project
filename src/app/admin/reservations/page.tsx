import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { ReservationTable } from './_components/ReservationTable';

export default function ReservationsPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <ReservationTable/>
      </AdminContent>
    </AdminContentWrapper>
  );
}
