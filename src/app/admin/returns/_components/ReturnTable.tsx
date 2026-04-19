'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { useReturns } from '@/hooks/useReturns';
import { usePanel } from '@/hooks/usePanel';
import type { ReturnResponse } from '@/lib/schema/return';
import { returnColumns } from './Columns';
import { getRowActions } from './RowActions';
import { PayFineDialog } from './PayFineDialog';
import { ViewReturnContent } from './ViewReturnContent';

export function ReturnTable() {
  const returns = useReturns();
  const { mode, selected, open, close } = usePanel<ReturnResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // State untuk pay fine dialog
  const [payTarget, setPayTarget] = useState<ReturnResponse | null>(null);

  const { data, isLoading, refetch } = returns.list({ page, search, limit });
  const { mutateAsync: payFine, isPending: isPaying } = returns.custom;

  const handlePayConfirm = async () => {
    if (!payTarget) return;
    await payFine({
      id: payTarget.id,
      action: 'payment',
      method: 'POST',
    });
    setPayTarget(null);
    refetch();
  };

  const rowActions = getRowActions(open, setPayTarget);

  const renderPanelContent = () => {
    if (mode === 'view' && selected) {
      return <ViewReturnContent returnData={selected} onClose={close} />;
    }
    return null;
  };

  return (
    <Box>
      <Container size='4' py='6'>
        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Returns Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={returnColumns}
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
          showAdd={false}
          showPrint
          showRefresh
        />
      </Container>

      {/* Panel: View Details */}
      <Panel open={mode === 'view'} onClose={close} title='Return Details' width={500}>
        {renderPanelContent()}
      </Panel>

      {/* Modal: Pay Fine */}
      {payTarget && (
        <PayFineDialog
          returnData={payTarget}
          open={!!payTarget}
          onClose={() => setPayTarget(null)}
          onConfirm={handlePayConfirm}
          isLoading={isPaying}
        />
      )}
    </Box>
  );
}
