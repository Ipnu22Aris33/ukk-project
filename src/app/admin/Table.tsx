'use client';

import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  useReactTable,
} from '@tanstack/react-table';
import { 
  DropdownMenu, 
  Table, 
  Button, 
  TextField, 
  Text, 
  Box, 
  Flex, 
  Checkbox,
  Badge,
  Heading,
  Grid,
  Container,
  IconButton,
  Select,
  ScrollArea
} from '@radix-ui/themes';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MixerHorizontalIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@radix-ui/react-icons';

// ============================================
// TYPES
// ============================================

type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  name: string;
  date: string;
  method: string;
};

// ============================================
// DATA CONTOH
// ============================================

const paymentData: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
    name: 'John Doe',
    date: '2024-01-01',
    method: 'Credit Card',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
    name: 'Jane Smith',
    date: '2024-01-02',
    method: 'PayPal',
  },
  {
    id: '3a8b9c7d',
    amount: 89,
    status: 'success',
    email: 'user@domain.com',
    name: 'Robert Johnson',
    date: '2024-01-03',
    method: 'Bank Transfer',
  },
  {
    id: '5e6f7a8b',
    amount: 150,
    status: 'failed',
    email: 'test@test.com',
    name: 'Sarah Williams',
    date: '2024-01-04',
    method: 'Credit Card',
  },
  {
    id: '9c8d7e6f',
    amount: 200,
    status: 'success',
    email: 'demo@demo.com',
    name: 'Michael Brown',
    date: '2024-01-05',
    method: 'PayPal',
  },
  {
    id: '2b3c4d5e',
    amount: 75,
    status: 'pending',
    email: 'sample@sample.com',
    name: 'Emily Davis',
    date: '2024-01-06',
    method: 'Bank Transfer',
  },
  {
    id: '6f7e8d9c',
    amount: 300,
    status: 'processing',
    email: 'hello@world.com',
    name: 'David Wilson',
    date: '2024-01-07',
    method: 'Credit Card',
  },
  {
    id: '1a2b3c4d',
    amount: 50,
    status: 'success',
    email: 'info@company.com',
    name: 'Lisa Taylor',
    date: '2024-01-08',
    method: 'PayPal',
  },
  {
    id: 'a2b3c4d5',
    amount: 175,
    status: 'pending',
    email: 'user1@example.com',
    name: 'Alex Johnson',
    date: '2024-01-09',
    method: 'Credit Card',
  },
  {
    id: 'b3c4d5e6',
    amount: 225,
    status: 'success',
    email: 'user2@example.com',
    name: 'Maria Garcia',
    date: '2024-01-10',
    method: 'PayPal',
  },
  {
    id: 'c4d5e6f7',
    amount: 90,
    status: 'processing',
    email: 'user3@example.com',
    name: 'James Wilson',
    date: '2024-01-11',
    method: 'Bank Transfer',
  },
  {
    id: 'd5e6f7a8',
    amount: 110,
    status: 'failed',
    email: 'user4@example.com',
    name: 'Sarah Miller',
    date: '2024-01-12',
    method: 'Credit Card',
  },
];

// ============================================
// PAYMENT TABLE COMPONENT - DENGAN PAGINATION FIX
// ============================================

