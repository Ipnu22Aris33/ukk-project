'use client';

import { useMemo } from 'react';
import { DashboardCard, StatItem } from './DashboardCard';
import { useDashboard } from '@/hooks/useDashboard';

export function DashboardContent() {
  const { data: dashboardResponse, isLoading } = useDashboard();

  // ambil data dari response
  const dashboardData = dashboardResponse?.data;
  console.log(dashboardData)

  const stats: StatItem[] = useMemo(() => [
    {
      title: 'Total Buku',
      value: dashboardData?.books.total ?? 0,
      icon: 'mdi:books',
      color: 'indigo',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Buku Dipinjam',
      value: dashboardData?.loans.active ?? 0,
      icon: 'mdi:book-arrow-right',
      color: 'orange',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Buku Dikembalikan',
      value: dashboardData?.returns.total ?? 0,
      icon: 'mdi:book-arrow-left',
      color: 'green',
      trend: '-3%',
      trendUp: false,
    },
    {
      title: 'Anggota',
      value: dashboardData?.members.total ?? 0,
      icon: 'mdi:account-group',
      color: 'cyan',
      trend: '+5%',
      trendUp: true,
    },
  ], [dashboardData]);

  return stats.map((item, index) => (
    <DashboardCard key={item.title} item={item} index={index} loading={isLoading} />
  ));
}
