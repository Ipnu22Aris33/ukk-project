'use client';

import { Eye, XCircle, PackageCheck } from 'lucide-react';
import { CrossCircledIcon } from '@radix-ui/react-icons';
import { RowAction } from '@/components/features/datatable';
import type { ReservationResponse } from '@/lib/schema/reservation';

interface RowActionsProps {
  open: (mode: string, row: ReservationResponse) => void;
  setPickedUpTarget: (row: ReservationResponse) => void;
  setCancelTarget: (row: ReservationResponse) => void;
  setRejectTarget: (row: ReservationResponse) => void;
}

export const getRowActions = ({ open, setPickedUpTarget, setCancelTarget, setRejectTarget }: RowActionsProps) => {
  return (row: ReservationResponse): RowAction<ReservationResponse>[] => {
    const actions: RowAction<ReservationResponse>[] = [
      {
        key: 'view',
        label: 'View Details',
        icon: <Eye size={16} />,
        color: 'blue',
        onClick: () => open('view', row),
      },
    ];

    if (row.status === 'pending') {
      actions.push(
        {
          key: 'picked_up',
          label: 'Mark as Picked Up',
          icon: <PackageCheck size={16} />,
          color: 'green',
          onClick: () => setPickedUpTarget(row),
        },
        {
          key: 'cancel',
          label: 'Cancel',
          icon: <XCircle size={16} />,
          color: 'orange',
          onClick: () => setCancelTarget(row),
        },
        {
          key: 'reject',
          label: 'Reject',
          icon: <CrossCircledIcon />,
          color: 'red',
          onClick: () => setRejectTarget(row),
        }
      );
    }

    return actions;
  };
};
