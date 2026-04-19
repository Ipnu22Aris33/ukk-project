// components/datatable/reservation/ReservationActionDialogs.tsx
'use client';

import { Flex, Button, Dialog, Text, DataList, Badge } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { XCircle } from 'lucide-react';
import type { ReservationResponse } from '@/lib/schema/reservation';

interface BaseDialogProps {
  reservation: ReservationResponse;
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
}

export function PickedUpDialog({ reservation, open, onClose, onConfirm, isLoading }: BaseDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>Confirm Book Pickup</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          Confirm that the member has picked up the book.
        </Dialog.Description>

        <DataList.Root size='2' mb='4'>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Reservation</DataList.Label>
            <DataList.Value><Text weight='bold'>{reservation.reservationCode}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Member</DataList.Label>
            <DataList.Value>
              <Flex direction='column'>
                <Text weight='medium'>{reservation.member?.fullName}</Text>
                <Text size='1' color='gray'>
                  {reservation.member?.memberClass} – {reservation.member?.memberCode}
                </Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Book</DataList.Label>
            <DataList.Value><Text>{reservation.book?.title}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Status After</DataList.Label>
            <DataList.Value><Badge color='green'>Picked Up</Badge></DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex gap='3' justify='end'>
          <Button variant='soft' color='gray' onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button color='green' onClick={onConfirm} loading={isLoading}>
            <CheckCircledIcon />
            Confirm Pickup
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function CancelDialog({ reservation, open, onClose, onConfirm, isLoading }: BaseDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>Cancel Reservation</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          Are you sure you want to cancel this reservation?
        </Dialog.Description>

        <DataList.Root size='2' mb='4'>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Reservation</DataList.Label>
            <DataList.Value><Text weight='bold'>{reservation.reservationCode}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Member</DataList.Label>
            <DataList.Value>
              <Flex direction='column'>
                <Text weight='medium'>{reservation.member?.fullName}</Text>
                <Text size='1' color='gray'>
                  {reservation.member?.memberClass} – {reservation.member?.memberCode}
                </Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Book</DataList.Label>
            <DataList.Value><Text>{reservation.book?.title}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Status After</DataList.Label>
            <DataList.Value><Badge color='orange'>Cancelled</Badge></DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex gap='3' justify='end'>
          <Button variant='soft' color='gray' onClick={onClose} disabled={isLoading}>Back</Button>
          <Button color='orange' onClick={onConfirm} loading={isLoading}>
            <XCircle size={16} />
            Cancel Reservation
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function RejectDialog({ reservation, open, onClose, onConfirm, isLoading }: BaseDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>Reject Reservation</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          Reject this reservation. The member will be notified.
        </Dialog.Description>

        <DataList.Root size='2' mb='4'>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Reservation</DataList.Label>
            <DataList.Value><Text weight='bold'>{reservation.reservationCode}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Member</DataList.Label>
            <DataList.Value>
              <Flex direction='column'>
                <Text weight='medium'>{reservation.member?.fullName}</Text>
                <Text size='1' color='gray'>
                  {reservation.member?.memberClass} – {reservation.member?.memberCode}
                </Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Book</DataList.Label>
            <DataList.Value><Text>{reservation.book?.title}</Text></DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth='120px'>Status After</DataList.Label>
            <DataList.Value><Badge color='red'>Rejected</Badge></DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex gap='3' justify='end'>
          <Button variant='soft' color='gray' onClick={onClose} disabled={isLoading}>Back</Button>
          <Button color='red' onClick={onConfirm} loading={isLoading}>
            <CrossCircledIcon />
            Reject
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}