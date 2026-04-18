'use client';

import { useState } from 'react';
import { Box, Card, Flex, Text, Badge, Skeleton, Dialog, Button, Separator, Callout } from '@radix-ui/themes';
import { BookmarkIcon, Cross2Icon, CalendarIcon, ClockIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useReservations } from '@/hooks/useReservation';

const statusConfig: Record<string, { label: string; color: 'violet' | 'green' | 'red' | 'gray' }> = {
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

  const [selected, setSelected] = useState<any>(null);
  const [toCancel, setToCancel] = useState<any>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const reservations = response?.data || [];

  const formatDate = (date: string) => new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  const getDaysLeft = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return { text: `${Math.abs(diff)} hari lewat`, color: 'red' as const };
    if (diff === 0) return { text: 'Hari ini', color: 'red' as const };
    if (diff <= 2) return { text: `${diff} hari lagi`, color: 'amber' as const };
    return { text: `${diff} hari lagi`, color: 'gray' as const };
  };

  const handleCancelConfirm = async () => {
    setCancelError(null);
    try {
      await resHook.custom.mutateAsync({ id: toCancel.id, action: 'cancel', method: 'PATCH' });
      setToCancel(null);
      setSelected(null);
    } catch (err: any) {
      setCancelError(err.message ?? 'Gagal membatalkan reservasi, coba lagi.');
    }
  };

  const handleCancelClose = (open: boolean) => {
    if (!open) {
      setToCancel(null);
      setCancelError(null);
    }
  };

  return (
    <>
      <Flex direction='column' gap='3'>
        <Flex align='center' justify='between'>
          <Text size='3' weight='bold'>
            Reservasi Aktif
          </Text>
          {!isLoading && reservations.length > 0 && (
            <Badge color='violet' variant='soft' radius='full'>
              {reservations.length}
            </Badge>
          )}
        </Flex>

        <Flex direction='column' gap='2'>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} style={{ padding: '12px 16px' }}>
                <Skeleton height='56px' />
              </Card>
            ))
          ) : reservations.length === 0 ? (
            <Card style={{ padding: '32px 16px', border: '2px dashed var(--gray-5)', background: 'transparent' }}>
              <Flex direction='column' align='center' gap='2'>
                <Box
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--gray-3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BookmarkIcon width='16' height='16' color='var(--gray-9)' />
                </Box>
                <Text size='2' color='gray'>
                  Belum ada reservasi aktif
                </Text>
              </Flex>
            </Card>
          ) : (
            reservations.map((res: any) => {
              const s = statusConfig[res.status] || { label: res.status, color: 'gray' };
              const exp = res.expiresAt ? getDaysLeft(res.expiresAt) : null;

              return (
                <Card
                  key={res.id}
                  style={{ padding: '12px 14px', cursor: 'pointer', transition: 'background 0.15s' }}
                  className='hover:bg-gray-2'
                  onClick={() => setSelected(res)}
                >
                  <Flex gap='3' align='start'>
                    {/* Cover */}
                    <Box
                      style={{
                        width: 40,
                        height: 56,
                        borderRadius: 6,
                        overflow: 'hidden',
                        flexShrink: 0,
                        position: 'relative',
                        background: 'var(--gray-4)',
                      }}
                    >
                      {res.book?.coverUrl ? (
                        <Image src={res.book.coverUrl} alt={res.book.title} fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <Flex align='center' justify='center' style={{ width: '100%', height: '100%' }}>
                          <BookmarkIcon width='16' height='16' color='var(--gray-8)' />
                        </Flex>
                      )}
                    </Box>

                    <Flex direction='column' gap='1' style={{ flex: 1, minWidth: 0 }}>
                      <Flex align='center' justify='between' gap='2'>
                        <Text size='2' weight='medium' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                          {res.book?.title}
                        </Text>
                        <Flex align='center' gap='1'>
                          <Badge color={s.color} radius='full' size='1' variant='soft'>
                            {s.label}
                          </Badge>
                          {res.status === 'pending' && (
                            <Button
                              size='1'
                              variant='ghost'
                              color='red'
                              onClick={(e) => {
                                e.stopPropagation();
                                setToCancel(res);
                              }}
                            >
                              <Cross2Icon />
                            </Button>
                          )}
                        </Flex>
                      </Flex>

                      <Text size='1' color='gray'>
                        Ref: {res.reservationCode ?? `#${res.id}`}
                      </Text>

                      <Separator size='4' style={{ margin: '4px 0', opacity: 0.5 }} />

                      <Flex align='center' justify='between'>
                        <Flex align='center' gap='1'>
                          <CalendarIcon width='11' height='11' color='var(--gray-9)' />
                          <Text size='1' color='gray'>
                            {formatDate(res.createdAt)}
                          </Text>
                        </Flex>
                        {exp && (
                          <Flex align='center' gap='1'>
                            <ClockIcon width='11' height='11' />
                            <Text size='1' color={exp.color}>
                              {exp.text}
                            </Text>
                          </Flex>
                        )}
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
          <Dialog.Title>Detail Reservasi</Dialog.Title>

          {selected && (
            <Flex direction='column' gap='4'>
              <Flex gap='3'>
                <Box
                  style={{
                    width: 72,
                    height: 100,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                    position: 'relative',
                    background: 'var(--gray-4)',
                  }}
                >
                  {selected.book?.coverUrl ? (
                    <Image src={selected.book.coverUrl} alt={selected.book.title} fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <Flex align='center' justify='center' style={{ width: '100%', height: '100%' }}>
                      <BookmarkIcon width='24' height='24' color='var(--gray-8)' />
                    </Flex>
                  )}
                </Box>
                <Flex direction='column' justify='center' gap='1' style={{ minWidth: 0 }}>
                  <Text weight='bold' size='3' style={{ lineHeight: 1.4 }}>
                    {selected.book?.title}
                  </Text>
                  <Text size='2' color='gray'>
                    {selected.book?.author}
                  </Text>
                  <Badge
                    color={statusConfig[selected.status]?.color ?? 'gray'}
                    variant='soft'
                    radius='full'
                    size='1'
                    style={{ width: 'fit-content', marginTop: 4 }}
                  >
                    {statusConfig[selected.status]?.label ?? selected.status}
                  </Badge>
                </Flex>
              </Flex>

              <Separator size='4' />

              <Flex direction='column' gap='2'>
                <Flex justify='between'>
                  <Text size='2' color='gray'>
                    Kode Reservasi
                  </Text>
                  <Text size='2' weight='medium'>
                    {selected.reservationCode ?? `#${selected.id}`}
                  </Text>
                </Flex>
                <Flex justify='between'>
                  <Text size='2' color='gray'>
                    Dibuat
                  </Text>
                  <Text size='2' weight='medium'>
                    {new Date(selected.createdAt).toLocaleString('id-ID')}
                  </Text>
                </Flex>
                {selected.expiresAt && (
                  <Flex justify='between'>
                    <Text size='2' color='gray'>
                      Kadaluwarsa
                    </Text>
                    <Text size='2' weight='medium'>
                      {formatDate(selected.expiresAt)}
                    </Text>
                  </Flex>
                )}
              </Flex>

              <Flex justify='end' gap='2'>
                <Dialog.Close>
                  <Button variant='soft'>Tutup</Button>
                </Dialog.Close>
                {selected.status === 'pending' && (
                  <Button
                    color='red'
                    variant='soft'
                    onClick={() => {
                      setSelected(null);
                      setToCancel(selected);
                    }}
                  >
                    <Cross2Icon /> Batalkan
                  </Button>
                )}
              </Flex>
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>

      {/* MODAL KONFIRMASI BATAL */}
      <Dialog.Root open={!!toCancel} onOpenChange={handleCancelClose}>
        <Dialog.Content maxWidth='400px'>
          <Dialog.Title>Batalkan Reservasi?</Dialog.Title>
          <Dialog.Description size='2' mb='4'>
            Yakin ingin membatalkan reservasi buku <Text weight='bold'>{toCancel?.book?.title}</Text>? Tindakan ini tidak dapat diurungkan.
          </Dialog.Description>

          {cancelError && (
            <Callout.Root color='red' variant='soft' mb='4' size='1'>
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{cancelError}</Callout.Text>
            </Callout.Root>
          )}

          <Flex gap='3' justify='end'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>
                Kembali
              </Button>
            </Dialog.Close>
            <Button color='red' onClick={handleCancelConfirm} loading={resHook.custom.isPending}>
              Ya, Batalkan
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
