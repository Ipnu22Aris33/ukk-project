'use client';

import { Badge } from '@radix-ui/themes';

export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'orange' as const },
  picked_up: { label: 'Picked Up', color: 'green' as const },
  rejected: { label: 'Rejected', color: 'red' as const },
  cancelled: { label: 'Cancelled', color: 'gray' as const },
  fulfilled: { label: 'Fulfilled', color: 'blue' as const },
  expired: { label: 'Expired', color: 'amber' as const },
} as const;

export type ReservationStatus = keyof typeof STATUS_CONFIG;

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}
