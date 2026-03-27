'use client';

import { Card, Flex, Text, Skeleton, Grid } from '@radix-ui/themes';
import {
  ReaderIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';
import { useProfile } from '@/hooks/useProfile'; // Import hook yang tadi

// =====================
// HELPERS
// =====================
const formatRp = (amount: number) =>
  amount === 0 ? 'Lunas' : `Rp ${amount.toLocaleString('id-ID')}`;

// =====================
// STATS CONFIG
// =====================
type StatColor = 'blue' | 'orange' | 'red' | 'violet' | 'crimson' | 'green';

interface Stat {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: StatColor;
  urgent?: boolean;
}

const colorMap: Record<StatColor, { bg: string; text: string }> = {
  blue:    { bg: 'var(--blue-3)',    text: 'var(--blue-11)'    },
  orange:  { bg: 'var(--orange-3)',  text: 'var(--orange-11)'  },
  red:     { bg: 'var(--red-3)',     text: 'var(--red-11)'     },
  violet:  { bg: 'var(--violet-3)',  text: 'var(--violet-11)'  },
  crimson: { bg: 'var(--crimson-3)', text: 'var(--crimson-11)' },
  green:   { bg: 'var(--green-3)',   text: 'var(--green-11)'   },
};

// =====================
// COMPONENT
// =====================
export const StatsSection = () => {
  // 1. Ambil data asli dari API
  const { data, isLoading } = useProfile();

  // 2. Mapping data dari API ke variabel lokal
  const summary = data?.data.summary;
  
  const stats: Stat[] = [
    {
      label: 'Sedang Dipinjam',
      value: summary?.loans.active ?? 0,
      icon: ReaderIcon,
      color: 'blue',
    },
    {
      label: 'Terlambat',
      value: summary?.loans.overdue ?? 0,
      icon: ExclamationTriangleIcon,
      color: (summary?.loans.overdue ?? 0) > 0 ? 'red' : 'green',
      urgent: (summary?.loans.overdue ?? 0) > 0,
    },
    {
      label: 'Reservasi Aktif',
      value: summary?.reservations.active ?? 0,
      icon: BookmarkIcon,
      color: 'violet',
    },
    {
      label: 'Total Selesai',
      value: summary?.returns.total ?? 0,
      icon: CheckCircledIcon,
      color: 'green',
    },
    // Contoh Denda (Jika di API summary nanti kamu tambahkan field denda)
    {
      label: 'Status Denda',
      value: 'Lunas', // Sementara hardcoded atau sesuaikan jika ada field denda
      icon: ClockIcon,
      color: 'green',
    },
  ];

  return (
    <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap='3'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const { bg, text } = colorMap[stat.color];

        return (
          <Card
            key={stat.label}
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-4)',
              outline: stat.urgent ? `1.5px solid ${text}40` : undefined,
            }}
          >
            <Flex direction='column' gap='2'>
              <Flex
                align='center'
                justify='center'
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-3)',
                  backgroundColor: bg,
                  color: text,
                  flexShrink: 0,
                }}
              >
                <Icon width='15' height='15' />
              </Flex>

              <Skeleton loading={isLoading}>
                <Text
                  size='5'
                  weight='bold'
                  style={{
                    lineHeight: 1,
                    color: stat.urgent ? text : undefined,
                  }}
                >
                  {stat.value}
                </Text>
              </Skeleton>

              <Text size='1' color='gray'>
                {stat.label}
              </Text>
            </Flex>
          </Card>
        );
      })}
    </Grid>
  );
};