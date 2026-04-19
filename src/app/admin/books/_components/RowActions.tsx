'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { RowAction } from '@/components/features/datatable';
import type { BookResponse } from '@/lib/schema/book';

export const getRowActions = (
  open: (mode: string, row: BookResponse) => void,
  setDeleteTarget: (row: BookResponse | null) => void
): ((row: BookResponse) => RowAction<BookResponse>[]) => {
  return (row: BookResponse): RowAction<BookResponse>[] => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Eye size={16} />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Book',
      icon: <Pencil size={16} />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'delete',
      label: 'Delete Book',
      icon: <Trash2 size={16} />,
      color: 'red',
      onClick: (row) => setDeleteTarget(row),
    },
  ];
};
