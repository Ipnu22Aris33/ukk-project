// app/admin/reservations/ReservationTable.tsx
'use client';

import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { useReservations } from '@/hooks/useReservation';
import { usePanel } from '@/hooks/usePanel';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog, Badge, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { ReservationResponse } from '@/lib/schema/reservation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useSession } from '@/hooks/useSession';
import { useAuth } from '@/hooks/useAuth';

/* =========================
   STATUS BADGE CONFIG
========================= */

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'orange' as const },
  approved: { label: 'Approved', color: 'green' as const },
  rejected: { label: 'Rejected', color: 'red' as const },
  cancelled: { label: 'Cancelled', color: 'gray' as const },
  fulfilled: { label: 'Fulfilled', color: 'blue' as const },
  expired: { label: 'Expired', color: 'amber' as const },
} as const;

type ReservationStatus = keyof typeof STATUS_CONFIG;

function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

/* =========================
   VIEW CONTENT
========================= */

function ViewReservationContent({ reservation, onClose }: { reservation: ReservationResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Reservation Code</DataList.Label>
          <DataList.Value>
            <Text weight='bold'>{reservation.reservationCode}</Text>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <StatusBadge status={reservation.status as ReservationStatus} />
          </DataList.Value>
        </DataList.Item>

        {/* <DataList.Separator /> */}

        <DataList.Item>
          <DataList.Label>Member</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{reservation.member?.fullName}</Text>
              <Text size='1' color='gray'>
                {reservation.member?.memberClass} - {reservation.member?.memberCode}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{reservation.book?.title}</Text>
              <Text size='1' color='gray'>
                by {reservation.book?.author}
              </Text>
              <Text size='1' color='gray'>
                Stock: {reservation.book?.totalStock}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Quantity</DataList.Label>
          <DataList.Value>{reservation.quantity}x</DataList.Value>
        </DataList.Item>

        {/* <DataList.Separator /> */}

        <DataList.Item>
          <DataList.Label>Reserved At</DataList.Label>
          <DataList.Value>
            {new Date(reservation.reservedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </DataList.Value>
        </DataList.Item>

        {reservation.approvedAt && (
          <DataList.Item>
            <DataList.Label>Approved At</DataList.Label>
            <DataList.Value>
              {new Date(reservation.approvedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </DataList.Value>
          </DataList.Item>
        )}

        {reservation.approver && (
          <DataList.Item>
            <DataList.Label>Approved By</DataList.Label>
            <DataList.Value>{reservation.approver.username}</DataList.Value>
          </DataList.Item>
        )}

        {reservation.expiresAt && (
          <DataList.Item>
            <DataList.Label>Expires At</DataList.Label>
            <DataList.Value>
              {new Date(reservation.expiresAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </DataList.Value>
          </DataList.Item>
        )}

        {reservation.notes && (
          <>
            {/* <DataList.Separator /> */}
            <DataList.Item>
              <DataList.Label>Notes</DataList.Label>
              <DataList.Value>{reservation.notes}</DataList.Value>
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

export function ReservationTable() {
  const { mode, selected, open, close } = usePanel<ReservationResponse>();
  
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const { session } = useAuth();
  const reservations = useReservations();
  const { data, isLoading, refetch } = reservations.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<ReservationResponse>[] = [
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

  const rowActions: () => RowAction<ReservationResponse>[] = () => {
    const actions: RowAction<ReservationResponse>[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <Icon icon='mdi:eye' />,
        color: 'blue',
        onClick: (row) => open('view', row),
      },
    ];

    // Add approve action for pending reservations
    actions.push({
      key: 'approve',
      label: 'Approve',
      icon: <Icon icon='mdi:check-circle' />,
      color: 'green',
      //   disabled: (row) => row.status !== 'pending',
      onClick: async (row) => {
        if (confirm(`Approve reservation ${row.reservationCode}?`)) {
          await reservations.custom.mutateAsync({
            id: row.id,
            action: 'approve',
            method: 'PATCH',
          });
        }
      },
    });

    // Add reject action for pending reservations
    actions.push({
      key: 'reject',
      label: 'Reject',
      icon: <Icon icon='mdi:close-circle' />,
      color: 'red',
      //   disabled: (row) => row.status !== 'pending',
      onClick: async (row) => {
        if (confirm(`Reject reservation ${row.reservationCode}?`)) {
          await reservations.update.mutateAsync({
            id: row.id,
            data: { status: 'rejected' },
          });
          refetch();
        }
      },
    });

    return actions;
  };

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Reservations' }];

  const renderPanelContent = () => {
    if (mode === 'view' && selected) {
      return <ViewReservationContent reservation={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'view' ? 'Reservation Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Reservations Management</Heading>
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
          showAdd={false} // No add button since reservations are created elsewhere
          showPrint
          showRefresh
        />
      </Container>

      <Panel open={mode === 'view'} onClose={close} title={panelTitle} width={550}>
        {renderPanelContent()}
      </Panel>
    </Box>
  );
}
