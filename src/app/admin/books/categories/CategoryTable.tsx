'use client';

import React, { useState } from 'react';
import { Container, Heading, Flex, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { DataTable, ColDataTable } from '@/components/features/datatable/DataTable';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/lib/schema/category';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function CategoryTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const categories = useCategories();
  const { remove } = categories;

  const { data, isLoading, refetch } = categories.list({
    page,
    search,
    limit: 10,
  });

  const columns: ColDataTable<Category>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ];

  const rowActions = (category: Category) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      onClick: () => router.push(`/categories/${category.id}`),
    },
    {
      key: 'edit',
      label: 'Edit Category',
      color: 'blue' as const,
      icon: <Icon icon='mdi:pencil' />,
      onClick: () => router.push(`/categories/${category.id}/edit`),
    },
    {
      key: 'delete',
      label: 'Delete Category',
      color: 'red' as const,
      icon: <Icon icon='mdi:delete' />,
      onClick: async () => {
        if (confirm(`Delete category "${category.name}"?`)) {
          await remove.mutateAsync(category.id);
          refetch();
        }
      },
    },
  ];

  const handleCreate = () => {
    router.push('/admin/categories/create');
  };

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Categories' }];

  return (
    <Container size='4'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Flex direction='column' gap='1'>
          <Heading size='8'>Categories</Heading>
          <Text size='2' color='gray'>
            Total {data?.meta?.total || 0} categories
          </Text>
        </Flex>
      </Flex>

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
        emptyMessage='No categories found'
      />
    </Container>
  );
}
