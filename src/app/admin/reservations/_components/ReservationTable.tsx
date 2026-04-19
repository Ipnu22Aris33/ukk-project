'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { useReservations } from '@/hooks/useReservation';
import { usePanel } from '@/hooks/usePanel';
import type { ReservationResponse } from '@/lib/schema/reservation';
import { reservationColumns } from './Columns';
import { getRowActions } from './RowActions';
import { ViewReservationContent } from './ViewReservationContent';
import { PickedUpDialog, CancelDialog, RejectDialog } from './ReservationActionDialogs';

export function ReservationTable() {
  const { mode, selected, open, close } = usePanel<ReservationResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pickedUpTarget, setPickedUpTarget] = useState<ReservationResponse | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ReservationResponse | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReservationResponse | null>(null);

  const reservations = useReservations();
  const { data, isLoading, refetch } = reservations.list({ page, search, limit });

  const { isPending: isPickingUp } = reservations.custom;
  const { isPending: isUpdating } = reservations.update;

  const handlePickedUp = async () => {
    if (!pickedUpTarget) return;
    try {
      await reservations.custom.mutateAsync({
        id: pickedUpTarget.id,
        action: 'picked_up',
        method: 'PATCH',
      });
      setPickedUpTarget(null);
      refetch();
    } catch {}
  };

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      await reservations.custom.mutateAsync({
        id: cancelTarget.id,
        action: 'cancel',
        method: 'PATCH',
      });
      
      setCancelTarget(null);
      refetch();
    } catch {}
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      await reservations.custom.mutateAsync({
        id: rejectTarget.id,
        action: 'reject',
        method: 'PATCH',
      });
      setRejectTarget(null);
      refetch();
    } catch {}
  };

  const rowActions = getRowActions({
    open,
    setPickedUpTarget,
    setCancelTarget,
    setRejectTarget,
  });

  return (
    <Box>
      <Container size='4' py='6'>
        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Reservations Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={reservationColumns}
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
          showAdd={false}
          showPrint
          showRefresh
          printConfig={{
            title: 'Laporan Reservasi Buku',
            institution: 'SMA Negeri 1 Kediri',
            subtitle: 'Perpustakaan',
            period: 'Semester Genap 2024/2025',
          }}
        />
      </Container>

      <Panel open={mode === 'view'} onClose={close} title='Reservation Details' width={550}>
        {mode === 'view' && selected && <ViewReservationContent reservation={selected} onClose={close} />}
      </Panel>

      {pickedUpTarget && (
        <PickedUpDialog
          reservation={pickedUpTarget}
          open={!!pickedUpTarget}
          onClose={() => setPickedUpTarget(null)}
          onConfirm={handlePickedUp}
          isLoading={isPickingUp}
        />
      )}

      {cancelTarget && (
        <CancelDialog
          reservation={cancelTarget}
          open={!!cancelTarget}
          onClose={() => setCancelTarget(null)}
          onConfirm={handleCancel}
          isLoading={isUpdating}
        />
      )}

      {rejectTarget && (
        <RejectDialog
          reservation={rejectTarget}
          open={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleReject}
          isLoading={isUpdating}
        />
      )}
    </Box>
  );
}