export function PaymentTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const columns: ColumnDef<Payment>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          size="2"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          size="2"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <Text size="2" color="gray">{row.getValue('id')}</Text>,
    },
    {
      accessorKey: 'name',
      header: 'Customer',
      cell: ({ row }) => <Text size="2" weight="medium">{row.getValue('name')}</Text>,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <Text size="2" color="gray">{row.getValue('email')}</Text>,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatted = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return <Text size="2" weight="medium">{formatted}</Text>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const statusConfig = {
          pending: { color: 'yellow' as const, label: 'Pending' },
          processing: { color: 'blue' as const, label: 'Processing' },
          success: { color: 'green' as const, label: 'Success' },
          failed: { color: 'red' as const, label: 'Failed' },
        };
        
        const config = statusConfig[status as keyof typeof statusConfig];
        
        return (
          <Badge color={config.color} variant="soft" radius="full">
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'method',
      header: 'Payment Method',
      cell: ({ row }) => <Text size="2">{row.getValue('method')}</Text>,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('date'));
        return (
          <Text size="2">
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        );
      },
    },
  ];

  const table = useReactTable({
    data: paymentData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection,
      pagination,
    },
  });

  const [goToPage, setGoToPage] = useState('');

  // Fungsi untuk generate page buttons
  const getPageButtons = () => {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;
    
    if (pageCount <= 5) {
      // Tampilkan semua page jika kurang dari 5
      return Array.from({ length: pageCount }, (_, i) => i);
    } else {
      // Tampilkan max 5 pages di sekitar current page
      let start = Math.max(0, currentPage - 2);
      let end = Math.min(pageCount - 1, currentPage + 2);
      
      // Adjust jika di awal
      if (currentPage <= 2) {
        start = 0;
        end = 4;
      }
      // Adjust jika di akhir
      else if (currentPage >= pageCount - 3) {
        start = pageCount - 5;
        end = pageCount - 1;
      }
      
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
  };

  return (
    <Container size="4" width="100%">
      {/* HEADER */}
      <Box mb="6">
        <Heading size="7" weight="bold">Payments</Heading>
        <Text size="2" color="gray" mt="1">Manage your payment transactions</Text>
      </Box>

      {/* TOOLBAR */}
      <Grid columns={{ initial: '1', sm: '2' }} gap="4" mb="6" align="center">
        {/* SEARCH */}
        <Flex align="center" gap="3">
          <Box style={{ position: 'relative', flex: 1 }}>
            <TextField.Root 
              size="2" 
              placeholder="Search payments..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
              {globalFilter && (
                <TextField.Slot>
                  <IconButton
                    size="1"
                    variant="ghost"
                    onClick={() => setGlobalFilter('')}
                  >
                    <Cross2Icon height="16" width="16" />
                  </IconButton>
                </TextField.Slot>
              )}
            </TextField.Root>
          </Box>

          {/* SELECTED ROWS INFO */}
          {Object.keys(rowSelection).length > 0 && (
            <Text size="2" color="gray">
              {Object.keys(rowSelection).length} row(s) selected
            </Text>
          )}
        </Flex>

        {/* COLUMN VISIBILITY */}
        <Flex justify="end" gap="3" align="center">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button variant="soft" size="2">
                <MixerHorizontalIcon />
                Columns
                <DropdownMenu.TriggerIcon />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="2">
              <DropdownMenu.Label>Show/Hide Columns</DropdownMenu.Label>
              <DropdownMenu.Separator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenu.CheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header?.toString() || column.id}
                  </DropdownMenu.CheckboxItem>
                ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Grid>

      {/* TABLE */}

      <Box style={{ borderRadius: 'var(--radius-3)', overflow: 'hidden' }}>

        <Table.Root variant="surface" size="2" layout='auto'>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.ColumnHeaderCell key={header.id}>
                    {header.isPlaceholder ? null : (
                      <Flex
                        align="center"
                        gap="2"
                        style={{ 
                          cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          userSelect: 'none'
                        }}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <Flex direction="column">
                            <ChevronUpIcon
                              style={{ 
                                height: '12px', 
                                width: '12px',
                                color: header.column.getIsSorted() === 'asc' 
                                  ? 'var(--accent-11)' 
                                  : 'var(--gray-8)'
                              }}
                            />
                            <ChevronDownIcon
                              style={{ 
                                height: '12px', 
                                width: '12px',
                                marginTop: '-4px',
                                color: header.column.getIsSorted() === 'desc' 
                                  ? 'var(--accent-11)' 
                                  : 'var(--gray-8)'
                              }}
                            />
                          </Flex>
                        )}
                      </Flex>
                    )}
                  </Table.ColumnHeaderCell>
                ))}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body>
            {table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id} align="center">
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>

        {/* EMPTY STATE */}
        {table.getRowModel().rows.length === 0 && (
          <Box py="8" style={{ textAlign: 'center' }}>
            <Box
              style={{
                margin: '0 auto',
                height: '48px',
                width: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--gray-3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}
            >
              <MagnifyingGlassIcon style={{ height: '24px', width: '24px', color: 'var(--gray-10)' }} />
            </Box>
            <Heading size="4" weight="medium" mb="1">No payments found</Heading>
            <Text size="2" color="gray">Try adjusting your search or filter</Text>
          </Box>
        )}
      </Box>

      {/* PAGINATION YANG BEKERJA */}
      <Flex direction={{ initial: 'column', sm: 'row' }} align="center" justify="between" gap="4" mt="6">
        {/* LEFT SIDE: Info & Page Size */}
        <Flex align="center" gap="4">
          <Text size="2" color="gray">
            Showing{' '}
            <Text weight="medium" as="span">
              {table.getRowModel().rows.length}
            </Text>{' '}
            of{' '}
            <Text weight="medium" as="span">
              {table.getFilteredRowModel().rows.length}
            </Text>{' '}
            entries
          </Text>
          
          {/* PAGE SIZE SELECTOR */}
          <Flex align="center" gap="2">
            <Text size="2" color="gray">Show</Text>
            <Select.Root
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <Select.Trigger/>
              <Select.Content>
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <Select.Item key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
            <Text size="2" color="gray">entries</Text>
          </Flex>
        </Flex>

        {/* RIGHT SIDE: Page Navigation */}
        <Flex align="center" gap="4">
          {/* PAGE INFO */}
          <Text size="2" color="gray">
            Page{' '}
            <Text weight="medium" as="span">
              {table.getState().pagination.pageIndex + 1}
            </Text>{' '}
            of{' '}
            <Text weight="medium" as="span">
              {table.getPageCount()}
            </Text>
          </Text>

          {/* PAGE BUTTONS */}
          <Flex gap="1">
            {/* FIRST PAGE */}
            <IconButton
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              variant="soft"
              size="2"
            >
              <DoubleArrowLeftIcon />
            </IconButton>

            {/* PREVIOUS PAGE */}
            <IconButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="soft"
              size="2"
            >
              <ChevronLeftIcon />
            </IconButton>

            {/* PAGE NUMBER BUTTONS */}
            <Flex gap="1">
              {getPageButtons().map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={table.getState().pagination.pageIndex === pageIndex ? "solid" : "soft"}
                  size="2"
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))}
            </Flex>

            {/* NEXT PAGE */}
            <IconButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="soft"
              size="2"
            >
              <ChevronRightIcon />
            </IconButton>

            {/* LAST PAGE */}
            <IconButton
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              variant="soft"
              size="2"
            >
              <DoubleArrowRightIcon />
            </IconButton>
          </Flex>

          {/* GO TO PAGE */}
          <Flex align="center" gap="2">
            <Text size="2" color="gray">Go to</Text>
            <TextField.Root
              size="1"
              type="number"
              min="1"
              max={table.getPageCount()}
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              style={{ width: '60px' }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const page = parseInt(goToPage);
                  if (!isNaN(page) && page >= 1 && page <= table.getPageCount()) {
                    table.setPageIndex(page - 1);
                    setGoToPage('');
                  }
                }
              }}
            />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
}