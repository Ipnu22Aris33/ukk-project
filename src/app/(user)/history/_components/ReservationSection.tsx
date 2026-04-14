// app/riwayat/components/ReservasiSection.tsx
"use client";

import {
  Card,
  Flex,
  Grid,
  Text,
  Heading,
  Badge,
  Box,
  DataList,
  Button,
  Tooltip,
  Spinner,
} from '@radix-ui/themes';

import {
  CalendarIcon,
  TimerIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';

import Image from 'next/image';
import { useReservations } from '@/hooks/useReservation';

export function ReservationSection() {
  const reservations = useReservations();
  const { data, isLoading } = reservations.list({
    page: 1,
    limit: 10,
  });

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'picked_up':
        return <Badge color="green">Diambil</Badge>;
      case 'pending':
        return <Badge color="amber">Menunggu</Badge>;
      case 'borrowed':
        return <Badge color="blue">Dipinjam</Badge>;
      case 'cancelled':
        return <Badge color="red">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card size="3">
        <Flex justify="center" py="8">
          <Spinner size="3" />
        </Flex>
      </Card>
    );
  }

  return (
    <Card size="3">
      <Flex direction="column" gap="4">
        <Heading size="4">Reservasi Saya</Heading>

        <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
          {data?.data?.map((reservation: any) => {
            const status = reservation.status;

            return (
              <Card key={reservation.id} size="2">
                <Flex gap="3">
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
                      <Image
                        src={reservation.book.coverUrl}
                        alt={reservation.book.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
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
                    <Flex align="center" justify="between" mb="1">
                      <Text size="3" weight="bold">
                        {reservation.book?.title}
                      </Text>
                      {getStatusBadge(status)}
                    </Flex>

                    <Text size="2" color="gray" mb="2">
                      {reservation.book?.author}
                    </Text>

                    <DataList.Root size="1">
                      <DataList.Item>
                        <DataList.Label minWidth="60px">
                          <Flex align="center" gap="1">
                            <CalendarIcon />
                            Reservasi
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>
                          {formatDateTime(reservation.reservedAt)}
                        </DataList.Value>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.Label minWidth="60px">
                          <Flex align="center" gap="1">
                            <TimerIcon />
                            Expiry
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>
                          {formatDateTime(reservation.expiresAt)}
                        </DataList.Value>
                      </DataList.Item>

                      {reservation.quantity > 1 && (
                        <DataList.Item>
                          <DataList.Label>Jumlah</DataList.Label>
                          <DataList.Value>
                            {reservation.quantity} buku
                          </DataList.Value>
                        </DataList.Item>
                      )}
                    </DataList.Root>

                    {/* Actions berdasarkan status */}
                    <Flex gap="2" mt="3">
                      {/* PENDING → bisa batal */}
                      {status === 'pending' && (
                        <>
                          <Button
                            size="1"
                            variant="soft"
                            disabled
                            style={{ flex: 1 }}
                          >
                            Menunggu
                          </Button>

                          <Tooltip content="Batalkan reservasi">
                            <Button size="1" variant="ghost" color="red">
                              <Cross2Icon />
                            </Button>
                          </Tooltip>
                        </>
                      )}

                      {/* PICKED_UP → bisa ambil + batal */}
                      {status === 'picked_up' && (
                        <>
                          <Button size="1" style={{ flex: 1 }}>
                            Ambil Buku
                          </Button>

                          <Button size="1" variant="soft" color="red">
                            Batalkan
                          </Button>
                        </>
                      )}

                      {/* BORROWED → tidak bisa apa-apa */}
                      {status === 'borrowed' && (
                        <Button
                          size="1"
                          variant="soft"
                          disabled
                          style={{ flex: 1 }}
                        >
                          Sedang Dipinjam
                        </Button>
                      )}

                      {/* CANCELLED */}
                      {status === 'cancelled' && (
                        <Button
                          size="1"
                          variant="soft"
                          disabled
                          style={{ flex: 1 }}
                        >
                          Dibatalkan
                        </Button>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Card>
            );
          })}
        </Grid>

        {data?.data?.length === 0 && (
          <Flex justify="center" py="8">
            <Text color="gray">Tidak ada reservasi</Text>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}