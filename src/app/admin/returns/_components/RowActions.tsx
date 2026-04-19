'use client';

import { Eye, Banknote } from 'lucide-react';
import { RowAction } from '@/components/features/datatable';
import type { ReturnResponse } from '@/lib/schema/return';

export const getRowActions = (
  open: (mode: string, row: ReturnResponse) => void,
  setPayTarget: (row: ReturnResponse | null) => void
): ((row: ReturnResponse) => RowAction<ReturnResponse>[]) => {
  return (row: ReturnResponse): RowAction<ReturnResponse>[] => {
    const actions: RowAction<ReturnResponse>[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <Eye size={16} />,
        color: 'blue',
        onClick: (row) => open('view', row),
      },
    ];

    if (row.fineAmount && row.fineStatus === 'unpaid') {
      actions.push({
        key: 'pay',
        label: 'Pay Fine',
        icon: <Banknote size={16} />,
        color: 'green',
        onClick: (row) => setPayTarget(row),
      });
    }

    return actions;
  };
};
