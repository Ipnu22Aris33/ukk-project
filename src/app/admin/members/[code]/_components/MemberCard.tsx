'use client';

import { Card, Flex, Text, Badge, Skeleton, Separator, Grid, Box } from '@radix-ui/themes';
import { useMembers } from '@/hooks/useMembers';
import { getInitials } from '@/lib/utils/getInitials';

export function MemberCard({ code }: { code: string }) {
  const members = useMembers();
  const { data, isLoading } = members.getBy('code', code);

  const member = data?.data;

  return (
    <Card size='3' >
      <Flex direction='column' gap='4' align='center'>
        {/* Avatar + Identity - Center */}
        <Flex direction='column' align='center' gap='2' style={{ width: '100%' }}>
          <Flex
            align='center'
            justify='center'
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--amber-9), var(--amber-7))',
              flexShrink: 0,
            }}
          >
            <Text size='6' weight='bold' style={{ color: '#fff' }}>
              {isLoading ? '??' : getInitials(member?.fullName || '??')}
            </Text>
          </Flex>

          <Box style={{ textAlign: 'center' }}>
            <Skeleton loading={isLoading} style={{ width: 160, height: 24 }}>
              <Text as='div' size='5' weight='bold'>
                {member?.fullName || '—'}
              </Text>
            </Skeleton>
            <Skeleton loading={isLoading} style={{ width: 120, height: 14, marginTop: 6 }}>
              <Text as='div' size='1' color='gray'>
                {member?.memberClass ? `Student · ${member.memberClass}` : '—'}
              </Text>
            </Skeleton>
          </Box>

          <Skeleton loading={isLoading} style={{ width: 100, height: 22 }}>
            <Badge color={member?.isActive ? 'green' : 'gray'} variant='soft' radius='full'>
              {member?.isActive ? 'Active Member' : 'Inactive'}
            </Badge>
          </Skeleton>
        </Flex>

        <Separator size='4' style={{ width: '100%' }} />

        {/* Info list - Left aligned */}
        <Flex direction='column' gap='3' style={{ width: '100%' }}>
          <InfoRow label='Member Code' value={member?.memberCode} loading={isLoading} />
          <InfoRow label='Major' value={member?.major} loading={isLoading} />
          <InfoRow label='Phone' value={member?.phone} loading={isLoading} />
          <InfoRow label='Address' value={member?.address} loading={isLoading} />
        </Flex>

        <Separator size='4' style={{ width: '100%' }} />

        {/* Stats - Full width */}
      </Flex>
    </Card>
  );
}

function InfoRow({ label, value, loading }: { label: string; value?: string | null; loading: boolean }) {
  return (
    <Flex direction='column' gap='1'>
      <Text size='1' color='gray' style={{ letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 10 }}>
        {label}
      </Text>
      <Skeleton loading={loading} style={{ width: 140, height: 16 }}>
        <Text size='2' color='gray' highContrast>
          {value || '—'}
        </Text>
      </Skeleton>
    </Flex>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: 'blue' | 'amber' }) {
  return (
    <Card variant='surface' size='1'>
      <Flex direction='column' gap='1'>
        <Text size='5' weight='bold' color={color} style={{ fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
          {value}
        </Text>
        <Text size='1' color='gray' style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 10 }}>
          {label}
        </Text>
      </Flex>
    </Card>
  );
}
