'use client';

import React, { useState } from 'react';
import { PlusIcon, DownloadIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Button, Flex } from '@radix-ui/themes';
import { ColumnFactory } from '@/components/features/datatable/ColumnFactory';
import { DataTableProvider } from '@/components/features/datatable/DataTableProvider';
import { DataTableHeader } from '@/components/features/datatable/DataTableHeader';
import { DataTableToolbar } from '@/components/features/datatable/DataTableToolbar';
import { DataTableBody } from '@/components/features/datatable/DataTableBody';
import { DataTableFooter } from '@/components/features/datatable/DataTableFooter';
import { DataTableEmpty } from '@/components/features/datatable/DataTableEmpty';
import { AppIcon } from '@/components/ui/AppIcon';
import { useDataTable } from '@/hooks/useDataTable';
import { useCategories } from '@/hooks/useCategories';
import type { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/lib/models/category';

export function CategoryTable() {
  // =========================
  // PAGINATION STATE
  // =========================
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // =========================
  // SEARCH STATE
  // =========================
  const [search, setSearch] = useState('');

  // =========================
  // FETCH DATA
  // =========================
  const categories = useCategories();
  const categoryList = categories.list({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  const { remove, create } = categories;

  const tableData = categoryList.data?.data ?? [];
  const metaData = categoryList.data?.meta;
  const isLoading = categoryList.isLoading;
  const refetch = categoryList.refetch;

  // =========================
  // COLUMN DEFINITIONS
  // =========================
  const col = ColumnFactory<Category>();

  const columns: ColumnDef<Category>[] = [
    col.selectColumn(),
    col.textColumn('name', 'Name', { weight: 'medium' }),
    col.textColumn('slug', 'Slug', { color: 'gray' }),
    col.textColumn('description', 'Description'),
    col.actionsColumn({
      useDefault: true,
      handlers: {
        view: (row) => console.log('View', row),
        edit: (row) => console.log('Edit', row),
        delete: (row) => remove.mutateAsync(row.id_category),
      },
    }),
  ];

  // =========================
  // TABLE INSTANCE
  // =========================
  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  // =========================
  // TABLE ACTIONS
  // =========================
  const tableActions = (
    <>
      <Button variant='soft' size='2' onClick={() => window.print()}>
        <AppIcon name='UitPrint' />
        Print
      </Button>

      <Button variant='soft' size='2' onClick={() => refetch()} disabled={isLoading}>
        <ReloadIcon className={isLoading ? 'animate-spin' : ''} />
        Refresh
      </Button>

      <Button variant='soft' size='2'>
        <DownloadIcon />
        Export
      </Button>

      <Button variant='solid' size='2'>
        <PlusIcon />
        New Category
      </Button>
    </>
  );

  // =========================
  // CONTEXT VALUE
  // =========================
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

  // =========================
  // RENDER
  // =========================
  return (
    <DataTableProvider value={dataTableState}>
      <Flex direction='column'>
        <DataTableHeader title='Categories' description='Manage book categories' />
        <DataTableToolbar actions={tableActions} />
        {tableData.length === 0 ? (
          <DataTableEmpty title='No categories found' description='Try adjusting your search or add a new category' />
        ) : (
          <DataTableBody />
        )}
        {tableData.length > 0 && <DataTableFooter />}
      </Flex>
    </DataTableProvider>
  );
}
