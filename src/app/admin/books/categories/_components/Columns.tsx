'use client';

import { ColDataTable } from '@/components/features/datatable';
import type { CategoryResponse } from '@/lib/schema/category';

export const categoryColumns: ColDataTable<CategoryResponse>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'description', header: 'Description' },
];
