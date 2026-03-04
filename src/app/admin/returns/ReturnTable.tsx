// components/datatable/ReturnTable.tsx
'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog, Badge, Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useReturns } from '@/hooks/useReturns';
import { usePanel } from '@/hooks/usePanel';
import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { ReturnResponse } from '@/lib/schema/return';

/* =========================
   STATUS BADGE CONFIG
========================= */

const FINE_STATUS_CONFIG = {
  PAID: { label: 'Paid', color: 'green' as const },
  UNPAID: { label: 'Unpaid', color: 'red' as const },
  WAIVED: { label: 'Waived', color: 'gray' as const },
} as const;

const LOAN_STATUS_CONFIG = {
  ACTIVE: { label: 'Active', color: 'blue' as const },
  RETURNED: { label: 'Returned', color: 'green' as const },
  OVERDUE: { label: 'Overdue', color: 'red' as const },
} as const;

type FineStatus = keyof typeof FINE_STATUS_CONFIG;
type LoanStatus = keyof typeof LOAN_STATUS_CONFIG;

function FineStatusBadge({ status }: { status: FineStatus }) {
  const config = FINE_STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

function LoanStatusBadge({ status }: { status: LoanStatus }) {
  const config = LOAN_STATUS_CONFIG[status] || { label: status, color: 'gray' as const };
  return <Badge color={config.color}>{config.label}</Badge>;
}

/* =========================
   VIEW CONTENT
========================= */

function ViewReturnContent({ return: returnData, onClose }: { return: ReturnResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Return ID</DataList.Label>
          <DataList.Value>#{returnData.id}</DataList.Value>
        </DataList.Item>

        {/* <DataList.Separator /> */}

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
              <Text size='1' color='gray'>{returnData.loan?.member?.memberClass} - {returnData.loan?.member?.memberCode}</Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Book</DataList.Label>
          <DataList.Value>
            <Flex direction='column'>
              <Text weight='medium'>{returnData.loan?.book?.title}</Text>
              <Text size='1' color='gray'>by {returnData.loan?.book?.author}</Text>
            </Flex>
          </DataList.Value>
        </DataList.Item>

        {/* <DataList.Separator /> */}

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

        {/* <DataList.Separator /> */}

        <DataList.Item>
          <DataList.Label>Return Date</DataList.Label>
          <DataList.Value>
            {new Date(returnData.returnedAt).toLocaleDateString('id-ID', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </DataList.Value>
        </DataList.Item>

        {returnData.notes && (
          <>
            {/* <DataList.Separator /> */}
            <DataList.Item>
              <DataList.Label>Notes</DataList.Label>
              <DataList.Value>{returnData.notes}</DataList.Value>
            </DataList.Item>
          </>
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

/* =========================
   MAIN COMPONENT
========================= */

export function ReturnTable() {
  const returns = useReturns();
  const { mode, selected, open, close } = usePanel<ReturnResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = returns.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<ReturnResponse>[] = [
    {
      accessorKey: 'id',
      header: 'Return ID',
      cell: ({ row }) => <Text color='gray'>#{row.original.id}</Text>,
    },
    {
      accessorKey: 'loan.member.fullName',
      header: 'Member',
      cell: ({ row }) => (
        <Flex direction='column'>
          <Text weight='medium'>{row.original.loan?.member?.fullName}</Text>
          <Text size='1' color='gray'>{row.original.loan?.member?.memberClass}</Text>
        </Flex>
      ),
    },
    {
      accessorKey: 'loan.book.title',
      header: 'Book',
      cell: ({ row }) => (
        <Flex direction='column'>
          <Text>{row.original.loan?.book?.title}</Text>
          <Text size='1' color='gray'>{row.original.loan?.book?.author}</Text>
        </Flex>
      ),
    },
    {
      accessorKey: 'fineAmount',
      header: 'Fine Amount',
      cell: ({ row }) => (
        <Text>
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
          }).format(row.original.fineAmount || 0)}
        </Text>
      ),
    },
    {
      accessorKey: 'fineStatus',
      header: 'Fine Status',
      cell: ({ row }) => <FineStatusBadge status={row.original.fineStatus as FineStatus} />,
    },
    {
      accessorKey: 'condition',
      header: 'Condition',
      cell: ({ row }) => <Text>{row.original.condition}</Text>,
    },
    {
      accessorKey: 'returnedAt',
      header: 'Return Date',
      cell: ({ row }) => new Date(row.original.returnedAt).toLocaleDateString('id-ID'),
    },
  ];

  const rowActions: () => RowAction<ReturnResponse>[] = () => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
  ];

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Returns' },
  ];

  const renderPanelContent = () => {
    if (mode === 'view' && selected) {
      return <ViewReturnContent return={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'view' ? 'Return Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Returns Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          meta={data?.meta}
          isLoading={isLoading}
          onRefresh={refetch}
          searchValue={search}
          onSearchChange={setSearch}
          page={page}
          onPageChange={setPage}
          onPageSizeChange={setLimit}
          rowActions={rowActions}
          enableSearch
          enablePagination
          showAdd={false} // Explicitly set to false to hide add button
          showPrint
          showRefresh
        />
      </Container>

      <Panel 
        open={mode === 'view'} 
        onClose={close} 
        title={panelTitle} 
        width={500}
      >
        {renderPanelContent()}
      </Panel>

      
    </Box>
  );
}