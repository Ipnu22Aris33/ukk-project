// app/admin/books/categories/CategoryTable.tsx
'use client';

import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { useCategories } from '@/hooks/useCategories';
import { usePanel } from '@/hooks/usePanel';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { CategoryResponse } from '@/lib/schema/category';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { CategoryForm } from './CategoryForm';

/* =========================
   VIEW CONTENT
========================= */

function ViewCategoryContent({ category, onClose }: { category: CategoryResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Name</DataList.Label>
          <DataList.Value>{category.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Description</DataList.Label>
          <DataList.Value>{category.description || '-'}</DataList.Value>
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

export function CategoryTable() {
  const categories = useCategories();
  const { mode, selected, open, close } = usePanel<CategoryResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<CategoryResponse | null>(null);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = categories.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<CategoryResponse>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
  ];

  const rowActions: () => RowAction<CategoryResponse>[] = () => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Category',
      icon: <Icon icon='mdi:pencil' />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'delete',
      label: 'Delete Category',
      icon: <Icon icon='mdi:delete' />,
      color: 'red',
      onClick: (row) => setDeleteTarget(row),
    },
  ];

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Books', href: '/admin/books' }, { label: 'Categories' }];

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <CategoryForm
          onClose={close}
          submitLabel='Save Category'
          onSubmit={async (formData) => {
            await categories.create.mutateAsync(formData);
            close();
            refetch();
          }}
        />
      );
    }

    if (mode === 'edit' && selected) {
      return (
        <CategoryForm
          onClose={close}
          initialData={{
            name: selected.name,
            description: selected.description,
          }}
          submitLabel='Update Category'
          onSubmit={async (formData) => {
            await categories.update.mutateAsync({
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
      return <ViewCategoryContent category={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'add' ? 'Add New Category' : mode === 'edit' ? 'Edit Category' : mode === 'view' ? 'Category Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Categories Management</Heading>
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
          onPageSizeChange={(newSize) => setLimit(newSize)}
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
          <AlertDialog.Title>Delete Category</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
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
                  await categories.remove.mutateAsync(deleteTarget.id);
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
