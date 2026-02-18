'use client';

import { useState } from 'react';
import { Button, Flex, Dialog, Box } from '@radix-ui/themes';
import { ReloadIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField } from '@/components/features/forms';
import { ColumnFactory, DataTableProvider, DataTableHeader, DataTableToolbar, DataTableBody, DataTableFooter } from '@/components/features/datatable';
import { useDataTable } from '@/hooks/useDataTable';
import { useBooks } from '@/hooks/useBooks';
import { useCategory } from '@/hooks/useCategory';
import { Icon } from '@iconify/react';
import type { ColumnDef } from '@tanstack/react-table';
import { BookAlert } from './BookAlert';
import { BookModal } from './BookModal';

interface Book {
  id_book: string;
  title: string;
  author: string;
  publisher: string;
  slug: string;
  stock: number;
  year: number;
  isbn: string;
  category: number;
  category_id: number;
}

export function BookTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { list, create, remove, update } = useBooks({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  const { list: categoryList } = useCategory({
    page: 1,
    limit: 100,
    search: categorySearch,
    debounceMs: 400,
  });

  const tableData = list.data?.data ?? [];
  const metaData = list.data?.meta;
  const isLoading = list.isLoading;
  const refetch = list.refetch;

  const categoryOptions = (categoryList.data?.data || []).map((cat) => ({
    value: String(cat.id_category),
    label: cat.name,
  }));

  const col = ColumnFactory<Book>();

  const columns: ColumnDef<Book>[] = [
    col.selectColumn(),
    col.textColumn('title', 'Title', { weight: 'medium' }),
    col.textColumn('author', 'Author'),
    col.textColumn('publisher', 'Publisher'),
    col.numberColumn('year', 'Year'),
    col.textColumn('isbn', 'ISBN', { color: 'gray' }),
    col.textColumn('slug', 'Slug', { color: 'gray' }),
    col.numberColumn('stock', 'Stock'),
    col.textColumn('category', 'Category'),
    col.actionsColumn({
      useDefault: true,
      handlers: {
        view: (row) => console.log('view', row),
        edit: (row) => {
          setSelectedBook(row);
          setEditOpen(true);
        },
        delete: (row) => {
          setSelectedId(row.id_book);
          setDeleteOpen(true);
        },
      },
    }),
  ];

  const handleConfirmDelete = async () => {
    if (!selectedId) return;

    await remove.mutateAsync(selectedId);
    setDeleteOpen(false);
    setSelectedId(null);
  };

  const handleUpdate = async (data: any, id: string) => {
    await update.mutateAsync({ id, ...data });
    setEditOpen(false);
    setSelectedBook(null);
    refetch();
  };

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  const form = useForm({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      stock: 1,
      year: new Date().getFullYear(),
      isbn: '',
      category_id: '',
    },
    onSubmit: async ({ value }) => {
      await create.mutateAsync({
        ...value,
        category_id: Number(value.category_id),
        year: Number(value.year),
        stock: Number(value.stock),
      });

      setDialogOpen(false);
      form.reset();
      setCategorySearch('');
      refetch();
    },
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

      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            form.reset();
            setCategorySearch('');
          }
        }}
      >
        <Dialog.Trigger>
          <Button variant='solid' size='2'>
            <PlusIcon />
            New Book
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Create New Book</Dialog.Title>
          <Dialog.Description size='2' mb='4'>
            Fill in book information below
          </Dialog.Description>

          <Form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Box className='space-y-4'>
              <form.Field name='title'>
                {(field) => <InputField field={field} label='Title' placeholder='Enter book title...' icon={<Icon icon='mdi:book' />} />}
              </form.Field>

              <form.Field name='author'>
                {(field) => <InputField field={field} label='Author' placeholder='Enter author name...' icon={<Icon icon='mdi:account-edit' />} />}
              </form.Field>

              <form.Field name='publisher'>
                {(field) => (
                  <InputField field={field} label='Publisher' placeholder='Enter publisher name...' icon={<Icon icon='mdi:office-building' />} />
                )}
              </form.Field>

              <form.Field
                name='isbn'
                validators={{
                  onChange: ({ value }) => {
                    if (value.length < 10) return 'ISBN tidak valid';
                    return undefined;
                  },
                }}
              >
                {(field) => <InputField field={field} label='ISBN' placeholder='Enter ISBN number...' icon={<Icon icon='mdi:barcode' />} />}
              </form.Field>

              <form.Field
                name='year'
                validators={{
                  onChange: ({ value }) => {
                    if (value < 1900) return 'Year tidak valid';
                    if (value > new Date().getFullYear()) return 'Year tidak boleh melebihi tahun sekarang';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <InputField field={field} label='Year' type='number' placeholder='Enter publication year...' icon={<Icon icon='mdi:calendar' />} />
                )}
              </form.Field>

              <form.Field name='stock'>
                {(field) => (
                  <InputField
                    field={field}
                    label='Stock'
                    type='number'
                    placeholder='Enter stock quantity...'
                    required
                    icon={<Icon icon='mdi:counter' />}
                  />
                )}
              </form.Field>

              <form.Field name='category_id'>
                {(field) => (
                  <SelectField
                    field={field}
                    label='Category'
                    options={categoryOptions}
                    placeholder='Select a category...'
                    required
                    searchable
                    search={categorySearch}
                    onSearchChange={setCategorySearch}
                    icon={<Icon icon='mdi:shape' />}
                  />
                )}
              </form.Field>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type='submit' variant='solid' disabled={!canSubmit} loading={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Book'}
                    </Button>
                  </Flex>
                )}
              </form.Subscribe>
            </Box>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>
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
        <DataTableHeader title='Books Management' description='Manage library books' />
        <DataTableToolbar actions={tableActions} />
        <DataTableBody />
        <DataTableFooter />
      </Flex>
      <BookAlert open={deleteOpen} onOpenChange={setDeleteOpen} onConfirm={handleConfirmDelete} loading={remove.isPending} />
      <BookModal
        open={editOpen}
        onOpenChange={setEditOpen}
        book={selectedBook}
        onSubmit={handleUpdate}
        loading={update.isPending}
        categoryOptions={categoryOptions}
        categorySearch={categorySearch}
        setCategorySearch={setCategorySearch}
      />
    </DataTableProvider>
  );
}
