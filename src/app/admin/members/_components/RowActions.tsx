'use client';

import { RowAction } from '@/components/features/datatable';
import type { MemberResponse } from '@/lib/schema/member';
import { Eye, Pencil } from 'lucide-react';

export const getRowActions = (open: (mode: string, row: MemberResponse) => void): ((row: MemberResponse) => RowAction<MemberResponse>[]) => {
  return (row: MemberResponse): RowAction<MemberResponse>[] => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Eye size={16} />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Member',
      icon: <Pencil size={16} />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
  ];
};
