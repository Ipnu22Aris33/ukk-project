// app/admin/members/MemberTable.tsx
'use client';

import { ColDataTable, DataTable, RowAction } from '@/components/features/datatable/DataTable';
import { Panel } from '@/components/ui/Panel';
import { useMembers } from '@/hooks/useMembers';
import { usePanel } from '@/hooks/usePanel';
import { Container, Heading, Flex, Box, Button, DataList, AlertDialog } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { MemberResponse } from '@/lib/schema/member';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { MemberForm } from './MemberForm';

/* =========================
   VIEW CONTENT
========================= */

function ViewMemberContent({ member, onClose }: { member: MemberResponse; onClose: () => void }) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Full Name</DataList.Label>
          <DataList.Value>{member.fullName}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>NIS</DataList.Label>
          <DataList.Value>{member.nis || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Phone</DataList.Label>
          <DataList.Value>{member.phone || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Class</DataList.Label>
          <DataList.Value>{member.memberClass || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Major</DataList.Label>
          <DataList.Value>{member.major || '-'}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Address</DataList.Label>
          <DataList.Value>{member.address}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Member Code</DataList.Label>
          <DataList.Value>{member.memberCode}</DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button mt='4' variant='soft' onClick={onClose}>
        Close
      </Button>
    </>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export function MemberTable() {
  const members = useMembers();
  const { mode, selected, open, close } = usePanel<MemberResponse>();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<MemberResponse | null>(null);

  const { data, isLoading, refetch } = members.list({
    page,
    search,
    limit,
  });

  const columns: ColDataTable<MemberResponse>[] = [
    {
      accessorKey: 'fullName',
      header: 'Name',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'memberClass',
      header: 'Class',
    },
    {
      accessorKey: 'major',
      header: 'Major',
    },
    {
      accessorKey: 'address',

      header: 'Address',
    },
    {
      accessorKey: 'user.email',
      header: 'Email',
    },
  ];

  const rowActions: () => RowAction<MemberResponse>[] = () => [
    {
      key: 'view',
      label: 'View Details',
      icon: <Icon icon='mdi:eye' />,
      color: 'blue',
      onClick: (row) => open('view', row),
    },
    {
      key: 'edit',
      label: 'Edit Member',
      icon: <Icon icon='mdi:pencil' />,
      color: 'green',
      onClick: (row) => open('edit', row),
    },
    {
      key: 'delete',
      label: 'Delete Member',
      icon: <Icon icon='mdi:delete' />,
      color: 'red',
      onClick: (row) => setDeleteTarget(row),
    },
  ];

  const breadcrumbItems = [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Members' }];

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
            email: selected.user.email || '',
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
        <Breadcrumb items={breadcrumbItems} />

        <Flex justify='between' align='center' mb='6'>
          <Heading size='8'>Members Management</Heading>
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
          showAdd
          showPrint
          showRefresh
          onAdd={() => open('add')}
        />
      </Container>

      <Panel open={mode !== null} onClose={close} title={panelTitle} width={mode === 'view' ? 500 : 480}>
        {renderPanelContent()}
      </Panel>

      <AlertDialog.Root
        open={!!deleteTarget}
        onOpenChange={(openState) => {
          if (!openState) setDeleteTarget(null);
        }}
      >
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Delete Member</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure you want to delete <strong>{deleteTarget?.fullName}</strong>?
          </AlertDialog.Description>

          <Flex gap='3' mt='4' justify='end'>
            <AlertDialog.Cancel>
              <Button variant='soft' color='gray'>
                Cancel
              </Button>
            </AlertDialog.Cancel>

            <AlertDialog.Action>
              <Button
                color='red'
                onClick={async () => {
                  if (!deleteTarget) return;
                  await members.remove.mutateAsync(deleteTarget.id);
                  setDeleteTarget(null);
                  refetch();
                }}
              >
                Delete
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Box>
  );
}
