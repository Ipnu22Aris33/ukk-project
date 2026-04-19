'use client';

import { Flex, Text } from '@radix-ui/themes';
import { ColDataTable } from '@/components/features/datatable';
import type { LoanResponse } from '@/lib/schema/loan';
import { StatusBadge, type LoanStatus } from './StatusBadge';

export const loanColumns: ColDataTable<LoanResponse>[] = [
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
        <Text size='1' color='gray'>
          {row.original.member?.memberClass}
        </Text>
      </Flex>
    ),
  },
  {
    accessorKey: 'book.title',
    header: 'Book',
    cell: ({ row }) => (
      <Flex direction='column'>
        <Text>{row.original.book?.title}</Text>
        <Text size='1' color='gray'>
          {row.original.book?.author}
        </Text>
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
