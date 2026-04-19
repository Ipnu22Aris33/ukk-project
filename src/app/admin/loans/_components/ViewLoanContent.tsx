'use client';

import { DataList, Flex, Button, Text } from '@radix-ui/themes';
import type { LoanResponse } from '@/lib/schema/loan';
import { StatusBadge, type LoanStatus } from './StatusBadge';

interface ViewLoanContentProps {
  loan: LoanResponse;
  onClose: () => void;
}

export function ViewLoanContent({ loan, onClose }: ViewLoanContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Loan ID</DataList.Label>
          <DataList.Value>#{loan.id}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Status</DataList.Label>
          <DataList.Value>
            <StatusBadge status={loan.status as LoanStatus} />
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Member</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{loan.member?.fullName}</Text>
              <Text size='1' color='gray'>
                {loan.member?.memberClass} - {loan.member?.memberCode}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{loan.book?.title}</Text>
              <Text size='1' color='gray'>
                by {loan.book?.author}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Quantity</DataList.Label>
          <DataList.Value>{loan.quantity}x</DataList.Value>
        </DataList.Item>

        {loan.reservation && (
          <DataList.Item>
            <DataList.Label>Reservation</DataList.Label>
            <DataList.Value>#{loan.reservation.id}</DataList.Value>
          </DataList.Item>
        )}

        <DataList.Item>
          <DataList.Label>Loan Date</DataList.Label>
          <DataList.Value>
            {new Date(loan.loanDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Due Date</DataList.Label>
          <DataList.Value>
            {new Date(loan.dueDate).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </DataList.Value>
        </DataList.Item>

        {loan.notes && (
          <DataList.Item>
            <DataList.Label>Notes</DataList.Label>
            <DataList.Value>{loan.notes}</DataList.Value>
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
