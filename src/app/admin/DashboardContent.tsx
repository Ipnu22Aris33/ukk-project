'use client';

import { Flex } from '@radix-ui/themes';
import { DashboardCard, StatItem } from './DashboardCard';
import { useDashboard } from '@/hooks/useDashboard';

export function DashboardContent() {
  const { data, isLoading, isError } = useDashboard();

  const stats: StatItem[] = [
    { title: 'Total Buku', value: data?.books.total ?? 0, icon: 'mdi:books', color: 'indigo', trend: '+12%', trendUp: true },
    { title: 'Buku Dipinjam', value: data?.loans.active ?? 0, icon: 'mdi:book-arrow-right', color: 'orange', trend: '+8%', trendUp: true },
    { title: 'Buku Dikembalikan', value: data?.returns.total ?? 0, icon: 'mdi:book-arrow-left', color: 'green', trend: '-3%', trendUp: false },
    { title: 'Anggota', value: data?.members.total ?? 0, icon: 'mdi:account-group', color: 'cyan', trend: '+5%', trendUp: true },
  ];

  // map sama, tapi kasih flag loading
  return (
    <>
      {stats.map((item, index) => (
        <DashboardCard key={item.title} item={item} index={index} loading={isLoading} />
      ))}
    </>
  );
}
