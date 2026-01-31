'use client';

import React, { useState } from 'react';
import {
  PlusIcon,
  DownloadIcon,
  ReloadIcon,
  EyeOpenIcon,
  Pencil1Icon,
  TrashIcon,
  CheckIcon,
  DotsHorizontalIcon,
  CalendarIcon,
} from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import { Button, Badge, Text, Flex, IconButton, DropdownMenu } from '@radix-ui/themes';
import { DataTable } from '@/components/ui/datatable';
import { useQuery } from '@tanstack/react-query';
import { AppIcon } from '@/components/ui/AppIcon';

// ============================================
// TYPES
// ============================================

type LoanStatus = 'borrowed' | 'returned' | 'overdue';

interface Loan {
  id_loan: number;
  count: number;
  loan_date: string;
  due_date: string;
  status: LoanStatus;
  book_id: number;
  book_title: string;
  book_author: string;
  book_publisher: string;
  book_category: number;
  member_id: number;
  member_name: string;
  member_phone: string;
  member_class: string;
  member_major: string;
}

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  search: string | null;
}

interface LoansResponse {
  meta: MetaData;
  data: Loan[];
}

// ============================================
// LOAN TABLE COMPONENT
// ============================================

export function LoanTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  // Fetch data dari API menggunakan fetch
  const {
    data: loansResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['loans', pagination.pageIndex + 1, pagination.pageSize, search],
    queryFn: async (): Promise<LoansResponse> => {
      const params = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        limit: pagination.pageSize.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/loans?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      return response.json();
    },
  });

  const columns: ColumnDef<Loan>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type='checkbox'
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          className='h-4 w-4'
        />
      ),
      cell: ({ row }) => <input type='checkbox' checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} className='h-4 w-4' />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id_loan',
      header: 'ID',
      cell: ({ row }) => (
        <Text size='2' color='gray'>
          #{row.getValue('id_loan')}
        </Text>
      ),
    },
    {
      accessorKey: 'member_name',
      header: 'Member',
      cell: ({ row }) => (
        <Text size='2' weight='medium'>
          {row.getValue('member_name')}
        </Text>
      ),
    },
    {
      accessorKey: 'member_phone',
      header: 'Phone',
      cell: ({ row }) => (
        <Text size='2' color='gray'>
          {row.getValue('member_phone')}
        </Text>
      ),
    },
    {
      accessorKey: 'book_title',
      header: 'Book',
      cell: ({ row }) => (
        <Text size='2' weight='medium'>
          {row.getValue('book_title')}
        </Text>
      ),
    },
    {
      accessorKey: 'count',
      header: 'Qty',
      cell: ({ row }) => <Text size='2'>{row.getValue('count')}</Text>,
    },
    {
      accessorKey: 'loan_date',
      header: 'Loan Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('loan_date'));
        return (
          <Text size='2'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: 'due_date',
      header: 'Due Date',
      cell: ({ row }) => {
        const date = new Date(row.getValue('due_date'));
        return (
          <Text size='2'>
            {date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.getValue('status') as LoanStatus;
        const statusConfig = {
          borrowed: { color: 'blue' as const, label: 'Borrowed' },
          returned: { color: 'green' as const, label: 'Returned' },
          overdue: { color: 'red' as const, label: 'Overdue' },
        };

        const config = statusConfig[status];

        return (
          <Badge color={config.color} variant='soft' radius='full'>
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const loan = row.original;

        return (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant='ghost' size='1'>
                <DotsHorizontalIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size='2'>
              <DropdownMenu.Item onClick={() => console.log(loan)}>
                <EyeOpenIcon /> View Details
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => console.log(loan)}>
                <Pencil1Icon /> Edit
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item color='red' onClick={() => console.log(loan)}>
                <TrashIcon /> Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Custom actions di header
  const tableActions = (
    <>
      <Button variant='soft' size='2'>
        <AppIcon name='UitPrint' />
        Print
      </Button>
      <Button variant='soft' size='2' onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? <ReloadIcon className='animate-spin' /> : <ReloadIcon />}
        Refresh
      </Button>
      <Button variant='soft' size='2'>
        <DownloadIcon />
        Export
      </Button>
      <Button variant='solid' size='2'>
        <PlusIcon />
        New Loan
      </Button>
    </>
  );

  // Data untuk table
  const tableData = loansResponse?.data || [];
  const metaData = loansResponse?.meta;

  return (
    <DataTable
      data={tableData}
      columns={columns}
      title='Loans'
      description='Manage book loans and returns'
      enableSearch={true}
      enableColumnToggle={true}
      enableSelection={true}
      enablePagination={true}
      defaultPageSize={10}
      searchPlaceholder='Search loans...'
      actions={tableActions}
      // Props untuk manual pagination dari API
      manualPagination={true}
      pageCount={metaData?.totalPages || 1}
      onPaginationChange={setPagination}
      onGlobalFilterChange={(value) => {
        setSearch(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }}
      meta={{
        currentPage: pagination.pageIndex,
        totalItems: metaData?.total || 0,
        pageSize: pagination.pageSize,
        isLoading,
      }}
    />
  );
}
