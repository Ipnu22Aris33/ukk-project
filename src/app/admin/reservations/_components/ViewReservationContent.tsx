'use client';

import { DataList, Flex, Button, Text, Badge } from '@radix-ui/themes';
import type { ReservationResponse } from '@/lib/schema/reservation';
import { StatusBadge, type ReservationStatus } from './StatusBadge';

interface ViewReservationContentProps {
  reservation: ReservationResponse;
  onClose: () => void;
}

export function ViewReservationContent({ reservation, onClose }: ViewReservationContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Reservation Code</DataList.Label>
          <DataList.Value>
            <Text weight='bold'>{reservation.reservationCode}</Text>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <StatusBadge status={reservation.status as ReservationStatus} />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Member</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{reservation.member?.fullName}</Text>
              <Text size='1' color='gray'>
                {reservation.member?.memberClass} - {reservation.member?.memberCode}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{reservation.book?.title}</Text>
              <Text size='1' color='gray'>
                by {reservation.book?.author}
              </Text>
              <Text size='1' color='gray'>
                Stock: {reservation.book?.totalStock}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Quantity</DataList.Label>
          <DataList.Value>{reservation.quantity}x</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Reserved At</DataList.Label>
          <DataList.Value>
            {new Date(reservation.reservedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </DataList.Value>
        </DataList.Item>

        {reservation.pickedUpAt && (
          <DataList.Item>
            <DataList.Label>Picked Up At</DataList.Label>
            <DataList.Value>
              {new Date(reservation.pickedUpAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </DataList.Value>
          </DataList.Item>
        )}

        {reservation.pickedUpBy && (
          <DataList.Item>
            <DataList.Label>Picked Up By</DataList.Label>
            <DataList.Value>{reservation.pickedUpBy}</DataList.Value>
          </DataList.Item>
        )}

        {reservation.expiresAt && (
          <DataList.Item>
            <DataList.Label>Expires At</DataList.Label>
            <DataList.Value>
              {new Date(reservation.expiresAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </DataList.Value>
          </DataList.Item>
        )}

        {reservation.notes && (
          <DataList.Item>
            <DataList.Label>Notes</DataList.Label>
            <DataList.Value>{reservation.notes}</DataList.Value>
          </DataList.Item>
        )}
      </DataList.Root>

      <Flex gap='3' mt='4' justify='end'>
        <Button variant='soft' onClick={onClose}>
          Close
        </Button>
      </Flex>
    </>
  );
}
