'use client';

import { Box, Card, Flex, Text, Badge, Skeleton } from '@radix-ui/themes';
import { BookmarkIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SectionHeader } from './SectionHeader';
import { useReservations } from '@/hooks/useReservation'; // Pastikan hook ini sudah dibuat via createCRUD

const statusConfig: Record<string, { label: string; color: 'violet' | 'green' | 'red' | 'gray' }> = {
  pending: { label: 'Menunggu', color: 'violet' },
  picked_up: { label: 'Diambil', color: 'green' },
  rejected: { label: 'Ditolak', color: 'red' },
  expired: { label: 'Kadaluwarsa', color: 'gray' },
};

export const ActiveReservations = () => {
  const router = useRouter();
  const resHook = useReservations();

  const { data: response, isLoading } = resHook.list({
    limit: 5,
    orderBy: 'createdAt',
    orderDir: 'desc',
    status: 'pending',
  });

  const reservations = response?.data || [];

  return (
    <Box className='min-w-0'>
      <SectionHeader title='Reservasi Saya' action='Lihat semua' onAction={() => router.push('/member/reservations')} />

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
            const s = statusConfig[res.status] || { label: res.status, color: 'gray' };

            return (
              <Card
                key={res.id}
                className='p-3 px-4 rounded-xl cursor-pointer hover:bg-gray-2 transition-colors'
                onClick={() => router.push(`/member/reservations/${res.id}`)}
              >
                <Flex align='center' justify='between' gap='3'>
                  <Flex align='center' gap='3' className='flex-1 min-w-0'>
                    <Box className='w-9 h-9 rounded-lg shrink-0 bg-violet-3 text-violet-9 flex items-center justify-center'>
                      <BookmarkIcon width='16' height='16' />
                    </Box>
                    <Box className='min-w-0 flex-1'>
                      <Text size='2' weight='medium' className='block leading-snug truncate'>
                        {res.book?.title}
                      </Text>
                      <Text size='1' color='gray' className='block leading-snug'>
                        Ref: {res.reservationCode ?? `#${res.id}`}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex direction='column' align='end' gap='1' className='shrink-0'>
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
                </Flex>
              </Card>
            );
          })
        )}
      </Flex>
    </Box>
  );
};
