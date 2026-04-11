'use client';

import { Text, Card, Flex, Badge, Box, Tooltip, IconButton, Spinner } from '@radix-ui/themes';
import { Check, X, Info } from 'lucide-react';
import { useReservations } from '@/hooks/useReservation';

export function MemberReservations({ code }: { code: string }) {
  const reservations = useReservations();

  const { data, isLoading: isListLoading } = reservations.getBy('members', code);

  const { mutate: performAction, isPending: isUpdating } = reservations.custom;

  const raw = data?.data;
  const reservationList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const handleAction = (id: string | number, action: 'approve' | 'reject') => {
    performAction(
      {
        id,
        action,
        method: 'PATCH',
      },
      {
        onSuccess: () => {
          reservations.invalidate.all();
        },
      }
    );
  };

  if (isListLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data reservasi...
        </Text>
      </Flex>
    );
  }

  if (!reservationList.length) {
    return (
      <Flex p='4' justify='center'>
        <Card variant='ghost' style={{ border: '1px dashed var(--gray-6)' }}>
          <Text size='2' color='gray' align='center' as='div'>
            Tidak ada data reservasi ditemukan.
          </Text>
        </Card>
      </Flex>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'amber';
      case 'canceled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  return (
    <Flex direction='column' gap='3'>
      {reservationList.map((res) => (
        <Card key={res.id} variant='surface'>
          <Flex align='center' justify='between' gap='3'>
            {/* Sisi Kiri: Informasi Buku */}
            <Box>
              <Text as='div' size='2' weight='bold' mb='1'>
                {res.book?.title || 'Judul Tidak Diketahui'}
              </Text>
              <Flex gap='3' align='center'>
                <Text size='1' color='gray' style={{ fontFamily: 'monospace' }}>
                  #{res.id}
                </Text>
                <Badge color={getStatusColor(res.status)} variant='soft' radius='full'>
                  {res.status?.toUpperCase()}
                </Badge>
                {res.quantity > 1 && (
                  <Text size='1' color='gray'>
                    {res.quantity} eksamplar
                  </Text>
                )}
              </Flex>
            </Box>

            {/* Sisi Kanan: Tombol Aksi */}
            <Flex gap='2'>
              <Tooltip content='Lihat Detail'>
                <IconButton size='2' variant='soft' color='gray' highContrast>
                  <Info size={16} />
                </IconButton>
              </Tooltip>

              {res.status?.toLowerCase() === 'pending' && (
                <>
                  <Tooltip content='Tolak Reservasi'>
                    <IconButton size='2' variant='soft' color='red' disabled={isUpdating} onClick={() => handleAction(res.id, 'reject')}>
                      <X size={16} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip content='Setujui (Buku Diambil)'>
                    <IconButton size='2' variant='solid' color='green' disabled={isUpdating} onClick={() => handleAction(res.id, 'approve')}>
                      <Check size={16} />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
