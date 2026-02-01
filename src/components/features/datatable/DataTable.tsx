'use client';

import React, { useState } from 'react';
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from '@tanstack/react-table';
import { Box } from '@radix-ui/themes';
import { DataTableHeader } from './DataTableHeader';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableBody } from './DataTableBody';
import { DataTableFooter } from './DataTableFooter';

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  title?: string;
  description?: string;
  enableSearch?: boolean;
  enableColumnToggle?: boolean;
  enableSelection?: boolean;
  enablePagination?: boolean;
  defaultPageSize?: number;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  
  // Props baru untuk pagination dari API
  manualPagination?: boolean;
  pageCount?: number;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  onGlobalFilterChange?: (value: string) => void;
  meta?: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    isLoading?: boolean;
  };
}

export function DataTable<TData, TValue>({
  data,
  columns,
  title = 'Data Table',
  description,
  enableSearch = true,
  enableColumnToggle = true,
  enableSelection = true,
  enablePagination = true,
  defaultPageSize = 10,
  searchPlaceholder = 'Search...',
  actions,
  onRowSelectionChange,
  
  // Props baru
  manualPagination = false,
  pageCount: controlledPageCount,
  onPaginationChange,
  onGlobalFilterChange,
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  
  const [internalPagination, setInternalPagination] = useState({
    pageIndex: meta?.currentPage || 0,
    pageSize: meta?.pageSize || defaultPageSize,
  });

  const pagination = manualPagination ? internalPagination : {
    pageIndex: 0,
    pageSize: defaultPageSize,
  };

  const table = useReactTable({
    data,
    columns,
    manualPagination: manualPagination,
    pageCount: controlledPageCount,
    
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value);
      if (onGlobalFilterChange) {
        onGlobalFilterChange(value);
      }
    },
    onRowSelectionChange: (updater) => {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      setRowSelection(newSelection);
      
      if (onRowSelectionChange) {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        onRowSelectionChange(selectedRows);
      }
    },
    onPaginationChange: (updater) => {
      if (manualPagination && onPaginationChange) {
        const newPagination = typeof updater === 'function' ? updater(pagination) : updater;
        setInternalPagination(newPagination);
        onPaginationChange(newPagination);
      }
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
  });

  return (
    <Box width="100%">
      {/* Header dengan Title & Actions */}
      <DataTableHeader
        title={title}
        description={description}
        actions={actions}
      />

      {/* Toolbar dengan Search & Filters */}
      <DataTableToolbar
        table={table}
        enableSearch={enableSearch}
        enableColumnToggle={enableColumnToggle}
        enableSelection={enableSelection}
        searchPlaceholder={searchPlaceholder}
      />

      {/* Table Body */}
      <Box style={{ borderRadius: 'var(--radius-3)', overflow: 'hidden' }}>
        <DataTableBody
          table={table}
          enableSelection={enableSelection}
        />
      </Box>

      {/* Footer dengan Pagination */}
      {enablePagination && (
        <DataTableFooter
          table={table}
          enableSelection={enableSelection}
          // Pass meta data untuk manual pagination
          manualPagination={manualPagination}
          meta={meta}
        />
      )}
    </Box>
  );
}