'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';

interface UseDataTableProps<T> {
  data: T[] | T | null | undefined;
  columns: ColumnDef<T, any>[];
  pageSize?: number;

  // Opsional: controlled state dari luar
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
}

export function useDataTable<T>({
  data,
  columns,
  pageSize = 10,
  sorting: externalSorting,
  onSortingChange,
}: UseDataTableProps<T>) {
  // Normalize data — pastikan selalu array
  const normalizedData = React.useMemo<T[]>(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return [data];
  }, [data]);

  // Internal states
  const [sorting, setSorting] = React.useState<SortingState>(externalSorting ?? []);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((prev: SortingState) => SortingState)) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
      onSortingChange?.(next);
    },
    [sorting, onSortingChange]
  );

  const table = useReactTable({
    data: normalizedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: { pageSize },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    // Biar pagination tidak reset saat data berubah (misal saat search)
    autoResetPageIndex: false,
  });

  // Helper — ambil id dari baris yang diselect
  const selectedRows = React.useMemo(
    () => table.getSelectedRowModel().rows.map((r) => r.original),
    [rowSelection]
  );

  const clearSelection = React.useCallback(() => setRowSelection({}), []);

  return {
    table,
    selectedRows,
    clearSelection,

    // Expose state kalau perlu dari luar
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  };
}