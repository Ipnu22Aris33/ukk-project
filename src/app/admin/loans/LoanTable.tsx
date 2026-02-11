// components/datatable/LoanTable.tsx
'use client';

import { useState } from 'react';
import { Button, Flex } from '@radix-ui/themes';
import { ReloadIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import { ColumnFactory, DataTableProvider } from '@/components/features/datatable';
import {  } from '@/components/features/datatable/DataTableProvider';
import { DataTableHeader } from '@/components/features/datatable/DataTableHeader';
import { DataTableToolbar } from '@/components/features/datatable/DataTableToolbar';
import { DataTableBody } from '@/components/features/datatable/DataTableBody';
import { DataTableFooter } from '@/components/features/datatable/DataTableFooter';
import { useDataTable } from '@/hooks/useDataTable';
import { useLoans } from '@/hooks/useLoans';
import type { ColumnDef } from '@tanstack/react-table';

type LoanStatus = 'borrowed' | 'returned' | 'overdue' | 'late';

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

export function LoanTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');

  const { list } = useLoans({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  const tableData = list.data?.data ?? [];
  const metaData = list.data?.meta;
  const isLoading = list.isLoading;
  const refetch = list.refetch;

  const col = ColumnFactory<Loan>();

  const columns: ColumnDef<Loan>[] = [
    col.selectColumn(),
    col.textColumn('id_loan', 'ID', { color: 'gray' }),
    col.textColumn('member_name', 'Member', { weight: 'medium' }),
    col.textColumn('book_title', 'Book'),
    col.numberColumn('count', 'Qty'),
    col.dateColumn('loan_date', 'Loan Date'),
    col.dateColumn('due_date', 'Due Date'),
    col.statusBadgeColumn('status', 'Status', {
      borrowed: { label: 'Borrowed', color: 'blue' },
      returned: { label: 'Returned', color: 'jade' },
      overdue: { label: 'Overdue', color: 'red' },
      late: { label: 'Late', color: 'crimson' },
    }),
    col.actionsColumn({
      useDefault: true,
      handlers: {
        view: (row) => console.log('View', row),
        edit: (row) => console.log('Edit', row),
        delete: (row) => console.log('Delete', row),
      },
    }),
  ];

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  // Table actions
  const tableActions = (
    <>
      <Button variant='soft' size='2' onClick={() => window.print()}>
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

  // Context value untuk provider - TAMBAHKAN setPagination di sini
  const dataTableState = {
    table,
    pagination,
    setPagination, // ✅ TAMBAHKAN INI
    search,
    setSearch,
    meta: metaData,
    isLoading,
    refetch,
  };

  return (
    <DataTableProvider value={dataTableState}>
      <Flex direction='column'>
        <DataTableHeader title='Loan Management' description='Manage and track all book loans' />
        <DataTableToolbar  actions={tableActions}/>
        <DataTableBody />
        <DataTableFooter />
      </Flex>
    </DataTableProvider>
  );
}
