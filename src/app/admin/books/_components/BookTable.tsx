'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { useBooks } from '@/hooks/useBooks';
import { usePanel } from '@/hooks/usePanel';
import type { BookResponse } from '@/lib/schema/book';
import { BookForm } from './BookForm';
import { bookColumns } from './Columns';
import { getRowActions } from './RowActions';
import { ViewBookContent } from './ViewBookContent';
import { DeleteBookDialog } from './DeleteBookDialog';

export function BookTable() {
  const { mode, selected, open, close } = usePanel<BookResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<BookResponse | null>(null);

  const books = useBooks();
  const { data, isLoading, refetch } = books.list({
    page,
    search,
    limit,
  });

  const rowActions = getRowActions(open, setDeleteTarget);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await books.remove.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
    refetch();
  };

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <BookForm
          mode='create'
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
          mode='edit'
          onClose={close}
          initialData={{
            title: selected.title,
            author: selected.author,
            publisher: selected.publisher,
            totalStock: selected.totalStock,
            availableStock: selected.availableStock, // ← tambah ini
            year: selected.year,
            isbn: selected.isbn,
            categoryId: selected.categoryId,
            coverUrl: selected.coverUrl,
            coverPublicId: selected.coverPublicId,
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
    <Box>
      <Container size='4' py='6'>
        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Books Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={bookColumns}
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

      <DeleteBookDialog deleteTarget={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />
    </Box>
  );
}
