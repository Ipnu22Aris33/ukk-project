'use client';

import { Badge } from '@radix-ui/themes';

export const STATUS_CONFIG = {
  borrowed: { label: 'Borrowed', color: 'blue' as const },
  returned: { label: 'Returned', color: 'green' as const },
  overdue: { label: 'Overdue', color: 'red' as const },
  lost: { label: 'Lost', color: 'orange' as const },
} as const;

export type LoanStatus = keyof typeof STATUS_CONFIG;

export function StatusBadge({ status }: { status: LoanStatus }) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}
