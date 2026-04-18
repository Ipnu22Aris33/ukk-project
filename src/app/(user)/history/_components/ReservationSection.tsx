// app/riwayat/components/ReservasiSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Button, Tooltip, Spinner, Dialog, Callout } from '@radix-ui/themes';
import { CalendarIcon, TimerIcon, Cross2Icon, EyeOpenIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useReservations } from '@/hooks/useReservation';

export function ReservationSection() {
  const reservations = useReservations();
  const { data, isLoading } = reservations.list({ page: 1, limit: 10 });

  const [selected, setSelected] = useState<any>(null);
  const [toCancel, setToCancel] = useState<any>(null); // reservation yang mau dibatalkan
  const [cancelError, setCancelError] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('id-ID');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'picked_up':
        return <Badge color='green'>Diambil</Badge>;
      case 'pending':
        return <Badge color='amber'>Menunggu</Badge>;
      case 'borrowed':
        return <Badge color='blue'>Dipinjam</Badge>;
      case 'cancelled':
        return <Badge color='red'>Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleCancelConfirm = async () => {
    setCancelError(null);
    try {
      await reservations.custom.mutateAsync({
        id: toCancel.id,
        action: 'cancel',
        method: 'PATCH',
      });
      setToCancel(null);
    } catch (err: any) {
      setCancelError(err.message ?? 'Gagal membatalkan reservasi, coba lagi.');
    }
  };

  const handleCancelClose = (open: boolean) => {
    if (!open) {
      setToCancel(null);
      setCancelError(null);
    }
  };

  if (isLoading) {
    return (
      <Card size='3'>
        <Flex justify='center' py='8'>
          <Spinner size='3' />
        </Flex>
      </Card>
    );
  }

  const sortedReservations = [...(data?.data || [])].sort((a: any, b: any) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <>
      <Card size='3'>
        <Flex direction='column' gap='4'>
          <Heading size='4'>Reservasi Saya</Heading>

          <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap='4'>
            {sortedReservations.map((reservation: any) => {
              const status = reservation.status;

              return (
                <Card key={reservation.id} size='2'>
                  <Flex direction='column' gap='3'>
                    {/* HEADER: cover + judul + status */}
                    <Flex gap='3' align='start'>
                      <Box
                        style={{
                          width: 52,
                          height: 72,
                          borderRadius: 'var(--radius-3)',
                          overflow: 'hidden',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        {reservation.book?.coverUrl ? (
                          <Image src={reservation.book.coverUrl} alt={reservation.book.title} fill style={{ objectFit: 'cover' }} />
                        ) : (
                          <Box style={{ width: '100%', height: '100%', background: 'var(--gray-9)' }} />
                        )}
                      </Box>

                      <Box style={{ flex: 1, minWidth: 0 }}>
                        <Flex justify='between' align='start' gap='2' mb='1'>
                          <Text
                            size='2'
                            weight='bold'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              lineHeight: 1.4,
                              flex: 1,
                            }}
                          >
                            {reservation.book?.title}
                          </Text>
                          {getStatusBadge(status)}
                        </Flex>
                        <Text size='1' color='gray'>
                          {reservation.book?.author}
                        </Text>
                      </Box>
                    </Flex>

                    {/* DATE INFO: dua kolom */}
                    <Grid columns={{initial: '1', md: '2'}} gap='2'>
                      <Box style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)', padding: '8px 10px' }}>
                        <Flex align='center' gap='1' mb='1'>
                          <CalendarIcon width='11' height='11' />
                          <Text size='1' color='gray'>
                            Reservasi
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium'>
                          {formatDateTime(reservation.reservedAt)}
                        </Text>
                      </Box>

                      <Box style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)', padding: '8px 10px' }}>
                        <Flex align='center' gap='1' mb='1'>
                          <TimerIcon width='11' height='11' />
                          <Text size='1' color='gray'>
                            Expiry
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium'>
                          {formatDateTime(reservation.expiresAt)}
                        </Text>
                      </Box>
                    </Grid>

                    {/* ACTIONS */}
                    <Flex gap='2'>
                      {status === 'picked_up' ? (
                        <Button size='2' style={{ flex: 1 }} onClick={() => setSelected(reservation)}>
                          <EyeOpenIcon /> Detail
                        </Button>
                      ) : (
                        <>
                          <Button size='2' variant='soft' style={{ flex: 1 }} onClick={() => setSelected(reservation)}>
                            <EyeOpenIcon /> Detail
                          </Button>

                          {status === 'pending' && (
                            <Tooltip content='Batalkan reservasi'>
                              <Button size='2' color='red' variant='soft' onClick={() => setToCancel(reservation)}>
                                <Cross2Icon /> Batal
                              </Button>
                            </Tooltip>
                          )}
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Grid>

          {sortedReservations.length === 0 && (
            <Flex justify='center' py='8'>
              <Text color='gray'>Tidak ada reservasi</Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {/* MODAL DETAIL */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Detail Reservasi</Dialog.Title>
          {selected && (
            <Flex direction='column' gap='4'>
              <Flex gap='3'>
                {selected.book?.coverUrl ? (
                  <img src={selected.book.coverUrl} style={{ width: 80, height: 110, objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  <Box style={{ width: 80, height: 110, background: 'var(--gray-9)' }} />
                )}
                <Box>
                  <Text weight='bold'>{selected.book?.title}</Text>
                  <Text size='2' color='gray'>
                    {selected.book?.author}
                  </Text>
                </Box>
              </Flex>

              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>Reservasi</DataList.Label>
                  <DataList.Value>{formatDateTime(selected.reservedAt)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Expiry</DataList.Label>
                  <DataList.Value>{formatDateTime(selected.expiresAt)}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Status</DataList.Label>
                  <DataList.Value>{getStatusBadge(selected.status)}</DataList.Value>
                </DataList.Item>
              </DataList.Root>

              <Flex justify='end'>
                <Dialog.Close>
                  <Button variant='soft'>Tutup</Button>
                </Dialog.Close>
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* MODAL KONFIRMASI BATAL */}
      <Dialog.Root open={!!toCancel} onOpenChange={handleCancelClose}>
        <Dialog.Content maxWidth='420px'>
          <Dialog.Title>Batalkan Reservasi?</Dialog.Title>
          <Dialog.Description size='2' mb='4'>
            Yakin ingin membatalkan reservasi buku{' '}
            <Text weight='bold' color='red'>
              {toCancel?.book?.title}
            </Text>
            ? Tindakan ini tidak dapat diurungkan.
          </Dialog.Description>

          {cancelError && (
            <Callout.Root color='red' variant='soft' mb='4' size='1'>
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{cancelError}</Callout.Text>
            </Callout.Root>
          )}

          <Flex gap='3' justify='end'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>
                Kembali
              </Button>
            </Dialog.Close>
            <Button color='red' onClick={handleCancelConfirm} loading={reservations.custom.isPending}>
              Ya, Batalkan
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
