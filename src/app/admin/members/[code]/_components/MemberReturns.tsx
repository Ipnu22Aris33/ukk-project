'use client';

import { Text, Card, Flex, Badge, Box, Spinner, DataList, Separator } from '@radix-ui/themes';
import { useMembers } from '@/hooks/useMembers';
import { BookOpen, CalendarCheck, DollarSign, CheckCircle2 } from 'lucide-react';

interface MemberReturnsProps {
  code: string;
}

export function MemberReturns({ code }: MemberReturnsProps) {
  const members = useMembers();

  // 🔥 ambil returns by member code
  const { data, isLoading } = members.getByPath(['code', code, 'returns']);

  const raw = data?.data;
  const returnList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  if (isLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data pengembalian...
        </Text>
      </Flex>
    );
  }

  if (!returnList.length) {
    return (
      <Card variant='surface' style={{ border: '1px dashed var(--gray-6)' }}>
        <Flex direction='column' align='center' gap='2' py='6'>
          <BookOpen size={28} color='var(--gray-8)' />
          <Text size='2' color='gray'>
            Tidak ada riwayat pengembalian.
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction='column' gap='3'>
      {returnList.map((returnData) => (
        <Card key={returnData.id} variant='surface'>
          <Flex direction='column' gap='3'>
            {/* Header */}
            <Flex align='center' justify='between'>
              <Flex align='center' gap='2'>
                <CheckCircle2 size={18} color='var(--green-9)' />
                <Text size='2' weight='bold'>
                  Return #{returnData.id}
                </Text>
              </Flex>
              <Badge color={returnData.fineStatus === 'PAID' ? 'green' : 'red'} variant='soft' radius='full'>
                {returnData.fineStatus === 'PAID' ? 'Paid' : 'Unpaid'}
              </Badge>
            </Flex>

            <Separator size='4' />

            {/* Book Info */}
            <Flex gap='3' align='start'>
              <Box style={{ flex: 1 }}>
                <Text size='1' color='gray'>
                  Book Title
                </Text>
                <Text size='2' weight='medium'>
                  {returnData.loan?.book?.title || 'Unknown Title'}
                </Text>
              </Box>
              <Box style={{ flex: 1 }}>
                <Text size='1' color='gray'>
                  Author
                </Text>
                <Text size='2'>{returnData.loan?.book?.author || '-'}</Text>
              </Box>
            </Flex>

            {/* Return Details */}
            <Flex gap='3'>
              <Box style={{ flex: 1 }}>
                <Text size='1' color='gray'>
                  Return Date
                </Text>
                <Flex align='center' gap='1' mt='1'>
                  <CalendarCheck size={14} />
                  <Text size='2'>
                    {new Date(returnData.returnedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Text>
                </Flex>
              </Box>
              <Box style={{ flex: 1 }}>
                <Text size='1' color='gray'>
                  Condition
                </Text>
                <Badge color={returnData.condition === 'good' ? 'green' : returnData.condition === 'damaged' ? 'orange' : 'red'} variant='soft'>
                  {returnData.condition === 'good' ? 'Good' : returnData.condition === 'damaged' ? 'Damaged' : 'Lost'}
                </Badge>
              </Box>
            </Flex>

            {/* Fine Amount */}
            {returnData.fineAmount > 0 && (
              <Flex gap='3'>
                <Box style={{ flex: 1 }}>
                  <Text size='1' color='gray'>
                    Fine Amount
                  </Text>
                  <Flex align='center' gap='1' mt='1'>
                    <DollarSign size={14} />
                    <Text size='2' weight='bold' color='red'>
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                      }).format(returnData.fineAmount)}
                    </Text>
                  </Flex>
                </Box>
                {returnData.loan?.dueDate && (
                  <Box style={{ flex: 1 }}>
                    <Text size='1' color='gray'>
                      Due Date
                    </Text>
                    <Text size='2'>{new Date(returnData.loan.dueDate).toLocaleDateString('id-ID')}</Text>
                  </Box>
                )}
              </Flex>
            )}

            {/* Notes */}
            {returnData.notes && (
              <>
                <Separator size='4' />
                <Box>
                  <Text size='1' color='gray'>
                    Notes
                  </Text>
                  <Text size='2' color='gray' mt='1'>
                    {returnData.notes}
                  </Text>
                </Box>
              </>
            )}
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
