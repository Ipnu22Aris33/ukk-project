'use client';

import { Card, Flex, Text, Skeleton, Grid } from '@radix-ui/themes';
import {
  ReaderIcon,
  ClockIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
  BookmarkIcon,
} from '@radix-ui/react-icons';

// =====================
// DUMMY DATA
// Nanti ganti dengan useLoans() dan useReservations()
// =====================
const useMemberStats = () => {
  // Simulasi loading
  const isLoading = false;

  // Dummy — nanti dihitung dari response api/loans & api/reservations
  return {
    isLoading,
    activeLoans: 3,           // loans.filter(l => l.status === 'active').length
    dueDaysLeft: 2,           // min(loans.map(l => diffDays(l.dueDate, today)))
    overdueCount: 1,          // loans.filter(l => l.status === 'overdue').length
    activeReservations: 2,    // reservations.filter(r => r.status === 'pending').length
    finesTotalRp: 5000,       // fines.filter(f => !f.paid).reduce((a, f) => a + f.amount, 0)
    totalReturned: 14,        // loans.filter(l => l.status === 'returned').length
  };
};

// =====================
// HELPERS
// =====================
const formatRp = (amount: number) =>
  amount === 0 ? 'Lunas' : `Rp ${amount.toLocaleString('id-ID')}`;

const formatDue = (days: number) => {
  if (days < 0) return 'Terlambat';
  if (days === 0) return 'Hari ini';
  return `${days} hari lagi`;
};

// =====================
// STATS CONFIG
// =====================
type StatColor = 'blue' | 'orange' | 'red' | 'violet' | 'crimson' | 'green';

interface Stat {
  label: string;
  value: string;
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
  const {
    isLoading,
    activeLoans,
    dueDaysLeft,
    overdueCount,
    activeReservations,
    finesTotalRp,
    totalReturned,
  } = useMemberStats();

  const stats: Stat[] = [
    {
      label: 'Sedang Dipinjam',
      value: String(activeLoans),
      icon: ReaderIcon,
      color: 'blue',
    },
    {
      label: 'Jatuh Tempo',
      value: formatDue(dueDaysLeft),
      icon: ClockIcon,
      color: dueDaysLeft <= 1 ? 'red' : 'orange',
      urgent: dueDaysLeft <= 1,
    },
    {
      label: 'Terlambat',
      value: String(overdueCount),
      icon: ExclamationTriangleIcon,
      color: overdueCount > 0 ? 'red' : 'green',
      urgent: overdueCount > 0,
    },
    {
      label: 'Reservasi Aktif',
      value: String(activeReservations),
      icon: BookmarkIcon,
      color: 'violet',
    },
    {
      label: 'Denda',
      value: formatRp(finesTotalRp),
      icon: ExclamationTriangleIcon,
      color: finesTotalRp > 0 ? 'crimson' : 'green',
      urgent: finesTotalRp > 0,
    },
    {
      label: 'Total Selesai',
      value: String(totalReturned),
      icon: CheckCircledIcon,
      color: 'green',
    },
  ];

  return (
    <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap='3'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const { bg, text } = colorMap[stat.color];

        return (
          <Card
            key={stat.label}
            variant={stat.urgent ? 'surface' : 'surface'}
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-4)',
              outline: stat.urgent ? `1.5px solid ${text}40` : undefined,
            }}
          >
            <Flex direction='column' gap='2'>
              {/* Icon */}
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

              {/* Value */}
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

              {/* Label */}
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