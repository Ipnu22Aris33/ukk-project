'use client';

import { useState } from 'react';
import { Box, Card, Flex, Text, Badge, Skeleton, Dialog, Button } from '@radix-ui/themes';
import { ReaderIcon } from '@radix-ui/react-icons';
import { useLoans } from '@/hooks/useLoans';

const statusConfig: Record<string, { label: string; color: 'blue' | 'red' | 'green' }> = {
  borrowed: { label: 'Aktif', color: 'blue' },
  late: { label: 'Terlambat', color: 'red' },
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
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getDaysLeft = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return `${Math.abs(diff)} hari terlambat`;
    if (diff === 0) return 'Hari ini';
    return `${diff} hari lagi`;
  };

  return (
    <>
      <Box className='min-w-0'>
        <Text size='4' weight='bold' mb='3'>
          Peminjaman Aktif
        </Text>

        <Flex direction='column' gap='2'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className='p-3 px-4 rounded-xl'>
                <Skeleton height='40px' />
              </Card>
            ))
          ) : activeLoans.length === 0 ? (
            <Card className='p-8 rounded-xl border-dashed border-2 flex flex-col items-center justify-center bg-gray-1'>
              <Text size='2' color='gray'>
                Tidak ada pinjaman aktif
              </Text>
            </Card>
          ) : (
            activeLoans.map((loan: any) => {
              const s = statusConfig[loan.status] || {
                label: loan.status,
                color: 'gray',
              };

              return (
                <Card
                  key={loan.id}
                  className='p-3 px-4 rounded-xl hover:bg-gray-2 transition-colors cursor-pointer'
                  onClick={() => setSelected(loan)}
                >
                  <Flex direction='column' gap='2'>
                    <Flex align='center' justify='between' gap='3'>
                      <Flex align='center' gap='3' className='flex-1 min-w-0'>
                        <Box className='w-9 h-9 rounded-lg shrink-0 bg-indigo-3 text-indigo-9 flex items-center justify-center'>
                          <ReaderIcon width='16' height='16' />
                        </Box>

                        <Box className='min-w-0 flex-1'>
                          <Text size='2' weight='medium' className='truncate'>
                            {loan.book?.title}
                          </Text>
                          <Text size='1' color='gray'>
                            {loan.book?.author}
                          </Text>
                        </Box>
                      </Flex>

                      <Badge color={s.color} radius='full' size='1'>
                        {s.label}
                      </Badge>
                    </Flex>

                    {/* DATE INFO */}
                    <Flex justify='between' align='center'>
                      <Text size='1' color='gray'>
                        Pinjam: {formatDate(loan.loanDate)}
                      </Text>
                      <Text size='1' color='gray'>
                        Jatuh tempo: {formatDate(loan.dueDate)}
                      </Text>
                    </Flex>

                    {/* DAYS LEFT */}
                    <Text size='1' weight='medium' color={getDaysLeft(loan.dueDate).includes('terlambat') ? 'red' : 'gray'}>
                      {getDaysLeft(loan.dueDate)}
                    </Text>
                  </Flex>
                </Card>
              );
            })
          )}
        </Flex>
      </Box>

      {/* MODAL */}
      <Dialog.Root open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Detail Peminjaman</Dialog.Title>

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

              <Flex direction='column' gap='2'>
                <Text size='2'>
                  <strong>Tanggal Pinjam:</strong> {formatDate(selected.loanDate)}
                </Text>
                <Text size='2'>
                  <strong>Jatuh Tempo:</strong> {formatDate(selected.dueDate)}
                </Text>
                <Text size='2'>
                  <strong>Status:</strong> {statusConfig[selected.status]?.label}
                </Text>
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
