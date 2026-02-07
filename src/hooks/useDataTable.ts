'use client';

import * as React from 'react';
import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';

interface UseDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  pageSize?: number;
}

export function useDataTable<T>({ data, columns, pageSize = 10 }: UseDataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return {
    table,
  };
}
