'use client';

import React, { useState } from 'react';
import { PlusIcon, DownloadIcon } from '@radix-ui/react-icons';
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
import { DataTable } from '@/components/ui/datatable';
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

  const tableActions = (
    <>
      <Button variant="soft" size="2">
        <DownloadIcon />
        Export
      </Button>
      <Button variant="solid" size="2">
        <PlusIcon />
        New Payment
      </Button>
    </>
  );

   return (
    <DataTable
      data={paymentData}
      columns={columns}
      title="Payments"
      description="Manage payment transactions"
      enableSearch={true}
      enableColumnToggle={true}
      enableSelection={true}
      enablePagination={true}
      defaultPageSize={5}
      searchPlaceholder="Search payments..."
      actions={tableActions}
    />
  );
}