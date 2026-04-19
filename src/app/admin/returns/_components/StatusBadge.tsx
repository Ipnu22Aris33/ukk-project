'use client';

import { Badge } from '@radix-ui/themes';

export const FINE_STATUS_CONFIG = {
  paid: { label: 'Paid', color: 'green' as const },
  unpaid: { label: 'Unpaid', color: 'red' as const },
  none: { label: 'None', color: 'gray' as const },
} as const;

export const LOAN_STATUS_CONFIG = {
  active: { label: 'Active', color: 'blue' as const },
  returned: { label: 'Returned', color: 'green' as const },
  overdue: { label: 'Overdue', color: 'red' as const },
} as const;

export const CONDITION_CONFIG = {
  good: { label: 'Good', color: 'green' as const },
  damaged: { label: 'Damaged', color: 'red' as const },
  lost: { label: 'Lost', color: 'gray' as const },
} as const;

export type FineStatus = keyof typeof FINE_STATUS_CONFIG;
export type LoanStatus = keyof typeof LOAN_STATUS_CONFIG;
export type ConditionStatus = keyof typeof CONDITION_CONFIG;


export function FineStatusBadge({ status }: { status: FineStatus }) {
  const config = FINE_STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const config = LOAN_STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

export function ConditionBadge({ status }: { status: ConditionStatus }) {
  const config = CONDITION_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}