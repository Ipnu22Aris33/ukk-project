'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';
import { RowAction } from '@/components/features/datatable';
import type { CategoryResponse } from '@/lib/schema/category';

export const getRowActions = (
  open: (mode: string, row: CategoryResponse) => void,
  setDeleteTarget: (row: CategoryResponse | null) => void
): ((row: CategoryResponse) => RowAction<CategoryResponse>[]) => {
  return (row: CategoryResponse): RowAction<CategoryResponse>[] => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Eye size={16} />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Category',
      icon: <Pencil size={16} />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'delete',
      label: 'Delete Category',
      icon: <Trash2 size={16} />,
      color: 'red',
      onClick: (row) => setDeleteTarget(row),
    },
  ];
};
