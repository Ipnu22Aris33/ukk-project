import { createCRUD } from '@/hooks/useCRUD';
import { ReservationResponse, CreateReservationInput, UpdateReservationInput } from '@/lib/schema/reservation';

export const useReservations = createCRUD<CreateReservationInput | UpdateReservationInput, ReservationResponse[], ReservationResponse>(
  '/api/reservations',
  {
    resourceName: 'reservations',
    messages: {
      create: 'Reservasi berhasil ditambahkan!',
      update: 'Reservasi berhasil diperbarui!',
      delete: 'Reservasi berhasil dihapus!',
    },
  }
);
