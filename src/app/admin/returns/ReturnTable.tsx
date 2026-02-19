// components/datatable/ReturnTable.tsx
'use client';

import React, { useState } from 'react';
import { Button, Flex } from '@radix-ui/themes';
import { ReloadIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import {
  ColumnFactory,
  DataTableProvider,
  DataTableHeader,
  DataTableToolbar,
  DataTableBody,
  DataTableFooter,
  DataTableEmpty,
} from '@/components/features/datatable';
import { useDataTable } from '@/hooks/useDataTable';
import { useReturns } from '@/hooks/useReturns';
import type { ColumnDef } from '@tanstack/react-table';
import { ReturnResponse } from '@/lib/models/return';


export function ReturnTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');

  const returns = useReturns()

  const returnList = returns.list({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 200,
  });

  const tableData = returnList.data?.data ?? [];
  const metaData = returnList.data?.meta;
  const isLoading = returnList.isLoading;
  const refetch = returnList.refetch;

  const col = ColumnFactory<ReturnResponse>();

  const columns: ColumnDef<ReturnResponse>[] = [
    col.selectColumn(),

    col.numberColumn('id', 'Return ID'),
    col.textColumnPath('member.id', 'Member', {
      
    }),
    col.textColumn('fineAmount', 'Class'),
    col.textColumn('fineStatus', 'Major'),

    // col.textColumn('book_title', 'Book Title'),
    // col.textColumn('book_author', 'Author'),

    // col.textColumn('loan_status', 'Loan Status'),
    // col.textColumn('fine_status', 'Fine Status'),
    // col.numberColumn('fine_amount', 'Fine Amount'),

    col.actionsColumn({
      useDefault: true,
      handlers: {
        view: (row) => console.log('View Return', row),
        edit: (row) => console.log('Edit Return', row),
        delete: (row) => console.log('Delete Return', row),
      },
    }),
  ];

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  const tableActions = (
    <>
      <Button variant="soft" size="2" onClick={() => window.print()}>
        Print
      </Button>

      <Button
        variant="soft"
        size="2"
        onClick={() => refetch()}
        disabled={isLoading}
      >
        {isLoading ? (
          <ReloadIcon className="animate-spin" />
        ) : (
          <ReloadIcon />
        )}
        Refresh
      </Button>

      <Button variant="soft" size="2">
        <DownloadIcon />
        Export
      </Button>

      <Button variant="solid" size="2">
        <PlusIcon />
        New Return
      </Button>
    </>
  );

  const dataTableState = {
    table,
    pagination,
    setPagination,
    search,
    setSearch,
    meta: metaData,
    isLoading,
    refetch,
  };

  return (
    <DataTableProvider value={dataTableState}>
      <Flex direction="column">
        <DataTableHeader
          title="Returns Management"
          description="Manage returned books and fines"
        />

        <DataTableToolbar actions={tableActions} />

        {tableData.length === 0 ? (
          <DataTableEmpty
            title="No returns found"
            description="Try adjusting your search"
          />
        ) : (
          <DataTableBody />
        )}

        {tableData.length > 0 && <DataTableFooter />}
      </Flex>
    </DataTableProvider>
  );
}
