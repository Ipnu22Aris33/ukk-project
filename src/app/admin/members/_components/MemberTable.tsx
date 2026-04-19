'use client';

import { useState } from 'react';
import { Container, Heading, Flex, Box } from '@radix-ui/themes';
import { DataTable } from '@/components/features/datatable';
import { Panel } from '@/components/ui/Panel';
import { useMembers } from '@/hooks/useMembers';
import { usePanel } from '@/hooks/usePanel';
import type { MemberResponse } from '@/lib/schema/member';
import { MemberForm } from './MemberForm';
import { memberColumns } from './Columns';
import { getRowActions } from './RowActions';
import { ViewMemberContent } from './ViewMemberContent';

export function MemberTable() {
  const members = useMembers();
  const { mode, selected, open, close } = usePanel<MemberResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = members.list({
    page,
    search,
    limit,
  });

  const rowActions = getRowActions(open);

  const renderPanelContent = () => {
    if (mode === 'add') {
      return (
        <MemberForm
          submitLabel='Save Member'
          onSubmit={async (formData) => {
            await members.create.mutateAsync(formData);
            close();
            refetch();
          }}
          onClose={close}
        />
      );
    }

    if (mode === 'edit' && selected) {
      return (
        <MemberForm
          initialData={{
            fullName: selected.fullName,
            memberClass: selected.memberClass || '',
            address: selected.address || null,
            nis: selected.nis || '',
            phone: selected.phone || '',
            major: selected.major || '',
          }}
          submitLabel='Update Member'
          onSubmit={async (formData) => {
            await members.update.mutateAsync({
              id: selected.id,
              data: formData,
            });
            close();
            refetch();
          }}
          onClose={close}
        />
      );
    }

    if (mode === 'view' && selected) {
      return <ViewMemberContent member={selected} onClose={close} />;
    }

    return null;
  };

  const panelTitle = mode === 'add' ? 'Add New Member' : mode === 'edit' ? 'Edit Member' : mode === 'view' ? 'Member Details' : '';

  return (
    <Box position='relative' minHeight='100vh'>
      <Container size='4' py='6'>
        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Members Management</Heading>
        </Flex>

        <DataTable
          data={data?.data ?? []}
          columns={memberColumns}
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
          showAdd
          showPrint
          showRefresh
          onAdd={() => open('add')}
        />
      </Container>

      <Panel open={mode !== null} onClose={close} title={panelTitle} width={mode === 'view' ? 500 : 480}>
        {renderPanelContent()}
      </Panel>
    </Box>
  );
}
