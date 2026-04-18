// app/riwayat/components/RiwayatSection.tsx
'use client';

import { useState } from 'react';
import { Card, Flex, Grid, Text, Heading, Badge, Box, DataList, Spinner, Dialog, Button } from '@radix-ui/themes';
import { CalendarIcon, TimerIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useLoans } from '@/hooks/useLoans';

export function LoanSection() {
  const loans = useLoans();
  const { data, isLoading } = loans.list({ page: 1, limit: 10 });

  const [selectedLoan, setSelectedLoan] = useState<any>(null);

  const historyLoans = data?.data || [];

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getDaysInfo = (dueDateString: string, status: string) => {
    if (status === 'returned') return null;
    const today = new Date();
    const due = new Date(dueDateString);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { label: `${Math.abs(diff)} hari terlambat`, color: 'red' as const };
    if (diff === 0) return { label: 'Jatuh tempo hari ini', color: 'red' as const };
    if (diff <= 3) return { label: `${diff} hari lagi`, color: 'amber' as const };
    return { label: `${diff} hari lagi`, color: 'gray' as const };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'returned':
        return <Badge color='green'>Dikembalikan</Badge>;
      case 'borrowed':
        return <Badge color='blue'>Dipinjam</Badge>;
      case 'late':
        return <Badge color='red'>Terlambat</Badge>;
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

  return (
    <>
      <Card size='3'>
        <Flex direction='column' gap='4'>
          <Heading size='4'>Riwayat Peminjaman</Heading>

          <Grid columns={{ initial: '1', md: '2' , lg: '3' }} gap='4'>
            {historyLoans.map((loan: any) => {
              const status = loan.status;
              const daysInfo = getDaysInfo(loan.dueDate, status);
              const isActive = status === 'borrowed' || status === 'late';

              return (
                <Card key={loan.id} size='2'>
                  <Flex direction='column' gap='3'>
                    {/* HEADER: cover + judul + status */}
                    <Flex gap='3' align='start'>
                      <Box
                        style={{ width: 52, height: 72, borderRadius: 'var(--radius-3)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}
                      >
                        {loan.book?.coverUrl ? (
                          <Image src={loan.book.coverUrl} alt={loan.book.title} fill style={{ objectFit: 'cover' }} />
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
                            {loan.book?.title}
                          </Text>
                          {getStatusBadge(status)}
                        </Flex>
                        <Text size='1' color='gray'>
                          {loan.book?.author}
                        </Text>
                      </Box>
                    </Flex>

                    {/* DATE INFO */}
                    <Grid columns={{initial: '1', md: '2'}} gap='2'>
                      <Box style={{ background: 'var(--gray-2)', borderRadius: 'var(--radius-2)', padding: '8px 10px' }}>
                        <Flex align='center' gap='1' mb='1'>
                          <CalendarIcon width='11' height='11' />
                          <Text size='1' color='gray'>
                            Dipinjam
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium'>
                          {formatDate(loan.loanDate)}
                        </Text>
                      </Box>

                      <Box
                        style={{
                          background: status === 'late' ? 'var(--red-2)' : 'var(--gray-2)',
                          borderRadius: 'var(--radius-2)',
                          padding: '8px 10px',
                        }}
                      >
                        <Flex align='center' gap='1' mb='1'>
                          <TimerIcon width='11' height='11' />
                          <Text size='1' color={status === 'late' ? 'red' : 'gray'}>
                            Jatuh Tempo
                          </Text>
                        </Flex>
                        <Text size='1' weight='medium' color={status === 'late' ? 'red' : undefined}>
                          {formatDate(loan.dueDate)}
                        </Text>
                      </Box>
                    </Grid>

                    {/* DAYS INFO — hanya kalau aktif */}
                    {daysInfo && (
                      <Flex
                        align='center'
                        justify='center'
                        style={{
                          background: daysInfo.color === 'red' ? 'var(--red-2)' : daysInfo.color === 'amber' ? 'var(--amber-2)' : 'var(--gray-2)',
                          borderRadius: 'var(--radius-2)',
                          padding: '6px 10px',
                        }}
                      >
                        <Text size='1' weight='medium' color={daysInfo.color}>
                          {daysInfo.label}
                        </Text>
                      </Flex>
                    )}

                    {/* ACTIONS */}
                    <Flex gap='2'>
                      <Button size='2' variant='soft' style={{ flex: 1 }} onClick={() => setSelectedLoan(loan)}>
                        <EyeOpenIcon /> Detail
                      </Button>

                      {status === 'borrowed' && (
                        <Button size='2' style={{ flex: 1 }}>
                          Kembalikan
                        </Button>
                      )}

                      {status === 'late' && (
                        <Button size='2' color='red' style={{ flex: 1 }}>
                          Kembalikan
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              );
            })}
          </Grid>

          {historyLoans.length === 0 && (
            <Flex justify='center' py='8'>
              <Text color='gray'>Tidak ada riwayat peminjaman</Text>
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
                <Box style={{ width: 80, height: 110, borderRadius: 'var(--radius-3)', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                  {selectedLoan.book?.coverUrl ? (
                    <Image src={selectedLoan.book.coverUrl} alt={selectedLoan.book.title} fill style={{ objectFit: 'cover' }} />
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

                {selectedLoan.returnDate && (
                  <DataList.Item>
                    <DataList.Label>Dikembalikan</DataList.Label>
                    <DataList.Value>{formatDate(selectedLoan.returnDate)}</DataList.Value>
                  </DataList.Item>
                )}

                {selectedLoan.quantity > 1 && (
                  <DataList.Item>
                    <DataList.Label>Jumlah</DataList.Label>
                    <DataList.Value>{selectedLoan.quantity} buku</DataList.Value>
                  </DataList.Item>
                )}
              </DataList.Root>

              <Flex justify='end' gap='2'>
                <Dialog.Close>
                  <Button variant='soft'>Tutup</Button>
                </Dialog.Close>

                {selectedLoan.status === 'borrowed' && <Button>Kembalikan</Button>}
                {selectedLoan.status === 'late' && <Button color='red'>Kembalikan</Button>}
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
