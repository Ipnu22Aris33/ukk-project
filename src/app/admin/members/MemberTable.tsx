// components/datatable/MemberTable.tsx
'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { DataTable, ColDataTable } from '@/components/features/datatable/DataTable';
import { useMembers } from '@/hooks/useMembers';
import type { Member } from '@/lib/schema/member';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export function MemberTable() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const members = useMembers();

  const { data, isLoading, refetch } = members.list({
    page,
    search,
    limit: 10,
  });

  const columns: ColDataTable<Member>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <Text color='gray'>{row.original.id}</Text>,
    },
    {
      accessorKey: 'fullName',
      header: 'Name',
      cell: ({ row }) => <Text weight='medium'>{row.original.fullName}</Text>,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'memberClass',
      header: 'Class',
    },
    {
      accessorKey: 'major',
      header: 'Major',
    },
    
    {
      accessorKey: 'createdAt',
      header: 'Registered',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('id-ID'),
    },
  ];

  const rowActions = (member: Member) => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      onClick: () => router.push(`/members/${member.id}`),
    },
    {
      key: 'edit',
      label: 'Edit Member',
      color: 'blue' as const,
      icon: <Icon icon='mdi:pencil' />,
      onClick: () => router.push(`/members/${member.id}/edit`),
    },
    {
      key: 'delete',
      label: 'Delete Member',
      color: 'red' as const,
      icon: <Icon icon='mdi:delete' />,
      onClick: async () => {
        if (confirm(`Delete member "${member.fullName}"?`)) {
          await members.remove.mutateAsync(member.id);
          refetch();
        }
      },
    },
  ];

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Members' }];

  return (
    <Container size='4'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Flex direction='column' gap='1'>
          <Heading size='8'>Member Management</Heading>
          <Text size='2' color='gray'>
            Total {data?.meta?.total || 0} members
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
        showAdd={false} // Create functionality will be added later
        showRefresh={true}
        showPrint={true}
        rowActions={rowActions}
        enableSearch={true}
        enablePagination={true}
        enableSorting={true}
        enablePageSize={true}
        enableContextMenu={true}
        emptyMessage='No members found'
      />
    </Container>
  );
}
