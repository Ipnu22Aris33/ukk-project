'use client';

import { Flex, Text } from '@radix-ui/themes';
import { ColDataTable } from '@/components/features/datatable';
import type { ReturnResponse } from '@/lib/schema/return';
import { FineStatusBadge, type FineStatus, ConditionBadge, type ConditionStatus } from './StatusBadge';

export const returnColumns: ColDataTable<ReturnResponse>[] = [
  {
    accessorKey: 'id',
    header: 'Return ID',
    cell: ({ row }) => <Text color='gray'>#{row.original.id}</Text>,
  },
  {
    accessorKey: 'loan.member.fullName',
    header: 'Member',
    cell: ({ row }) => (
      <Flex direction='column'>
        <Text weight='medium'>{row.original.loan?.member?.fullName}</Text>
        <Text size='1' color='gray'>
          {row.original.loan?.member?.memberClass}
        </Text>
      </Flex>
    ),
  },
  {
    accessorKey: 'loan.book.title',
    header: 'Book',
    cell: ({ row }) => (
      <Flex direction='column'>
        <Text>{row.original.loan?.book?.title}</Text>
        <Text size='1' color='gray'>
          {row.original.loan?.book?.author}
        </Text>
      </Flex>
    ),
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
    cell: ({ row }) => <FineStatusBadge status={row.original.fineStatus as FineStatus} />,
  },
  {
    accessorKey: 'condition',
    header: 'Condition',
    cell: ({ row }) => <ConditionBadge status={row.original.condition as ConditionStatus} />,
  },
  {
    accessorKey: 'returnedAt',
    header: 'Return Date',
    cell: ({ row }) => new Date(row.original.returnedAt).toLocaleDateString('id-ID'),
  },
];
