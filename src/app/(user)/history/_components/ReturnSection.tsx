// app/riwayat/components/PengembalianSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Button, Spinner, Dialog } from '@radix-ui/themes';
import { CalendarIcon, TimerIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useReturns } from '@/hooks/useReturns';

export function ReturnSection() {
  const returns = useReturns();
  const { data, isLoading } = returns.list({ page: 1, limit: 10 });

  const [selected, setSelected] = useState<any>(null);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getFineStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge color='green'>Lunas</Badge>;
      default:
        return <Badge color='red'>Belum Bayar</Badge>;
    }
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'good':
        return <Badge color='green'>Baik</Badge>;
      case 'damaged':
        return <Badge color='orange'>Rusak</Badge>;
      case 'lost':
        return <Badge color='red'>Hilang</Badge>;
      default:
        return <Badge>{condition}</Badge>;
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

  const items = data?.data || [];

  return (
    <>
      <Card size='3'>
        <Flex direction='column' gap='4'>
          <Heading size='4'>Riwayat Pengembalian</Heading>

          <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap='4'>
            {items.map((item: any) => {
              const hasFine = item.fineAmount > 0;

              return (
                <Card key={item.id} size='2'>
                  <Flex direction='column' gap='3'>
                    {/* HEADER: cover + judul + kondisi */}
                    <Flex gap='3' align='start'>
                      <Box
                        style={{ width: 52, height: 72, borderRadius: 'var(--radius-3)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}
                      >
                        {item.loan?.book?.coverUrl ? (
                          <Image src={item.loan.book.coverUrl} alt={item.loan.book.title} fill style={{ objectFit: 'cover' }} />
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
                            {item.loan?.book?.title}
                          </Text>
                          {getConditionBadge(item.condition)}
                        </Flex>
                        <Text size='1' color='gray'>
                          {item.loan?.book?.author}
                        </Text>
                      </Box>
                    </Flex>

                    {/* DATE INFO */}
                    <Grid columns={{ initial: '1', md: '2' }} gap='2'>
                      <Box style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)', padding: '8px 10px' }}>
                        <Flex align='center' gap='1' mb='1'>
                          <CalendarIcon width='11' height='11' />
                          <Text size='1' color='gray'>
                            Dipinjam
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium'>
                          {formatDate(item.loan?.loanDate)}
                        </Text>
                      </Box>

                      <Box style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)', padding: '8px 10px' }}>
                        <Flex align='center' gap='1' mb='1'>
                          <TimerIcon width='11' height='11' />
                          <Text size='1' color='gray'>
                            Dikembalikan
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium'>
                          {formatDateTime(item.returnedAt)}
                        </Text>
                      </Box>
                    </Grid>

                    {/* DENDA — selalu render */}
                    <Flex
                      direction='column'
                      gap='1'
                      style={{
                        background: !hasFine ? 'var(--gray-2)' : item.fineStatus === 'paid' ? 'var(--green-2)' : 'var(--red-2)',
                        borderRadius: 'var(--radius-2)',
                        padding: '8px 12px',
                      }}
                    >
                      <Flex align='center' justify='between'>
                        <Text size='1' color={!hasFine ? 'gray' : item.fineStatus === 'paid' ? 'green' : 'red'}>
                          Denda
                        </Text>
                        {hasFine && getFineStatusBadge(item.fineStatus)}
                      </Flex>
                      <Text size='2' weight='medium' color={!hasFine ? 'gray' : item.fineStatus === 'paid' ? 'green' : 'red'}>
                        {hasFine ? `Rp ${item.fineAmount.toLocaleString('id-ID')}` : 'Tidak ada'}
                      </Text>
                    </Flex>
                    {/* ACTION */}
                    <Button size='2' variant='soft' onClick={() => setSelected(item)}>
                      <EyeOpenIcon /> Detail
                    </Button>
                  </Flex>
                </Card>
              );
            })}
          </Grid>

          {items.length === 0 && (
            <Flex justify='center' py='8'>
              <Text color='gray'>Tidak ada riwayat pengembalian</Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {/* MODAL DETAIL */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Detail Pengembalian</Dialog.Title>

          {selected && (
            <Flex direction='column' gap='4'>
              <Flex gap='3'>
                <Box style={{ width: 80, height: 110, borderRadius: 'var(--radius-3)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  {selected.loan?.book?.coverUrl ? (
                    <Image src={selected.loan.book.coverUrl} alt={selected.loan.book.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <Box style={{ width: '100%', height: '100%', background: 'var(--gray-9)' }} />
                  )}
                </Box>

                <Box style={{ minWidth: 0 }}>
                  <Text
                    weight='bold'
                    size='3'
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {selected.loan?.book?.title}
                  </Text>
                  <Text size='2' color='gray'>
                    {selected.loan?.book?.author}
                  </Text>
                </Box>
              </Flex>

              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>
                    <Flex align='center' gap='1'>
                      <CalendarIcon />
                      Tanggal Pinjam
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>{formatDate(selected.loan?.loanDate)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>
                    <Flex align='center' gap='1'>
                      <TimerIcon />
                      Dikembalikan
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>{formatDateTime(selected.returnedAt)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>Kondisi</DataList.Label>
                  <DataList.Value>{getConditionBadge(selected.condition)}</DataList.Value>
                </DataList.Item>

                {selected.fineAmount > 0 && (
                  <>
                    <DataList.Item>
                      <DataList.Label>Denda</DataList.Label>
                      <DataList.Value>
                        <Text color='red' weight='bold'>
                          Rp {selected.fineAmount.toLocaleString('id-ID')}
                        </Text>
                      </DataList.Value>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.Label>Status Denda</DataList.Label>
                      <DataList.Value>{getFineStatusBadge(selected.fineStatus)}</DataList.Value>
                    </DataList.Item>
                  </>
                )}

                {selected.notes && (
                  <DataList.Item>
                    <DataList.Label>Catatan</DataList.Label>
                    <DataList.Value>{selected.notes}</DataList.Value>
                  </DataList.Item>
                )}
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
