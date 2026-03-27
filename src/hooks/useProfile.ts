// hooks/useUserSummary.ts
'use client';

import { useCRUD } from '@/hooks/useCRUD';

// Sesuaikan dengan struktur data yang kita buat di API tadi
export type UserSummaryApiResponse = {
  user: {
    id: number;
    email: string;
    role: string;
  };
  summary: {
    loans: {
      total: number;
      active: number;
      overdue: number;
    };
    returns: {
      total: number;
    };
    reservations: {
      active: number;
    };
  };
};

export const useProfile = () => {
  // Kita arahkan ke endpoint summary user
  const userCRUD = useCRUD<never, never, UserSummaryApiResponse>('/api/profile/summary', {
    disableToasts: true, // Agar tidak muncul notifikasi sukses tiap kali fetch profil
    staleTime: 1000 * 60 * 5, // Data dianggap fresh selama 5 menit
    gcTime: 1000 * 60 * 10,
  });

  // Karena endpoint ini tidak butuh ID (otomatis dari session/token di backend),
  // kita panggil root path-nya saja.
  const summaryQuery = userCRUD.getOne('/', true);

  return summaryQuery;
};