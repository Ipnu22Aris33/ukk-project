'use client';

import { useState } from 'react';
import { Box, Card, Flex, Text, Badge, Skeleton, Dialog, Button, Separator } from '@radix-ui/themes';
import { ReaderIcon, CalendarIcon, ClockIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useLoans } from '@/hooks/useLoans';

const statusConfig: Record<string, { label: string; color: 'blue' | 'red' | 'green' }> = {
  borrowed: { label: 'Aktif', color: 'blue' },
  late:     { label: 'Terlambat', color: 'red' },
  returned: { label: 'Kembali', color: 'green' },
};

export const ActiveLoans = () => {
  const loansHook = useLoans();
  const { data: response, isLoading } = loansHook.list({
    limit: 5,
    status: 'borrowed',
    orderBy: 'loanDate',
    orderDir: 'desc',
  });

  const [selected, setSelected] = useState<any>(null);
  const activeLoans = response?.data || [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const getDaysLeft = (dueDate: string) => {
    const diff = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return { text: `${Math.abs(diff)} hari terlambat`, color: 'red' as const, urgent: true };
    if (diff === 0) return { text: 'Jatuh tempo hari ini', color: 'red' as const, urgent: true };
    if (diff <= 3)  return { text: `${diff} hari lagi`, color: 'amber' as const, urgent: true };
    return { text: `${diff} hari lagi`, color: 'gray' as const, urgent: false };
  };

  return (
    <>
      <Flex direction='column' gap='3'>
        <Flex align='center' justify='between'>
          <Text size='3' weight='bold'>Peminjaman Aktif</Text>
          {!isLoading && activeLoans.length > 0 && (
            <Badge color='blue' variant='soft' radius='full'>{activeLoans.length}</Badge>
          )}
        </Flex>

        <Flex direction='column' gap='2'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} style={{ padding: '12px 16px' }}>
                <Skeleton height='56px' />
              </Card>
            ))
          ) : activeLoans.length === 0 ? (
            <Card style={{ padding: '32px 16px', border: '2px dashed var(--gray-5)', background: 'transparent' }}>
              <Flex direction='column' align='center' gap='2'>
                <Box style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gray-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ReaderIcon width='16' height='16' color='var(--gray-9)' />
                </Box>
                <Text size='2' color='gray'>Tidak ada pinjaman aktif</Text>
              </Flex>
            </Card>
          ) : (
            activeLoans.map((loan: any) => {
              const s = statusConfig[loan.status] || { label: loan.status, color: 'gray' };
              const daysLeft = getDaysLeft(loan.dueDate);

              return (
                <Card
                  key={loan.id}
                  style={{ padding: '12px 14px', cursor: 'pointer', transition: 'background 0.15s' }}
                  className='hover:bg-gray-2'
                  onClick={() => setSelected(loan)}
                >
                  <Flex gap='3' align='start'>
                    {/* Cover */}
                    <Box style={{ width: 40, height: 56, borderRadius: 6, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--gray-4)' }}>
                      {loan.book?.coverUrl ? (
                        <Image src={loan.book.coverUrl} alt={loan.book.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <Flex align='center' justify='center' style={{ width: '100%', height: '100%' }}>
                          <ReaderIcon width='16' height='16' color='var(--gray-8)' />
                        </Flex>
                      )}
                    </Box>

                    <Flex direction='column' gap='1' style={{ flex: 1, minWidth: 0 }}>
                      <Flex align='center' justify='between' gap='2'>
                        <Text size='2' weight='medium' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {loan.book?.title}
                        </Text>
                        <Badge color={s.color} radius='full' size='1' variant='soft'>{s.label}</Badge>
                      </Flex>

                      <Text size='1' color='gray' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {loan.book?.author}
                      </Text>

                      <Separator size='4' style={{ margin: '4px 0', opacity: 0.5 }} />

                      <Flex align='center' justify='between'>
                        <Flex align='center' gap='1'>
                          <CalendarIcon width='11' height='11' color='var(--gray-9)' />
                          <Text size='1' color='gray'>{formatDate(loan.loanDate)}</Text>
                        </Flex>
                        <Flex align='center' gap='1'>
                          <ClockIcon width='11' height='11' color={daysLeft.urgent ? 'var(--red-9)' : 'var(--gray-9)'} />
                          <Text size='1' color={daysLeft.color} weight={daysLeft.urgent ? 'medium' : 'regular'}>
                            {daysLeft.text}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              );
            })
          )}
        </Flex>
      </Flex>

      {/* MODAL DETAIL */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Content maxWidth='460px'>
          <Dialog.Title>Detail Peminjaman</Dialog.Title>

          {selected && (
            <Flex direction='column' gap='4'>
              <Flex gap='3'>
                <Box style={{ width: 72, height: 100, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'var(--gray-4)' }}>
                  {selected.book?.coverUrl ? (
                    <Image src={selected.book.coverUrl} alt={selected.book.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <Flex align='center' justify='center' style={{ width: '100%', height: '100%' }}>
                      <ReaderIcon width='24' height='24' color='var(--gray-8)' />
                    </Flex>
                  )}
                </Box>
                <Flex direction='column' justify='center' gap='1' style={{ minWidth: 0 }}>
                  <Text weight='bold' size='3' style={{ lineHeight: 1.4 }}>{selected.book?.title}</Text>
                  <Text size='2' color='gray'>{selected.book?.author}</Text>
                  <Badge color={statusConfig[selected.status]?.color ?? 'gray'} variant='soft' radius='full' size='1' style={{ width: 'fit-content', marginTop: 4 }}>
                    {statusConfig[selected.status]?.label ?? selected.status}
                  </Badge>
                </Flex>
              </Flex>

              <Separator size='4' />

              <Flex direction='column' gap='2'>
                <Flex justify='between'>
                  <Text size='2' color='gray'>Tanggal Pinjam</Text>
                  <Text size='2' weight='medium'>{formatDate(selected.loanDate)}</Text>
                </Flex>
                <Flex justify='between'>
                  <Text size='2' color='gray'>Jatuh Tempo</Text>
                  <Text size='2' weight='medium' color={getDaysLeft(selected.dueDate).urgent ? 'red' : undefined}>
                    {formatDate(selected.dueDate)}
                  </Text>
                </Flex>
                <Flex justify='between'>
                  <Text size='2' color='gray'>Sisa Waktu</Text>
                  <Text size='2' weight='medium' color={getDaysLeft(selected.dueDate).color}>
                    {getDaysLeft(selected.dueDate).text}
                  </Text>
                </Flex>
              </Flex>

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
};