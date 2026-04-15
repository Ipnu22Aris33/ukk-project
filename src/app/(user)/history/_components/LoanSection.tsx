// app/riwayat/components/RiwayatSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Spinner, Dialog, Button } from '@radix-ui/themes';

import { CalendarIcon, TimerIcon, EyeOpenIcon } from '@radix-ui/react-icons';

import { useLoans } from '@/hooks/useLoans';

export function LoanSection() {
  const loans = useLoans();
  const { data, isLoading } = loans.list({
    page: 1,
    limit: 10,
  });

  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const historyLoans = data?.data || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'returned') return <Badge color='green'>Dikembalikan</Badge>;
    if (status === 'borrowed') return <Badge color='blue'>Dipinjam</Badge>;
    if (status === 'late') return <Badge color='red'>Terlambat</Badge>;
    return <Badge>{status}</Badge>;
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
          <Heading size='4'>Riwayat Peminjaman</Heading>

          <Grid columns={{ initial: '1', md: '2' }} gap='4'>
            {historyLoans.map((loan: any) => {
              const status = loan.status;

              return (
                <Card key={loan.id} size='2'>
                  <Flex gap='3'>
                    {loan.book?.coverUrl ? (
                      <img
                        src={loan.book.coverUrl}
                        alt={loan.book.title}
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

                    <Box style={{ flex: 1 }}>
                      <Flex align='center' justify='between' mb='1'>
                        <Text size='3' weight='bold'>
                          {loan.book?.title}
                        </Text>
                        {getStatusBadge(status)}
                      </Flex>

                      <Text size='2' style={{ color: 'var(--gray-11)' }} mb='2'>
                        {loan.book?.author}
                      </Text>

                      <Text size='2'>
                        {formatDate(loan.loanDate)} - {formatDate(loan.dueDate)}
                      </Text>

                      {/* Actions */}
                      <Flex gap='2' mt='3'>
                        {/* semua status ada detail */}
                        <Button size='1' variant='soft' style={{ flex: 1 }} onClick={() => setSelectedLoan(loan)}>
                          <EyeOpenIcon />
                          Detail
                        </Button>

                        {/* hanya borrowed → bisa kembalikan */}
                        {status === 'borrowed' && (
                          <Button size='1' style={{ flex: 1 }}>
                            Kembalikan
                          </Button>
                        )}

                        {/* late → bisa kembalikan */}
                        {status === 'late' && (
                          <Button size='1' color='red' style={{ flex: 1 }}>
                            Kembalikan
                          </Button>
                        )}
                      </Flex>
                    </Box>
                  </Flex>
                </Card>
              );
            })}
          </Grid>

          {historyLoans.length === 0 && (
            <Flex justify='center' py='8'>
              <Text style={{ color: 'var(--gray-11)' }}>Tidak ada riwayat peminjaman</Text>
            </Flex>
          )}
        </Flex>
      </Card>

      {/* MODAL DETAIL */}
      <Dialog.Root open={!!selectedLoan} onOpenChange={(open) => !open && setSelectedLoan(null)}>
        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Detail Peminjaman</Dialog.Title>

          {selectedLoan && (
            <Flex direction='column' gap='4'>
              <Flex gap='3'>
                {selectedLoan.book?.coverUrl ? (
                  <img
                    src={selectedLoan.book.coverUrl}
                    alt={selectedLoan.book.title}
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
                      borderRadius: 'var(--radius-3)',
                    }}
                  />
                )}

                <Box>
                  <Text weight='bold' size='4'>
                    {selectedLoan.book?.title}
                  </Text>
                  <Text size='2' color='gray'>
                    {selectedLoan.book?.author}
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
                  <DataList.Value>{formatDate(selectedLoan.loanDate)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>
                    <Flex align='center' gap='1'>
                      <TimerIcon />
                      Jatuh Tempo
                    </Flex>
                  </DataList.Label>
                  <DataList.Value>{formatDate(selectedLoan.dueDate)}</DataList.Value>
                </DataList.Item>

                <DataList.Item>
                  <DataList.Label>Status</DataList.Label>
                  <DataList.Value>{getStatusBadge(selectedLoan.status)}</DataList.Value>
                </DataList.Item>

                {selectedLoan.quantity > 1 && (
                  <DataList.Item>
                    <DataList.Label>Jumlah</DataList.Label>
                    <DataList.Value>{selectedLoan.quantity} buku</DataList.Value>
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
