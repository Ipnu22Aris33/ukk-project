'use client';

import * as React from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, type SortingState, type PaginationState } from '@tanstack/react-table';
import { Table, Box } from '@radix-ui/themes';
import { useReactToPrint } from 'react-to-print';
import { useResponsive } from '@/hooks/useResponsive';

import type { DataTableProps } from './types';
import { PrintHTML } from './PrintHTML';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { Toolbar } from './Toolbar';
import { SearchBar } from './SearchBar';
import { Pagination } from './Pagination';
import { useDebouncedSearch } from './hooks/useDebouncedSearch';
import { useTablePagination } from './hooks/useTablePagination';
import { ActionsCell } from './ActionsCell';

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  meta,
  searchValue = '',
  onSearchChange,
  page = 1,
  onPageChange,
  onPageSizeChange,
  rowActions,
  enableSearch = true,
  enablePagination = true,
  enableSorting = true,
  enablePageSize = true,
  enableContextMenu = true,
  emptyMessage = 'No data available',
  pageSizes = [10, 20, 30, 40, 50],
  searchDebounceMs = 100,
  refreshButtonLabel = 'Refresh',
  printButtonLabel = 'Print',
  addButtonLabel = 'Add',
  showRefresh = true,
  showPrint = true,
  showAdd = true,
  onAdd,
  onRefresh,
  printConfig,
}: DataTableProps<T>) {
  const { isMobile } = useResponsive();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const printRef = React.useRef<HTMLDivElement>(null);

  const { localSearch, handleSearchChange } = useDebouncedSearch(
    searchValue,
    (value) => {
      onPageChange?.(1);
      onSearchChange?.(value);
    },
    searchDebounceMs
  );

  const { pagination, handlePageChange, handlePageSizeChange } = useTablePagination(page, meta?.limit, pageSizes, onPageChange, onPageSizeChange);

  const tableColumns = React.useMemo(() => {
    const hasActionsColumn = columns.some((col) => col.id === 'actions');
    if (hasActionsColumn) return columns;

    if (rowActions) {
      return [
        ...columns,
        {
          id: 'actions',
          header: 'Actions',
          enableSorting: false,
          size: 100,
          cell: ({ row }: any) => <ActionsCell row={row.original} actions={rowActions(row.original)} />,
        },
      ];
    }

    return columns;
  }, [columns, rowActions]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      pagination,
    },
    onSortingChange: enableSorting ? setSorting : undefined,
    onPaginationChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualPagination: true,
    pageCount: meta?.totalPages ?? -1,
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printConfig?.title,
    pageStyle: `
      * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
        box-sizing: border-box;
      }
      @page {
        size: A4;
        margin: 12mm 15mm;
      }
      body {
        background: white;
        margin: 0;
        padding: 0;
      }
      table {
        page-break-inside: auto;
        width: 100% !important;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
    `,
  });

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      handleSearchChange(localSearch);
    }
  };

  const currentPage = pagination.pageIndex;
  const totalPages = meta?.totalPages || 1;

  return (
    <Box style={{ width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        {/* Search + Toolbar */}
        {enableSearch && onSearchChange && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '8px' }}>
            <SearchBar value={localSearch} onChange={handleSearchChange} />
            <Toolbar
              isMobile={isMobile}
              isLoading={isLoading}
              showRefresh={showRefresh}
              showPrint={showPrint}
              showAdd={showAdd}
              refreshButtonLabel={refreshButtonLabel}
              printButtonLabel={printButtonLabel}
              addButtonLabel={addButtonLabel}
              onRefresh={handleRefresh}
              onPrint={handlePrint}
              onAdd={onAdd}
            />
          </div>
        )}

        {/* Main Table */}
        <Table.Root variant='surface' style={{ width: '100%', tableLayout: 'fixed' }}>
          <TableHeader headerGroups={table.getHeaderGroups()} enableSorting={enableSorting} />
          <TableBody
            rows={table.getRowModel().rows}
            isLoading={isLoading}
            isEmpty={data.length === 0}
            searchValue={localSearch}
            emptyMessage={emptyMessage}
            columnsLength={tableColumns.length}
            rowActions={rowActions}
            enableContextMenu={enableContextMenu}
          />
        </Table.Root>

        {/* Pagination */}
        {enablePagination && meta && meta.totalPages > 0 && (
          <Pagination
            isMobile={isMobile}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta.total}
            pageSize={pagination.pageSize}
            pageSizes={pageSizes}
            hasPrev={meta.hasPrev}
            hasNext={meta.hasNext}
            isLoading={isLoading}
            enablePageSize={enablePageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>

      {/* Hidden print area */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <PrintHTML
            columns={columns}
            data={data}
            meta={meta ? { total: meta.total, page: meta.page, totalPages: meta.totalPages } : undefined}
            config={printConfig}
          />
        </div>
      </div>
    </Box>
  );
}
