'use client';

import { useMemo } from 'react';
import { DashboardCard, StatItem } from './DashboardCard';
import { useDashboard } from '@/hooks/useDashboard';
import { Book, Users2 } from 'lucide-react';

export function DashboardContent() {
  const { data: dashboardResponse, isLoading } = useDashboard();

  // ambil data dari response
  const dashboardData = dashboardResponse?.data;

  const stats: StatItem[] = useMemo(
    () => [
      {
        title: 'Total Buku',
        value: dashboardData?.books.total ?? 0,
        icon: <Book />,
        color: 'indigo',
        trend: '+12%',
        trendUp: true,
      },
      {
        title: 'Buku Dipinjam',
        value: dashboardData?.loans.active ?? 0,
        icon: <Book />,
        color: 'orange',
        trend: '+8%',
        trendUp: true,
      },
      {
        title: 'Buku Dikembalikan',
        value: dashboardData?.returns.total ?? 0,
        icon: <Book />,
        color: 'green',
        trend: '-3%',
        trendUp: false,
      },
      {
        title: 'Anggota',
        value: dashboardData?.members.total ?? 0,
        icon: <Users2 />,
        color: 'cyan',
        trend: '+5%',
        trendUp: true,
      },
    ],
    [dashboardData]
  );

  return stats.map((item, index) => <DashboardCard key={item.title} item={item} index={index} loading={isLoading} />);
}
