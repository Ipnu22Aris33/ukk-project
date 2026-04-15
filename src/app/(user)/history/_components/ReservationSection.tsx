// app/riwayat/components/ReservasiSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Button, Tooltip, Spinner, Dialog } from '@radix-ui/themes';

import { CalendarIcon, TimerIcon, Cross2Icon, EyeOpenIcon } from '@radix-ui/react-icons';

import Image from 'next/image';
import { useReservations } from '@/hooks/useReservation';

export function ReservationSection() {
  const reservations = useReservations();
  const { data, isLoading } = reservations.list({
    page: 1,
    limit: 10,
  });

  const [selected, setSelected] = useState<any>(null);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

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
                  <Flex gap='3'>
                    {/* Cover */}
                    <Box
                      style={{
                        width: 60,
                        height: 80,
                        borderRadius: 'var(--radius-3)',
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                      }}
                    >
                      {reservation.book?.coverUrl ? (
                        <Image src={reservation.book.coverUrl} alt={reservation.book.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <Box
                          style={{
                            width: '100%',
                            height: '100%',
                            background: 'var(--gray-9)',
                          }}
                        />
                      )}
                    </Box>

                    {/* Content */}
                    <Box style={{ flex: 1 }}>
                      <Flex align='center' justify='between' mb='1'>
                        <Text size='3' weight='bold'>
                          {reservation.book?.title}
                        </Text>
                        {getStatusBadge(status)}
                      </Flex>

                      <Text size='2' color='gray' mb='2'>
                        {reservation.book?.author}
                      </Text>

                      <DataList.Root size='1'>
                        <DataList.Item>
                          <DataList.Label minWidth='60px'>
                            <Flex align='center' gap='1'>
                              <CalendarIcon />
                              Reservasi
                            </Flex>
                          </DataList.Label>
                          <DataList.Value>{formatDateTime(reservation.reservedAt)}</DataList.Value>
                        </DataList.Item>

                        <DataList.Item>
                          <DataList.Label minWidth='60px'>
                            <Flex align='center' gap='1'>
                              <TimerIcon />
                              Expiry
                            </Flex>
                          </DataList.Label>
                          <DataList.Value>{formatDateTime(reservation.expiresAt)}</DataList.Value>
                        </DataList.Item>
                      </DataList.Root>

                      {/* Actions */}
                      <Flex gap='2' mt='3'>
                        {/* picked_up → hanya detail */}
                        {status === 'picked_up' && (
                          <Button size='1' style={{ flex: 1 }} onClick={() => setSelected(reservation)}>
                            <EyeOpenIcon />
                            Detail
                          </Button>
                        )}

                        {/* selain picked_up → detail + batal */}
                        {status !== 'picked_up' && (
                          <>
                            <Button size='1' variant='soft' style={{ flex: 1 }} onClick={() => setSelected(reservation)}>
                              <EyeOpenIcon />
                              Detail
                            </Button>

                            {status === 'pending' && (
                              <Tooltip content='Batalkan reservasi'>
                                <Button size='1' color='red'>
                                  <Cross2Icon />
                                </Button>
                              </Tooltip>
                            )}
                          </>
                        )}
                      </Flex>
                    </Box>
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
                  <img
                    src={selected.book.coverUrl}
                    style={{
                      width: 80,
                      height: 110,
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                ) : (
                  <Box
                    style={{
                      width: 80,
                      height: 110,
                      background: 'var(--gray-9)',
                    }}
                  />
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
    </>
  );
}
