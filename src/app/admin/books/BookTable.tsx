'use client';

import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { useBooks } from '@/hooks/useBooks';
import { usePanel } from '@/hooks/usePanel';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { BookResponse } from '@/lib/schema/book';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BookForm } from './BookForm';

/* =========================
   VIEW CONTENT
========================= */

function ViewBookContent({ book, onClose }: { book: BookResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Title</DataList.Label>
          <DataList.Value>{book.title}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Author</DataList.Label>
          <DataList.Value>{book.author}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Category</DataList.Label>
          <DataList.Value>{book.category.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Publisher</DataList.Label>
          <DataList.Value>{book.publisher}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>ISBN</DataList.Label>
          <DataList.Value>{book.isbn}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Year</DataList.Label>
          <DataList.Value>{book.year}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Stock</DataList.Label>
          <DataList.Value>{book.stock}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Slug</DataList.Label>
          <DataList.Value>{book.slug}</DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button mt='4' variant='soft' onClick={onClose}>
        Close
      </Button>
    </>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export function BookTable() {
  const books = useBooks();
  const { mode, selected, open, close } = usePanel<BookResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<BookResponse | null>(null);

  const { data, isLoading, refetch } = books.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<BookResponse>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'author', header: 'Author' },
    { accessorKey: 'category.name', header: 'Category' },
    { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'slug', header: 'Slug' },
  ];

  const rowActions: () => RowAction<BookResponse>[] = () => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Book',
      icon: <Icon icon='mdi:pencil' />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'delete',
      label: 'Delete Book',
      icon: <Icon icon='mdi:delete' />,
      color: 'red',
      onClick: (row) => setDeleteTarget(row),
    },
  ];

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Books' }];

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <BookForm
          submitLabel='Save Book'
          onClose={close}
          onSubmit={async (formData) => {
            await books.create.mutateAsync(formData);
            close();
            refetch();
          }}
        />
      );
    }

    if (mode === 'edit' && selected) {
      return (
        <BookForm
        onClose={close}
          initialData={{
            title: selected.title,
            author: selected.author,
            publisher: selected.publisher,
            stock: selected.stock,
            year: selected.year,
            isbn: selected.isbn,
            categoryId: selected.categoryId,
          }}
          submitLabel='Update Book'
          onSubmit={async (formData) => {
            await books.update.mutateAsync({
              id: selected.id,
              data: formData,
            });
            close();
            refetch();
          }}
        />
      );
    }

    if (mode === 'view' && selected) {
      return <ViewBookContent book={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'add' ? 'Add New Book' : mode === 'edit' ? 'Edit Book' : mode === 'view' ? 'Book Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Books Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          meta={data?.meta}
          isLoading={isLoading}
          onRefresh={refetch}
          searchValue={search}
          onSearchChange={setSearch}
          page={page}
          onPageSizeChange={(newSize) => setLimit(newSize)}
          onPageChange={setPage}
          rowActions={rowActions}
          enableSearch
          enablePagination
          showAdd
          showPrint
          showRefresh
          onAdd={() => open('add')}
        />
      </Container>

      <Panel open={mode !== null} onClose={close} title={panelTitle} width={mode === 'view' ? 500 : 480}>
        {renderPanelContent()}
      </Panel>

      <AlertDialog.Root
        open={!!deleteTarget}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
      >
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Delete Book</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
          </AlertDialog.Description>

          <Flex gap='3' mt='4' justify='end'>
            <AlertDialog.Cancel>
              <Button variant='soft' color='gray'>
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action>
              <Button
                color='red'
                onClick={async () => {
                  if (!deleteTarget) return;
                  await books.remove.mutateAsync(deleteTarget.id);
                  setDeleteTarget(null);
                  refetch();
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
}
