// components/datatable/LoanTable.tsx
'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog, Badge, Text } from '@radix-ui/themes';
import { useLoans } from '@/hooks/useLoans';
import { usePanel } from '@/hooks/usePanel';
import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { LoanForm } from './LoanForm';
import type { LoanResponse } from '@/lib/schema/loan';
import { useReturns } from '@/hooks/useReturns';
import { BookCheck, Eye, Pencil } from 'lucide-react';

/* =========================
   STATUS BADGE CONFIG
========================= */

const STATUS_CONFIG = {
  borrowed: { label: 'Borrowed', color: 'blue' as const },
  returned: { label: 'Returned', color: 'green' as const },
  overdue: { label: 'Overdue', color: 'red' as const },
  lost: { label: 'Lost', color: 'orange' as const },
} as const;

type LoanStatus = keyof typeof STATUS_CONFIG;

function StatusBadge({ status }: { status: LoanStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

/* =========================
   VIEW CONTENT
========================= */

function ViewLoanContent({ loan, onClose }: { loan: LoanResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Loan ID</DataList.Label>
          <DataList.Value>#{loan.id}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <StatusBadge status={loan.status as LoanStatus} />
          </DataList.Value>
        </DataList.Item>

        {/* <DataList.Separator /> */}

        <DataList.Item>
          <DataList.Label>Member</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{loan.member?.fullName}</Text>
              <Text size='1' color='gray'>{loan.member?.memberClass} - {loan.member?.memberCode}</Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{loan.book?.title}</Text>
              <Text size='1' color='gray'>by {loan.book?.author}</Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Quantity</DataList.Label>
          <DataList.Value>{loan.quantity}x</DataList.Value>
        </DataList.Item>

        {loan.reservation && (
          <DataList.Item>
            <DataList.Label>Reservation</DataList.Label>
            <DataList.Value>#{loan.reservation.id}</DataList.Value>
          </DataList.Item>
        )}

        {/* <DataList.Separator /> */}

        <DataList.Item>
          <DataList.Label>Loan Date</DataList.Label>
          <DataList.Value>{new Date(loan.loanDate).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Due Date</DataList.Label>
          <DataList.Value>{new Date(loan.dueDate).toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}</DataList.Value>
        </DataList.Item>

        {loan.notes && (
          <>
            {/* <DataList.Separator /> */}
            <DataList.Item>
              <DataList.Label>Notes</DataList.Label>
              <DataList.Value>{loan.notes}</DataList.Value>
            </DataList.Item>
          </>
        )}
      </DataList.Root>

      <Flex gap='3' mt='4' justify='end'>
        <Button variant='soft' onClick={onClose}>
          Close
        </Button>
      </Flex>
    </>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export function LoanTable() {
  const loans = useLoans();
  const returns = useReturns()

  const { mode, selected, open, close } = usePanel<LoanResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = loans.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<LoanResponse>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <Text color='gray'>#{row.original.id}</Text>,
    },
    {
      accessorKey: 'member.fullName',
      header: 'Member',
      cell: ({ row }) => (
        <Flex direction='column'>
          <Text weight='medium'>{row.original.member?.fullName}</Text>
          <Text size='1' color='gray'>{row.original.member?.memberClass}</Text>
        </Flex>
      ),
    },
    {
      accessorKey: 'book.title',
      header: 'Book',
      cell: ({ row }) => (
        <Flex direction='column'>
          <Text>{row.original.book?.title}</Text>
          <Text size='1' color='gray'>{row.original.book?.author}</Text>
        </Flex>
      ),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: ({ row }) => <Text>{row.original.quantity}x</Text>,
    },
    {
      accessorKey: 'loanDate',
      header: 'Loan Date',
      cell: ({ row }) => new Date(row.original.loanDate).toLocaleDateString('id-ID'),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => new Date(row.original.dueDate).toLocaleDateString('id-ID'),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status as LoanStatus} />,
    },
  ];

  const rowActions: () => RowAction<LoanResponse>[] = () => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Eye />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Loan',
      icon: <Pencil />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'return',
      label: 'Mark as Returned',
      icon: <BookCheck/>,
      color: 'green',
      disabled: (row) => row.status === 'returned' || row.status === 'lost',
      onClick: async (row) => {
        if (confirm(`Mark loan #${row.id} as returned?`)) {
          await returns.create.mutateAsync({ loanId: row.id, condition: 'good' });
          refetch();
        }
      },
    },
   
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Loans' },
  ];

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
            await loans.update.mutateAsync({
              id: selected.id,
              data: formData,
            });
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

  const panelTitle = 
    mode === 'add' ? 'Create New Loan' : 
    mode === 'edit' ? 'Edit Loan' : 
    mode === 'view' ? 'Loan Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Loan Management</Heading>
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

      <Panel 
        open={mode !== null} 
        onClose={close} 
        title={panelTitle} 
        width={mode === 'view' ? 500 : 480}
      >
        {renderPanelContent()}
      </Panel>

     
    </Box>
  );
}