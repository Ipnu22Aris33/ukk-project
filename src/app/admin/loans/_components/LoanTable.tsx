'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { useLoans } from '@/hooks/useLoans';
import { usePanel } from '@/hooks/usePanel';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { LoanForm } from './LoanForm';
import { ReturnFormDialog } from './ReturnFormDialog';
import { loanColumns } from './Columns';
import { getRowActions } from './RowActions';
import { ViewLoanContent } from './ViewLoanContent';
import type { LoanResponse } from '@/lib/schema/loan';

export function LoanTable() {
  const loans = useLoans();
  const { mode, selected, open, close } = usePanel<LoanResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [returnTarget, setReturnTarget] = useState<LoanResponse | null>(null);

  const { data, isLoading, refetch } = loans.list({ page, search, limit });

  const handleReturnSubmit = async (formData: { condition: string; notes: string }) => {
    if (!returnTarget) return;
    await loans.custom.mutateAsync({
      id: returnTarget.id,
      action: 'return',
      method: 'POST',
      body: formData,
    });
    setReturnTarget(null);
    refetch();
  };

  const rowActions = getRowActions(open, setReturnTarget);

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <LoanForm
          submitLabel='Create Loan'
          onSubmit={async (formData) => {
            await loans.create.mutateAsync(formData);
            close();
            refetch();
          }}
          onClose={close}
        />
      );
    }

    if (mode === 'edit' && selected) {
      return (
        <LoanForm
          initialData={{
            memberId: selected.memberId,
            bookId: selected.bookId,
            quantity: selected.quantity,
            loanDate: new Date(selected.loanDate),
            dueDate: new Date(selected.dueDate),
            notes: selected.notes || '',
            status: selected.status,
          }}
          submitLabel='Update Loan'
          isUpdate={true}
          onSubmit={async (formData) => {
            await loans.update.mutateAsync({ id: selected.id, data: formData });
            close();
            refetch();
          }}
          onClose={close}
        />
      );
    }

    if (mode === 'view' && selected) {
      return <ViewLoanContent loan={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'add' ? 'Create New Loan' : mode === 'edit' ? 'Edit Loan' : mode === 'view' ? 'Loan Details' : '';

  return (
    <Box>
      <Container size='4' py='6'>

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Loan Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={loanColumns}
          meta={data?.meta}
          isLoading={isLoading}
          onRefresh={refetch}
          searchValue={search}
          onSearchChange={setSearch}
          page={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
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

      {returnTarget && (
        <ReturnFormDialog loan={returnTarget} open={!!returnTarget} onClose={() => setReturnTarget(null)} onSubmit={handleReturnSubmit} />
      )}
    </Box>
  );
}
