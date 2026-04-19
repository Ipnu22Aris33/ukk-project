'use client';

import { Eye, Pencil, BookCheck } from 'lucide-react';
import { RowAction } from '@/components/features/datatable';
import type { LoanResponse } from '@/lib/schema/loan';

export const getRowActions = (
  open: (mode: string, row: LoanResponse) => void,
  setReturnTarget: (row: LoanResponse | null) => void
): ((row: LoanResponse) => RowAction<LoanResponse>[]) => {
  return (row: LoanResponse): RowAction<LoanResponse>[] => {
    const baseActions: RowAction<LoanResponse>[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <Eye size={16} />,
        color: 'blue',
        onClick: (row) => open('view', row),
      },
      {
        key: 'edit',
        label: 'Edit Loan',
        icon: <Pencil size={16} />,
        color: 'green',
        onClick: (row) => open('edit', row),
      },
    ];

    if (row.status !== 'returned') {
      baseActions.push({
        key: 'return',
        label: 'Mark as Returned',
        icon: <BookCheck size={16} />,
        color: 'green',
        onClick: (row) => setReturnTarget(row),
      });
    }

    return baseActions;
  };
};
