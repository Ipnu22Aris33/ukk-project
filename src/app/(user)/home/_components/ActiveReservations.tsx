'use client';

import { useState } from 'react';
import { Box, Card, Flex, Text, Badge, Skeleton, Dialog, Button } from '@radix-ui/themes';
import { BookmarkIcon, Cross2Icon, EyeOpenIcon } from '@radix-ui/react-icons';
import { SectionHeader } from './SectionHeader';
import { useReservations } from '@/hooks/useReservation';

const statusConfig: Record<string, { label: string; color: 'violet' | 'green' | 'red' | 'gray' }> = {
  pending: { label: 'Menunggu', color: 'violet' },
  picked_up: { label: 'Diambil', color: 'green' },
  rejected: { label: 'Ditolak', color: 'red' },
  expired: { label: 'Kadaluwarsa', color: 'gray' },
};

export const ActiveReservations = () => {
  const resHook = useReservations();

  const { data: response, isLoading } = resHook.list({
    limit: 5,
    orderBy: 'createdAt',
    orderDir: 'desc',
    status: 'pending',
  });

  const [selected, setSelected] = useState<any>(null);

  const reservations = response?.data || [];

  return (
    <>
      <Box className='min-w-0'>
        <SectionHeader title='Reservasi Saya' />

        <Flex direction='column' gap='2'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className='p-3 px-4 rounded-xl'>
                <Skeleton height='40px' />
              </Card>
            ))
          ) : reservations.length === 0 ? (
            <Card className='p-8 rounded-xl border-dashed border-2 flex flex-col items-center justify-center bg-gray-1'>
              <Text size='2' color='gray'>
                Belum ada reservasi buku
              </Text>
            </Card>
          ) : (
            reservations.map((res: any) => {
              const s = statusConfig[res.status] || {
                label: res.status,
                color: 'gray',
              };

              return (
                <Card key={res.id} className='p-3 px-4 rounded-xl hover:bg-gray-2 transition-colors'>
                  <Flex align='center' justify='between' gap='3'>
                    {/* LEFT CLICK */}
                    <Flex align='center' gap='3' className='flex-1 min-w-0 cursor-pointer' onClick={() => setSelected(res)}>
                      <Box className='w-9 h-9 rounded-lg shrink-0 bg-violet-3 text-violet-9 flex items-center justify-center'>
                        <BookmarkIcon width='16' height='16' />
                      </Box>

                      <Box className='min-w-0 flex-1'>
                        <Text size='2' weight='medium' className='block leading-snug truncate'>
                          {res.book?.title}
                        </Text>
                        <Text size='1' color='gray'>
                          Ref: {res.reservationCode ?? `#${res.id}`}
                        </Text>
                      </Box>
                    </Flex>

                    {/* RIGHT */}
                    <Flex align='center' gap='2'>
                      <Flex direction='column' align='end' gap='1'>
                        <Badge color={s.color} radius='full' size='1'>
                          {s.label}
                        </Badge>
                        <Text size='1' color='gray'>
                          {new Date(res.createdAt).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </Text>
                      </Flex>

                      {/* CANCEL (only pending) */}
                      {res.status === 'pending' && (
                        <Button size='1' variant='ghost' color='red'>
                          <Cross2Icon />
                        </Button>
                      )}
                    </Flex>
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

              <Flex direction='column' gap='2'>
                <Text size='2'>
                  <strong>Kode:</strong> {selected.reservationCode ?? `#${selected.id}`}
                </Text>
                <Text size='2'>
                  <strong>Dibuat:</strong> {new Date(selected.createdAt).toLocaleString('id-ID')}
                </Text>
                <Text size='2'>
                  <strong>Status:</strong> {statusConfig[selected.status]?.label}
                </Text>
              </Flex>

              <Flex justify='end' gap='2'>
                <Dialog.Close>
                  <Button variant='soft'>Tutup</Button>
                </Dialog.Close>

                {selected.status === 'pending' && <Button color='red'>Batalkan</Button>}
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
