// app/riwayat/components/PengembalianSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Button, Spinner, Dialog } from '@radix-ui/themes';

import { CalendarIcon, TimerIcon, EyeOpenIcon } from '@radix-ui/react-icons';

import { useReturns } from '@/hooks/useReturns';

export function ReturnSection() {
  const returns = useReturns();
  const { data, isLoading } = returns.list({
    page: 1,
    limit: 10,
  });

  const [selected, setSelected] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID');
  };

  const getFineStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge color='green'>Lunas</Badge>;
      default:
        return <Badge color='red'>Belum Dibayar</Badge>;
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

  return (
    <>
      <Card size='3'>
        <Flex direction='column' gap='4'>
          <Heading size='4'>Riwayat Pengembalian</Heading>

          <Grid columns={{ initial: '1', md: '2' }} gap='4'>
            {data?.data?.map((item: any) => (
              <Card key={item.id} size='2'>
                <Flex gap='3'>
                  {/* Cover */}
                  {item.loan?.book?.coverUrl ? (
                    <img
                      src={item.loan.book.coverUrl}
                      alt={item.loan.book.title}
                      style={{
                        width: 70,
                        height: 90,
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-3)',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Box
                      style={{
                        width: 70,
                        height: 90,
                        background: 'var(--gray-9)',
                        borderRadius: 'var(--radius-3)',
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Content */}
                  <Box style={{ flex: 1 }}>
                    <Flex align='center' justify='between' mb='1'>
                      <Text size='3' weight='bold'>
                        {item.loan?.book?.title}
                      </Text>
                      {getConditionBadge(item.condition)}
                    </Flex>

                    <Text size='2' style={{ color: 'var(--gray-11)' }} mb='2'>
                      {item.loan?.book?.author}
                    </Text>

                    <DataList.Root size='1'>
                      <DataList.Item>
                        <DataList.Label minWidth='70px'>
                          <Flex align='center' gap='1'>
                            <CalendarIcon />
                            Pinjam
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>{formatDate(item.loan?.loanDate)}</DataList.Value>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.Label minWidth='70px'>
                          <Flex align='center' gap='1'>
                            <TimerIcon />
                            Kembali
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>{formatDateTime(item.returnedAt)}</DataList.Value>
                      </DataList.Item>

                      {item.fineAmount > 0 && (
                        <DataList.Item>
                          <DataList.Label>Denda</DataList.Label>
                          <DataList.Value>
                            <Flex direction='column' gap='1'>
                              <Text color='red'>Rp {item.fineAmount.toLocaleString()}</Text>
                              {getFineStatusBadge(item.fineStatus)}
                            </Flex>
                          </DataList.Value>
                        </DataList.Item>
                      )}
                    </DataList.Root>

                    {/* Action */}
                    <Flex mt='3'>
                      <Button size='1' variant='soft' style={{ flex: 1 }} onClick={() => setSelected(item)}>
                        <EyeOpenIcon />
                        Detail
                      </Button>
                    </Flex>
                  </Box>
                </Flex>
              </Card>
            ))}
          </Grid>

          {data?.data?.length === 0 && (
            <Flex justify='center' py='8'>
              <Text style={{ color: 'var(--gray-11)' }}>Tidak ada riwayat pengembalian</Text>
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
                {selected.loan?.book?.coverUrl ? (
                  <img
                    src={selected.loan.book.coverUrl}
                    style={{
                      width: 80,
                      height: 110,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-3)',
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
                  <Text weight='bold'>{selected.loan?.book?.title}</Text>
                  <Text size='2' color='gray'>
                    {selected.loan?.book?.author}
                  </Text>
                </Box>
              </Flex>

              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>Tanggal Pinjam</DataList.Label>
                  <DataList.Value>{formatDate(selected.loan?.loanDate)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>Tanggal Kembali</DataList.Label>
                  <DataList.Value>{formatDateTime(selected.returnedAt)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>Kondisi</DataList.Label>
                  <DataList.Value>{getConditionBadge(selected.condition)}</DataList.Value>
                </DataList.Item>

                {selected.fineAmount > 0 && (
                  <DataList.Item>
                    <DataList.Label>Denda</DataList.Label>
                    <DataList.Value>
                      <Flex direction='column' gap='1'>
                        <Text color='red'>Rp {selected.fineAmount.toLocaleString()}</Text>
                        {getFineStatusBadge(selected.fineStatus)}
                      </Flex>
                    </DataList.Value>
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
