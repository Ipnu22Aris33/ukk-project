// components/datatable/LoanTable.tsx
'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { DataTable, ColDataTable } from '@/components/features/datatable/DataTable';
import { useLoans } from '@/hooks/useLoans';
import type { Loan, LoanResponse } from '@/lib/schema/loan';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function LoanTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const loans = useLoans();

  const { data, isLoading, refetch } = loans.list({
    page,
    search,
    limit: 10,
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
      cell: ({ row }) => (
        <Text>{row.original.quantity}x</Text>
      ),
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
      cell: ({ row }) => {
        const status = row.original.status;
        const config = {
          BORROWED: { label: 'Borrowed', color: 'blue' },
          RETURNED: { label: 'Returned', color: 'green' },
          OVERDUE: { label: 'Overdue', color: 'red' },
          CANCELLED: { label: 'Cancelled', color: 'gray' },
        };
        const statusConfig = config[status as keyof typeof config] || { label: status, color: 'gray' };
        
        return (
          <Text color={statusConfig.color as any}>
            {statusConfig.label}
          </Text>
        );
      },
    },
  ];

  const rowActions = (loan: Loan) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      onClick: () => router.push(`/loans/${loan.id}`),
    },
    {
      key: 'edit',
      label: 'Edit Loan',
      color: 'blue' as const,
      icon: <Icon icon='mdi:pencil' />,
      onClick: () => router.push(`/loans/${loan.id}/edit`),
    },
    {
      key: 'return',
      label: 'Mark as Returned',
      color: 'green' as const,
      icon: <Icon icon='mdi:book-check' />,
      onClick: async () => {
        if (confirm(`Mark loan #${loan.id} as returned?`)) {
          await loans.update.mutateAsync({
            id: loan.id,
            status: 'returned'
          });
          refetch();
        }
      },
    },
    {
      key: 'delete',
      label: 'Delete Loan',
      color: 'red' as const,
      icon: <Icon icon='mdi:delete' />,
      onClick: async () => {
        if (confirm(`Delete loan #${loan.id}?`)) {
          await loans.remove.mutateAsync(loan.id);
          refetch();
        }
      },
    },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Loans' },
  ];

  return (
    <Container size='4'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Flex direction='column' gap='1'>
          <Heading size='8'>Loan Management</Heading>
          <Text size='2' color='gray'>
            Total {data?.meta?.total || 0} loans
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
        showAdd={false}
        showRefresh={true}
        showPrint={true}
        rowActions={rowActions}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        enablePageSize={true}
        enableContextMenu={true}
        emptyMessage='No loans found'
      />
    </Container>
  );
}