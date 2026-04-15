'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  Flex,
  Text,
  Badge,
  Skeleton,
  Dialog,
  Button,
} from '@radix-ui/themes';
import {
  BookmarkIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';
import { useReservations } from '@/hooks/useReservation';

const statusConfig: Record<
  string,
  { label: string; color: 'violet' | 'green' | 'red' | 'gray' }
> = {
  pending: { label: 'Menunggu', color: 'violet' },
  picked_up: { label: 'Diambil', color: 'green' },
  rejected: { label: 'Ditolak', color: 'red' },
  expired: { label: 'Kadaluwarsa', color: 'gray' },
  cancelled: { label: 'Dibatalkan', color: 'gray' },
};

export const ActiveReservations = () => {
  const resHook = useReservations();

  const { data: response, isLoading } = resHook.list({
    limit: 5,
    orderBy: 'createdAt',
    orderDir: 'desc',
    status: 'pending',
  });

  const cancelMutation = resHook.custom;

  const [selected, setSelected] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<string | number | null>(null);

  const reservations = response?.data || [];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const getDaysLeft = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff < 0) return `${Math.abs(diff)} hari lewat`;
    if (diff === 0) return 'Hari ini';
    return `${diff} hari lagi`;
  };

  const handleCancel = (id: string | number) => {
    setLoadingId(id);

    cancelMutation.mutate(
      {
        id,
        action: 'cancel',
        method: 'PATCH', // ✅ FIX UTAMA
      },
      {
        onSuccess: () => {
          setSelected(null);
          setLoadingId(null);
        },
        onError: () => {
          setLoadingId(null);
        },
      }
    );
  };

  return (
    <>
      <Box className='min-w-0'>
        <Text size='4' weight='bold' mb='3'>
          Reservasi Saya
        </Text>

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
              const s =
                statusConfig[res.status] || {
                  label: res.status,
                  color: 'gray',
                };

              const isLoadingCancel = loadingId === res.id;

              return (
                <Card
                  key={res.id}
                  className='p-3 px-4 rounded-xl hover:bg-gray-2 transition-colors cursor-pointer'
                  onClick={() => setSelected(res)}
                >
                  <Flex direction='column' gap='2'>
                    {/* HEADER */}
                    <Flex align='center' justify='between' gap='3'>
                      <Flex align='center' gap='3' className='flex-1 min-w-0'>
                        <Box className='w-9 h-9 rounded-lg shrink-0 bg-violet-3 text-violet-9 flex items-center justify-center'>
                          <BookmarkIcon width='16' height='16' />
                        </Box>

                        <Box className='min-w-0 flex-1'>
                          <Text size='2' weight='medium' className='truncate'>
                            {res.book?.title}
                          </Text>
                          <Text size='1' color='gray'>
                            Ref: {res.reservationCode ?? `#${res.id}`}
                          </Text>
                        </Box>
                      </Flex>

                      <Flex align='center' gap='2'>
                        <Badge color={s.color} radius='full' size='1'>
                          {s.label}
                        </Badge>

                        {/* CANCEL BUTTON */}
                        {res.status === 'pending' && (
                          <Button
                            size='1'
                            variant='ghost'
                            color='red'
                            loading={isLoadingCancel}
                            disabled={isLoadingCancel}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(res.id);
                            }}
                          >
                            <Cross2Icon />
                          </Button>
                        )}
                      </Flex>
                    </Flex>

                    {/* DATE */}
                    <Flex justify='between'>
                      <Text size='1' color='gray'>
                        Dibuat: {formatDate(res.createdAt)}
                      </Text>
                      {res.expiresAt && (
                        <Text size='1' color='gray'>
                          Exp: {formatDate(res.expiresAt)}
                        </Text>
                      )}
                    </Flex>

                    {/* DAYS LEFT */}
                    {res.expiresAt && (
                      <Text
                        size='1'
                        weight='medium'
                        color={
                          getDaysLeft(res.expiresAt).includes('lewat')
                            ? 'red'
                            : 'gray'
                        }
                      >
                        {getDaysLeft(res.expiresAt)}
                      </Text>
                    )}
                  </Flex>
                </Card>
              );
            })
          )}
        </Flex>
      </Box>

      {/* MODAL */}
      <Dialog.Root
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
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
                  <strong>Kode:</strong>{' '}
                  {selected.reservationCode ?? `#${selected.id}`}
                </Text>
                <Text size='2'>
                  <strong>Dibuat:</strong>{' '}
                  {new Date(selected.createdAt).toLocaleString('id-ID')}
                </Text>
                {selected.expiresAt && (
                  <Text size='2'>
                    <strong>Expired:</strong>{' '}
                    {formatDate(selected.expiresAt)}
                  </Text>
                )}
                <Text size='2'>
                  <strong>Status:</strong>{' '}
                  {statusConfig[selected.status]?.label}
                </Text>
              </Flex>

              <Flex justify='end' gap='2'>
                <Dialog.Close>
                  <Button variant='soft'>Tutup</Button>
                </Dialog.Close>

                {selected.status === 'pending' && (
                  <Button
                    color='red'
                    loading={loadingId === selected.id}
                    onClick={() => handleCancel(selected.id)}
                  >
                    <Cross2Icon /> Batalkan
                  </Button>
                )}
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};