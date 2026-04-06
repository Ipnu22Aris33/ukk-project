'use client';
import { Card, Flex, Box, Heading, Text, Badge } from '@radix-ui/themes';

export type StatItem = {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend: string;
  trendUp: boolean;
};

export function DashboardCard({ item, index, loading = false }: { item: StatItem; index: number; loading?: boolean }) {
  return (
    <Card
      variant='surface'
      style={{
        flex: '1 1 calc(25% - 1rem)',
        minWidth: '220px',
        height: '150px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, var(--color-background) 0%, var(--gray-2) 100%)',
        border: '1px solid var(--gray-6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {loading ? (
        <Box
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '12px',
            background: 'var(--gray-3)',
            animation: 'pulse 1.5s infinite',
          }}
        />
      ) : (
        <Flex direction='column' gap='4'>
          <Flex justify='between' align='start'>
            <Box
              style={{
                background: `var(--${item.color}-3)`,
                padding: '12px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </Box>

            <Badge color={item.trendUp ? 'green' : 'red'} variant='soft' size='1'>
              <Flex align='center' gap='1'>
                <Badge>
                  <Text size='1'>{item.trend}</Text>
                </Badge>
              </Flex>
            </Badge>
          </Flex>

          <Flex direction='column' gap='1'>
            <Text size='2' color='gray' style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
              {item.title}
            </Text>
            <Heading
              size='7'
              style={{
                background: `linear-gradient(135deg, var(--${item.color}-11) 0%, var(--${item.color}-9) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {item.value.toLocaleString()}
            </Heading>
          </Flex>

          <Box style={{ width: '100%', height: '4px', background: 'var(--gray-4)', borderRadius: '999px', overflow: 'hidden' }}>
            <Box
              style={{
                width: `${Math.min(100, (index + 1) * 25)}%`,
                height: '100%',
                background: `var(--${item.color}-9)`,
                borderRadius: '999px',
                transition: 'width 1s ease',
              }}
            />
          </Box>
        </Flex>
      )}
    </Card>
  );
}
