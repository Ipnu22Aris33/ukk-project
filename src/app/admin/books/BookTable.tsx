// components/datatable/BookTable.tsx
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
import { useBooks } from '@/hooks/useBooks';
import type { ColumnDef } from '@tanstack/react-table';

interface Book {
  id_book: number;
  title: string;
  author: string;
  publisher: string;
  slug: string;
  stock: number;
  category: string | number;
}

export function BookTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');

  const { list } = useBooks({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  const tableData = list.data?.data ?? [];
  const metaData = list.data?.meta;
  const isLoading = list.isLoading;
  const refetch = list.refetch;

  const col = ColumnFactory<Book>();

  const columns: ColumnDef<Book>[] = [
    col.selectColumn(),
    col.textColumn('title', 'Title'),
    col.textColumn('author', 'Author'),
    col.textColumn('publisher', 'Publisher'),
    col.textColumn('slug', 'Slug', { color: 'gray' }),
    col.numberColumn('stock', 'Stock'),
    col.textColumn('category', 'Category'),
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
        New Book
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
      <Flex direction='column'>
        <DataTableHeader title='Books Management' description='Manage library books' actions={tableActions} />
        <DataTableToolbar />
        {tableData.length === 0 ? (
          <DataTableEmpty title='No books found' description='Try adjusting your search or add a new book' />
        ) : (
          <DataTableBody />
        )}
        {tableData.length > 0 && <DataTableFooter />}
      </Flex>
    </DataTableProvider>
  );
}
