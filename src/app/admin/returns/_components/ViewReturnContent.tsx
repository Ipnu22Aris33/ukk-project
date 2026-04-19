'use client';

import { DataList, Flex, Button, Text } from '@radix-ui/themes';
import type { ReturnResponse } from '@/lib/schema/return';
import { FineStatusBadge, LoanStatusBadge, type FineStatus, type LoanStatus } from './StatusBadge';

interface ViewReturnContentProps {
  returnData: ReturnResponse;
  onClose: () => void;
}

export function ViewReturnContent({ returnData, onClose }: ViewReturnContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Return ID</DataList.Label>
          <DataList.Value>#{returnData.id}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Loan Information</DataList.Label>
          <DataList.Value>
            <Flex direction='column' gap='1'>
              <Text>Loan ID: #{returnData.loan?.id}</Text>
              <LoanStatusBadge status={returnData.loan?.status as LoanStatus} />
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Member</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{returnData.loan?.member?.fullName}</Text>
              <Text size='1' color='gray'>
                {returnData.loan?.member?.memberClass} - {returnData.loan?.member?.memberCode}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{returnData.loan?.book?.title}</Text>
              <Text size='1' color='gray'>
                by {returnData.loan?.book?.author}
              </Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Fine Amount</DataList.Label>
          <DataList.Value>
            <Flex direction='column' gap='1'>
              <Text weight='bold'>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(returnData.fineAmount || 0)}
              </Text>
              <FineStatusBadge status={returnData.fineStatus as FineStatus} />
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Return Date</DataList.Label>
          <DataList.Value>
            {new Date(returnData.returnedAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </DataList.Value>
        </DataList.Item>

        {returnData.notes && (
          <DataList.Item>
            <DataList.Label>Notes</DataList.Label>
            <DataList.Value>{returnData.notes}</DataList.Value>
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
