'use client';

import { Dialog, DataList, Flex, Button, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import type { ReturnResponse } from '@/lib/schema/return';

interface PayFineDialogProps {
  returnData: ReturnResponse;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function PayFineDialog({ returnData, open, onClose, onConfirm, isLoading }: PayFineDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !isLoading && onClose()}>
      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>Confirm Fine Payment</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          Please confirm the following fine payment details.
        </Dialog.Description>

        <DataList.Root size='2' mb='4'>
          <DataList.Item>
            <DataList.Label minWidth='100px'>Member</DataList.Label>
            <DataList.Value>
              <Flex direction='column'>
                <Text weight='medium'>{returnData.loan?.member?.fullName}</Text>
                <Text size='1' color='gray'>
                  {returnData.loan?.member?.memberClass} – {returnData.loan?.member?.memberCode}
                </Text>
              </Flex>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth='100px'>Book</DataList.Label>
            <DataList.Value>
              <Text>{returnData.loan?.book?.title}</Text>
            </DataList.Value>
          </DataList.Item>

          <DataList.Item>
            <DataList.Label minWidth='100px'>Fine Amount</DataList.Label>
            <DataList.Value>
              <Text weight='bold' color='red'>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(returnData.fineAmount || 0)}
              </Text>
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <Flex gap='3' justify='end'>
          <Button variant='soft' color='gray' onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button color='green' onClick={onConfirm} loading={isLoading}>
            <Icon icon='mdi:cash-check' />
            Confirm Payment
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
