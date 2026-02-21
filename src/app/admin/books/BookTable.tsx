// app/books/page.tsx
'use client';

import { ColDataTable, DataTable } from '@/components/features/datatable/DataTable';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { Container, Heading, Flex, Button, Box, Text } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Book, BookResponse } from '@/lib/schema/book';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function BookTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categorySearch, setCategorySearch] = useState('');

  const books = useBooks();
  const categories = useCategories();

  const { data, isLoading, refetch } = books.list({
    page,
    search,
    limit: 10,
  });

  const categoryList = categories.list({
    page: 1,
    limit: 100,
    search: categorySearch,
  });

  const categoryOptions = (categoryList.data?.data || []).map((cat) => ({
    value: String(cat.id),
    label: cat.name,
  }));

  const columns: ColDataTable<BookResponse>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'author',
      header: 'Author',
    },
    {
      accessorKey: 'category.name',
      header: 'Category',
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
  ];

  const rowActions = (book: Book) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      onClick: () => router.push(`/books/${book.id}`),
    },
    {
      key: 'edit',
      label: 'Edit Book',
      color: 'blue' as const,
      icon: <Icon icon='mdi:pencil' />,
      onClick: () => router.push(`/books/${book.id}/edit`),
    },
    {
      key: 'delete',
      label: 'Delete Book',
      color: 'red' as const,
      icon: <Icon icon='mdi:delete' />,
      onClick: async () => {
        if (confirm(`Delete "${book.title}"?`)) {
          await books.remove.mutateAsync(book.id);
          refetch();
        }
      },
    },
  ];

  // Handler untuk navigasi ke halaman create
  const handleCreate = () => {
    router.push('/admin/books/create');
  };

  // Breadcrumb items
  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Books' }];

  return (
    <Container size='4'>
      {/* Breadcrumb - Taruh di sini */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <Flex justify='between' align='center' mb='6'>
        <Flex direction='column' gap='1'>
          <Heading size='8'>Books Management</Heading>
          <Text size='2' color='gray'>
            Total {data?.meta?.total || 0} books
          </Text>
        </Flex>
      </Flex>

      {/* Data Table */}
      <DataTable
        data={data?.data ?? []}
        columns={columns}
        meta={data?.meta}
        isLoading={isLoading}
        onRefresh={() => refetch()}
        searchValue={search}
        onSearchChange={setSearch}
        page={page}
        onPageChange={setPage}
        onAdd={handleCreate}
        showAdd={true}
        showRefresh={true}
        showPrint={true}
        rowActions={rowActions}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        enablePageSize={true}
        enableContextMenu={true}
        emptyMessage='No books found'
      />
    </Container>
  );
}
