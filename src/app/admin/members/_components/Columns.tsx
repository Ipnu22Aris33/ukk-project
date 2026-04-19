'use client';

import { ColDataTable } from '@/components/features/datatable';
import type { MemberResponse } from '@/lib/schema/member';

export const memberColumns: ColDataTable<MemberResponse>[] = [
  {
    accessorKey: 'memberCode',
    header: 'Member Code',
  },
  {
    accessorKey: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'memberClass',
    header: 'Class',
  },
  {
    accessorKey: 'major',
    header: 'Major',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
];
