'use client';

import { ColDataTable, DataTable } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { useBooks } from '@/hooks/useBooks';
import { Container, Heading, Flex, Box, Text, Button } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { Book, BookResponse } from '@/lib/schema/book';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BookForm } from './BookForm';

type PanelMode = 'add' | 'view' | 'edit' | null;

/* =========================
   VIEW CONTENT
========================= */

function ViewBookContent({ book, onClose }: { book: Book; onClose: () => void }) {
  return (
    <Flex direction="column" gap="3">
      <Text size="2" weight="bold">Title</Text>
      <Text size="2" color="gray">{book.title}</Text>

      <Text size="2" weight="bold" mt="3">Author</Text>
      <Text size="2" color="gray">{book.author}</Text>

      <Text size="2" weight="bold" mt="3">Category</Text>
      <Text size="2" color="gray">{book.categoryId}</Text>

      <Text size="2" weight="bold" mt="3">Stock</Text>
      <Text size="2" color="gray">{book.stock}</Text>

      <Button variant="soft" mt="4" onClick={onClose}>
        Close
      </Button>
    </Flex>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export function BookTable() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<PanelMode>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const books = useBooks();

  const { data, isLoading, refetch } = books.list({
    page,
    search,
    limit: 10,
  });

  const openPanel = (panelMode: PanelMode, book?: Book) => {
    setMode(panelMode);
    if (book) setSelectedBook(book);
  };

  const closePanel = () => {
    setMode(null);
    setSelectedBook(null);
  };

  const columns: ColDataTable<BookResponse>[] = [
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'author', header: 'Author' },
    { accessorKey: 'category.name', header: 'Category' },
    { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'slug', header: 'Slug' },
  ];

  const rowActions = (book: Book) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon="mdi:eye" />,
      onClick: () => openPanel('view', book),
    },
    {
      key: 'edit',
      label: 'Edit Book',
      icon: <Icon icon="mdi:pencil" />,
      onClick: () => openPanel('edit', book),
    },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Books' },
  ];

  /* =========================
     PANEL CONTENT
  ========================= */

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <BookForm
          submitLabel="Save Book"
          onSubmit={async (formData) => {
            await books.create.mutateAsync(formData);
            closePanel();
            refetch();
          }}
        />
      );
    }

    if (mode === 'edit' && selectedBook) {
      return (
        <BookForm
          initialData={selectedBook}
          isUpdate
          submitLabel="Update Book"
          onSubmit={async (formData) => {
            await books.update.mutateAsync({
              id: selectedBook.id,
              data: formData,
            });
            closePanel();
            refetch();
          }}
        />
      );
    }

    if (mode === 'view' && selectedBook) {
      return (
        <ViewBookContent
          book={selectedBook}
          onClose={closePanel}
        />
      );
    }

    return null;
  };

  const panelTitle =
    mode === 'add'
      ? 'Add New Book'
      : mode === 'edit'
      ? 'Edit Book'
      : mode === 'view'
      ? 'Book Details'
      : '';

  return (
    <Box position="relative" minHeight="100vh">
      <Container size="4" py="6">
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify="between" align="center" mb="6">
          <Heading size="8">Books Management</Heading>
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
          onPageChange={setPage}
          rowActions={rowActions}
          enableSearch
          enablePagination
          showAdd
          showPrint
          showRefresh
          onAdd={() => openPanel('add')}
        />
      </Container>

      <Panel
        open={mode !== null}
        onClose={closePanel}
        title={panelTitle}
        width={mode === 'view' ? 500 : 480}
      >
        {renderPanelContent()}
      </Panel>
    </Box>
  );
}