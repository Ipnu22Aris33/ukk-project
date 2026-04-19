'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { useCategories } from '@/hooks/useCategories';
import { usePanel } from '@/hooks/usePanel';
import type { CategoryResponse } from '@/lib/schema/category';
import { CategoryForm } from './CategoryForm';
import { categoryColumns } from './Columns';
import { getRowActions } from './RowActions';
import { ViewCategoryContent } from './ViewCategoryContent';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';

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

  const rowActions = getRowActions(open, setDeleteTarget);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await categories.remove.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
    refetch();
  };

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
    <Box>
      <Container size='4' py='6'>
        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Categories Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={categoryColumns}
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

      <DeleteCategoryDialog deleteTarget={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeleteConfirm} />
    </Box>
  );
}
