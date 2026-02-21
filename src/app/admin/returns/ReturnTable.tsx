// components/datatable/ReturnTable.tsx
'use client';

import React, { useState } from 'react';
import { Container, Heading, Flex, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { DataTable, ColDataTable } from '@/components/features/datatable/DataTable';
import { useReturns } from '@/hooks/useReturns';
import { useLoans } from '@/hooks/useLoans';
import type { ReturnResponse } from '@/lib/schema/return';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function ReturnTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loanSearch, setLoanSearch] = useState('');

  const returns = useReturns();
  const loans = useLoans();

  const { data, isLoading, refetch } = returns.list({
    page,
    search,
    limit: 10,
  });

  const loanList = loans.list({
    page: 1,
    limit: 100,
    search: loanSearch,
  });

  const loanOptions = (loanList.data?.data || []).map((loan) => ({
    value: String(loan.id),
    label: `Loan #${loan.id} - ${loan.memberId}`,
  }));

  const columns: ColDataTable<ReturnResponse>[] = [
    {
      accessorKey: 'id',
      header: 'Return ID',
    },
    {
      accessorKey: 'member.fullName',
      header: 'Member',
    },
    {
      accessorKey: 'fineAmount',
      header: 'Fine Amount',
      cell: ({ row }) => (
        <Text>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(row.original.fineAmount || 0)}
        </Text>
      ),
    },
    {
      accessorKey: 'fineStatus',
      header: 'Fine Status',
      cell: ({ row }) => {
        const status = row.original.fineStatus;
        const colors: Record<string, "green" | "red" | "gray"> = {
          PAID: 'green',
          UNPAID: 'red',
          WAIVED: 'gray',
        };
        const color: "green" | "red" | "gray" = colors[status as keyof typeof colors] ?? 'gray';
        return (
          <Text color={color}>
            {status}
          </Text>
        );
      },
    },
    {
      accessorKey: 'book.title',
      header: 'Book Title',
    },
    {
      accessorKey: 'book.author',
      header: 'Author',
    },
    {
      accessorKey: 'loan.status',
      header: 'Loan Status',
      cell: ({ row }) => {
        const status = row.original.loan?.status;
        const colors: Record<string, "green" | "red" | "gray" | "blue"> = {
          ACTIVE: 'blue',
          RETURNED: 'green',
          OVERDUE: 'red',
        };
        const color: "green" | "red" | "gray" | "blue" = colors[status as keyof typeof colors] ?? 'gray';
        return (
          <Text color={color}>
            {status}
          </Text>
        );
      },
    },
    {
      accessorKey: 'returnedAt',
      header: 'Return Date',
      cell: ({ row }) => new Date(row.original.returnedAt).toLocaleDateString('id-ID'),
    },
  ];

  const rowActions = (returnData: ReturnResponse) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      onClick: () => router.push(`/returns/${returnData.id}`),
    },
    {
      key: 'edit',
      label: 'Edit Return',
      color: 'blue' as const,
      icon: <Icon icon='mdi:pencil' />,
      onClick: () => router.push(`/returns/${returnData.id}/edit`),
    },
    {
      key: 'delete',
      label: 'Delete Return',
      color: 'red' as const,
      icon: <Icon icon='mdi:delete' />,
      onClick: async () => {
        if (confirm(`Delete return #${returnData.id}?`)) {
          await returns.remove.mutateAsync(returnData.id);
          refetch();
        }
      },
    },
  ];

  const handleCreate = () => {
    router.push('/admin/returns/create');
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Returns' },
  ];

  return (
    <Container size='4'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Flex direction='column' gap='1'>
          <Heading size='8'>Returns Management</Heading>
          <Text size='2' color='gray'>
            Total {data?.meta?.total || 0} returns
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
        emptyMessage='No returns found'
      />
    </Container>
  );
}