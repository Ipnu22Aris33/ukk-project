'use client';

import { Flex, Text } from '@radix-ui/themes';
import { ColDataTable } from '@/components/features/datatable';
import type { ReservationResponse } from '@/lib/schema/reservation';
import { StatusBadge, type ReservationStatus } from './StatusBadge';

export const reservationColumns: ColDataTable<ReservationResponse>[] = [
  {
    accessorKey: 'reservationCode',
    header: 'Reservation Code',
    cell: ({ row }) => <Text weight='medium'>{row.original.reservationCode}</Text>,
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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status as ReservationStatus} />,
  },
  {
    accessorKey: 'reservedAt',
    header: 'Reserved At',
    cell: ({ row }) => new Date(row.original.reservedAt).toLocaleDateString('id-ID'),
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    cell: ({ row }) => (row.original.expiresAt ? new Date(row.original.expiresAt).toLocaleDateString('id-ID') : '-'),
  },
];
