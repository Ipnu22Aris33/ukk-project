// hooks/useDashboard.ts
'use client';

import { useCRUD, CRUDOptions } from '@/hooks/useCRUD';

export type DashboardApiResponse = {
  books: { total: number };
  loans: { active: number };
  returns: { total: number };
  members: { total: number };
};

export const useDashboard = () => {
  // Kita tidak perlu CRUD penuh, hanya GET
  const dashboardCRUD = useCRUD<never, never, DashboardApiResponse>('/api/dashboard', {
    // matikan toast karena ini hanya GET
    disableToasts: true,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // getOne bisa dipakai, id tidak perlu, kita anggap 'singleton'
  const dashboardQuery = dashboardCRUD.getOne('dashboard', true);

  return dashboardQuery;
};
