'use client';

import { ColDataTable } from '@/components/features/datatable';
import type { BookResponse } from '@/lib/schema/book';

export const bookColumns: ColDataTable<BookResponse>[] = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'author', header: 'Author' },
  { accessorKey: 'category.name', header: 'Category' },
  { accessorKey: 'totalStock', header: 'Total Stock' },
  { accessorKey: 'availableStock', header: 'Available Stock' },
  { accessorKey: 'reservedStock', header: 'Reserved Stock' },
  { accessorKey: 'loanedStock', header: 'Loaned Stock' },
];
