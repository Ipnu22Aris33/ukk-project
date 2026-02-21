// components/DataTable.tsx
'use client';

import * as React from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
} from '@tanstack/react-table';
import { Table, Text, Button, Flex, TextField, IconButton, Select, ContextMenu, Box, Skeleton, DropdownMenu } from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CaretSortIcon,
  DotsHorizontalIcon,
  ReloadIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { useResponsive } from '@/hooks/useResponsive';
import { UitPrint } from '@/components/icons';
import { useReactToPrint } from 'react-to-print';

export type MetaData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'gray';
  onClick: (row: T) => void;
};

export type NestedKeys<T, Prev extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
      ? `${Prev}${K & string}`
      : `${Prev}${K & string}` | NestedKeys<T[K], `${Prev}${K & string}.`>
    : `${Prev}${K & string}`;
}[keyof T];

export type ColDataTable<T> = ColumnDef<T> & {
  accessorKey: NestedKeys<T>;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  meta?: MetaData;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  rowActions?: (row: T) => RowAction<T>[];
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enablePageSize?: boolean;
  enableContextMenu?: boolean;
  emptyMessage?: string;
  pageSizes?: number[];
  searchDebounceMs?: number;
  // Toolbar buttons
  refreshButtonLabel?: string;
  printButtonLabel?: string;
  addButtonLabel?: string;
  showRefresh?: boolean;
  showPrint?: boolean;
  showAdd?: boolean;
  onAdd?: () => void;
  onRefresh?: () => void;
  // Print options
  printTitle?: string;
  printSubtitle?: string;
  printAccentColor?: string;
}

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
  // Toolbar buttons
  refreshButtonLabel = 'Refresh',
  printButtonLabel = 'Print',
  addButtonLabel = 'Add',
  showRefresh = true,
  showPrint = true,
  showAdd = true,
  onAdd,
  onRefresh,
  // Print options
  printTitle = 'Data Table Report',
  printSubtitle,
  printAccentColor = '#56468B',
}: DataTableProps<T>) {
  const { isMobile } = useResponsive();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [localSearch, setLocalSearch] = React.useState(searchValue);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const printRef = React.useRef<HTMLDivElement>(null);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: meta?.limit || pageSizes[0],
  });

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: printTitle,
    pageStyle: `
      * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @page { 
        size: potrait; 
        margin: 15mm; 
      }
      body {
        background: white;
        margin: 0;
        padding: 0;
      }
    `,
    onBeforePrint: async () => {
      console.log('Preparing to print...');
    },
    onAfterPrint: () => {
      console.log('Print completed');
    },
  });

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
          cell: ({ row }) => {
            const actions = rowActions(row.original);
            return (
              <Flex
                gap='2'
                justify='center'
                align='center'
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {actions.map((action) => (
                  <IconButton
                    key={action.key}
                    size='1'
                    variant='solid'
                    color={action.color}
                    onClick={() => action.onClick(row.original)}
                    title={action.label}
                  >
                    {action.icon ?? action.label[0]}
                  </IconButton>
                ))}
              </Flex>
            );
          },
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
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualPagination: true,
    pageCount: meta?.totalPages ?? -1,
  });

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setLocalSearch(value);

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        table.setPageIndex(0);
        onPageChange?.(1);
        onSearchChange?.(value);
      }, searchDebounceMs);
    },
    [onSearchChange, onPageChange, table, searchDebounceMs]
  );

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  const handlePageChange = React.useCallback(
    (newPageIndex: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
      onPageChange?.(newPageIndex + 1);
    },
    [onPageChange]
  );

  const handlePageSizeChange = React.useCallback(
    (value: string) => {
      const newSize = Number(value);
      setPagination((prev) => ({
        ...prev,
        pageSize: newSize,
        pageIndex: 0,
      }));
      onPageSizeChange?.(newSize);
      onPageChange?.(1);
    },
    [onPageSizeChange, onPageChange]
  );

  React.useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: page - 1,
      pageSize: meta?.limit || prev.pageSize,
    }));
  }, [page, meta?.limit]);

  const currentPage = pagination.pageIndex;
  const totalPages = meta?.totalPages || 1;

  const getPageNumbers = React.useCallback(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
      pages.push(...pageIndices);
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, start + maxVisible - 1);
      const adjustedStart = end - start + 1 < maxVisible ? Math.max(0, end - maxVisible + 1) : start;
      const visiblePages = Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
      pages.push(...visiblePages);

      if (adjustedStart > 0) {
        pages.unshift('...');
        pages.unshift(0);
      }
      if (end < totalPages - 1) {
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  const pageNumbers = getPageNumbers();

  const renderRow = (row: any, index: number) => {
    const actions = rowActions ? rowActions(row.original) : [];
    const hasActions = actions.length > 0;

    const rowContent = (
      <>
        {row.getVisibleCells().map((cell: any, cellIndex: number) => (
          <Table.Cell
            key={cell.id}
            style={{
              borderRight: cellIndex < row.getVisibleCells().length - 1 ? '1px solid var(--gray-7)' : 'none',
            }}
          >
            <Flex align='center' justify={cell.column.id === 'actions' ? 'center' : 'start'}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Flex>
          </Table.Cell>
        ))}
      </>
    );

    if (!hasActions || !enableContextMenu) {
      return <Table.Row key={row.id}>{rowContent}</Table.Row>;
    }

    return (
      <ContextMenu.Root key={row.id}>
        <ContextMenu.Trigger>
          <Table.Row>{rowContent}</Table.Row>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          {actions.map((action) => (
            <ContextMenu.Item key={action.key} color={action.color} onClick={() => action.onClick(row.original)}>
              <Flex gap='2' align='center'>
                {action.icon}
                {action.label}
              </Flex>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Content>
      </ContextMenu.Root>
    );
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    } else {
      handleSearchChange(localSearch);
    }
  };

  const PrintHTML = () => {
    const printColumns = columns.filter((col) => col.id !== 'actions');

    const getNestedValue = (obj: any, path: string) => {
      if (!path) return '';
      if (!path.includes('.')) return obj?.[path];

      try {
        return path.split('.').reduce((current, key) => {
          if (current === null || current === undefined) return '';
          return current[key];
        }, obj);
      } catch {
        return '';
      }
    };

    const getCellValue = (row: T, column: ColumnDef<T>, rowIndex: number) => {
      if ('accessorKey' in column && column.accessorKey) {
        return getNestedValue(row, column.accessorKey as string) ?? '-';
      }

      if ('accessorFn' in column && column.accessorFn) {
        return column.accessorFn(row, rowIndex) ?? '-';
      }

      if (column.id) {
        return getNestedValue(row, column.id) ?? '-';
      }

      return '-';
    };

    const getHeaderText = (column: ColumnDef<T>) => {
      if (typeof column.header === 'string') {
        return column.header;
      }
      if (typeof column.header === 'function') {
        return column.id || 'Column';
      }
      if ('accessorKey' in column && column.accessorKey) {
        return String(column.accessorKey);
      }
      return column.id || 'Column';
    };

    return (
      <div className='min-h-screen bg-white flex flex-col'>
        <div className='flex-1 font-sans max-w-7xl mx-auto p-8 w-full'>
          {/* Header */}
          <div
            className='text-center mb-8 border-b-2 pb-4'
            style={{
              borderBottomColor: printAccentColor,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            {printTitle && (
              <h1
                className='text-3xl mb-2 font-bold tracking-wide'
                style={{
                  color: printAccentColor,
                }}
              >
                {printTitle}
              </h1>
            )}

            {printSubtitle && <p className='text-gray-600 text-base italic m-0'>{printSubtitle}</p>}
          </div>

          {/* Table */}
          <div className='overflow-auto'>
            <table className='w-full border-collapse shadow-lg rounded-lg overflow-hidden'>
              <thead className='sticky top-0'>
                <tr>
                  {printColumns.map((col, index) => (
                    <th
                      key={col.id || index}
                      className='px-4 py-3.5 text-center text-sm font-bold uppercase tracking-wide text-white'
                      style={{
                        backgroundColor: printAccentColor,
                        WebkitPrintColorAdjust: 'exact',
                        printColorAdjust: 'exact',
                        borderRight: index < printColumns.length - 1 ? `1px solid ${printAccentColor}99` : 'none',
                      }}
                    >
                      {getHeaderText(col)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {data.length > 0 ? (
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {printColumns.map((col, colIndex) => {
                        const value = getCellValue(row, col, rowIndex);

                        return (
                          <td
                            key={`${rowIndex}-${col.id || colIndex}`}
                            className={`p-3 text-sm text-gray-700 border border-gray-200 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            {value !== null && value !== undefined ? String(value) : '-'}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={printColumns.length} className='p-8 text-center text-gray-400 text-sm border border-gray-200'>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='flex-1 min-h-8' />
        </div>

        {/* Footer */}
        {meta && (
          <div
            className='border-t-2 py-4 px-8'
            style={{
              borderTopColor: printAccentColor,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <div className='max-w-7xl mx-auto w-full flex justify-between text-sm font-bold' style={{ color: printAccentColor }}>
              <span>Total Items: {meta.total}</span>
              <span>
                Page: {meta.page} of {meta.totalPages}
              </span>
              <span>Generated: {new Date().toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Watermark */}
        <div className='text-center py-2 text-xs text-gray-400 italic border-t border-gray-100'>Report generated from Data Table</div>
      </div>
    );
  };

  const hasToolbarButtons = showRefresh || showPrint || showAdd;

  // Render toolbar buttons based on device
  const renderToolbar = () => {
    if (!hasToolbarButtons) return null;

    if (isMobile) {
      return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant='soft' size='2'>
              <DotsHorizontalIcon />
            </IconButton>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            {showRefresh && (
              <DropdownMenu.Item onClick={handleRefresh}>
                <Flex gap='2' align='center'>
                  <ReloadIcon />
                  {refreshButtonLabel}
                </Flex>
              </DropdownMenu.Item>
            )}

            {showPrint && (
              <DropdownMenu.Item onClick={handlePrint}>
                <Flex gap='2' align='center'>
                  <UitPrint />
                  {printButtonLabel}
                </Flex>
              </DropdownMenu.Item>
            )}

            {showAdd && onAdd && (
              <DropdownMenu.Item onClick={onAdd}>
                <Flex gap='2' align='center'>
                  <PlusIcon />
                  {addButtonLabel}
                </Flex>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      );
    }

    // Desktop: Buttons
    return (
      <Flex gap='2'>
        {showRefresh && (
          <Button size='2' variant='soft' onClick={handleRefresh} disabled={isLoading}>
            <Flex gap='2' align='center'>
              <ReloadIcon />
              {refreshButtonLabel}
            </Flex>
          </Button>
        )}

        {showPrint && (
          <Button size='2' variant='soft' onClick={handlePrint}>
            <Flex gap='2' align='center'>
              <UitPrint />
              {printButtonLabel}
            </Flex>
          </Button>
        )}

        {showAdd && onAdd && (
          <Button size='2' variant='solid' onClick={onAdd}>
            <Flex gap='2' align='center'>
              <PlusIcon />
              {addButtonLabel}
            </Flex>
          </Button>
        )}
      </Flex>
    );
  };

  return (
    <Box style={{ width: '100%' }}>
      <Flex direction='column' gap='4' style={{ width: '100%' }}>
        {/* Search Bar with Toolbar */}
        {enableSearch && onSearchChange && (
          <Flex justify='between' align='center' style={{ width: '100%' }} gap='2'>
            <TextField.Root placeholder='Search...' value={localSearch} onChange={(e) => handleSearchChange(e.target.value)} style={{ flex: 1 }}>
              <TextField.Slot>
                <MagnifyingGlassIcon height='16' width='16' />
              </TextField.Slot>
            </TextField.Root>

            {renderToolbar()}
          </Flex>
        )}

        {/* Table - Radix UI */}
        <Table.Root variant='surface' style={{ width: '100%', tableLayout: 'fixed' }}>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <Table.ColumnHeaderCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                      textAlign: 'center',
                      backgroundColor: 'var(--accent-9)',
                      color: 'white',
                      borderRight: index < headerGroup.headers.length - 1 ? '1px solid var(--gray-6)' : 'none',
                    }}
                  >
                    <Flex gap='1' align='center' justify='center'>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {enableSorting && header.column.getCanSort() && (
                        <Box
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: header.column.getIsSorted() ? 'white' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {header.column.getIsSorted() === 'asc' && <ArrowUpIcon width='12' height='12' />}
                          {header.column.getIsSorted() === 'desc' && <ArrowDownIcon width='12' height='12' />}
                          {!header.column.getIsSorted() && <CaretSortIcon width='12' height='12' />}
                        </Box>
                      )}
                    </Flex>
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <Table.Row key={`skeleton-${index}`}>
                  {Array.from({ length: tableColumns.length }).map((_, cellIndex) => (
                    <Table.Cell
                      key={`skeleton-cell-${cellIndex}`}
                      style={{
                        borderRight: cellIndex < tableColumns.length - 1 ? '1px solid var(--gray-7)' : 'none',
                      }}
                    >
                      <Skeleton>
                        <Text>Loading</Text>
                      </Skeleton>
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : data.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={tableColumns.length} align='center' style={{ padding: '32px' }}>
                  <Text size='2' color='gray'>
                    {searchValue ? 'No results found' : emptyMessage}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              // ========== PANGGIL FUNGSI RENDER ROW DI SINI ==========
              table.getRowModel().rows.map((row, index) => renderRow(row, index))
              // =======================================================
            )}
          </Table.Body>
        </Table.Root>

        {/* Pagination Footer */}
        {enablePagination && meta && meta.totalPages > 0 && (
          <Flex justify='between' align='center' gap='4' style={{ width: '100%' }} direction={isMobile ? 'column' : 'row'}>
            <Text size='2' color='gray'>
              Page {currentPage + 1} of {totalPages}
              {meta?.total && ` (Total: ${meta.total})`}
            </Text>

            <Flex gap='1' align='center' wrap='wrap' justify='center'>
              <IconButton variant='soft' size='1' onClick={() => handlePageChange(0)} disabled={!meta.hasPrev || isLoading}>
                <DoubleArrowLeftIcon />
              </IconButton>

              <IconButton variant='soft' size='1' onClick={() => handlePageChange(currentPage - 1)} disabled={!meta.hasPrev || isLoading}>
                <ChevronLeftIcon />
              </IconButton>

              {pageNumbers.map((page, idx) =>
                typeof page === 'number' ? (
                  <Button
                    key={`page-${page}`}
                    variant={currentPage === page ? 'solid' : 'soft'}
                    size='1'
                    onClick={() => handlePageChange(page)}
                    disabled={isLoading}
                    style={{ minWidth: '32px' }}
                  >
                    {page + 1}
                  </Button>
                ) : (
                  <Text key={`ellipsis-${idx}`} size='2' color='gray' mx='1'>
                    ...
                  </Text>
                )
              )}

              <IconButton variant='soft' size='1' onClick={() => handlePageChange(currentPage + 1)} disabled={!meta.hasNext || isLoading}>
                <ChevronRightIcon />
              </IconButton>

              <IconButton variant='soft' size='1' onClick={() => handlePageChange(totalPages - 1)} disabled={!meta.hasNext || isLoading}>
                <DoubleArrowRightIcon />
              </IconButton>
            </Flex>

            {enablePageSize && (
              <Flex gap='2' align='center'>
                <Text size='2' color='gray'>
                  Show:
                </Text>
                <Select.Root value={pagination.pageSize.toString()} onValueChange={handlePageSizeChange} size='1' disabled={isLoading}>
                  <Select.Trigger
                    style={{
                      minWidth: '70px',
                      fontSize: '12px',
                      padding: '2px 8px',
                    }}
                  />
                  <Select.Content>
                    <Select.Group>
                      {pageSizes.map((size) => (
                        <Select.Item key={size} value={size.toString()}>
                          {size}
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>

      {/* Printable Content - Hidden from view */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <PrintHTML />
        </div>
      </div>
    </Box>
  );
}
