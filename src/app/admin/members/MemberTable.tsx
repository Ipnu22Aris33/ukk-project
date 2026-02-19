// components/datatable/MemberTable.tsx
'use client';

import { useState } from 'react';
import { Button, Flex, Dialog, Text, Link, Box } from '@radix-ui/themes';
import { ReloadIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField } from '@/components/features/forms';
import { ColumnFactory, DataTableProvider } from '@/components/features/datatable';
import { DataTableHeader } from '@/components/features/datatable/DataTableHeader';
import { DataTableToolbar } from '@/components/features/datatable/DataTableToolbar';
import { DataTableBody } from '@/components/features/datatable/DataTableBody';
import { DataTableFooter } from '@/components/features/datatable/DataTableFooter';
import { useDataTable } from '@/hooks/useDataTable';
import { useMembers } from '@/hooks/useMembers';
import { Icon } from '@iconify/react';
import type { ColumnDef } from '@tanstack/react-table';
import { Member } from '@/lib/models/member';


export function MemberTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const members = useMembers()

  const memberList = members.list({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  })

  const tableData = memberList.data?.data ?? [];
  const metaData = memberList.data?.meta;
  const isLoading = memberList.isLoading;
  const refetch = memberList.refetch;

  const col = ColumnFactory<Member>();

  const columns: ColumnDef<Member>[] = [
    col.selectColumn(),
    col.textColumn('id_member', 'ID', { color: 'gray' }),
    col.textColumn('full_name', 'Name', { weight: 'medium' }),
    col.textColumn('phone', 'Phone'),
    col.textColumn('member_class', 'Class'),
    col.textColumn('major', 'Major'),
    
  ];

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  // FORM
  const form = useForm({
    defaultValues: {
      member_name: '',
      member_phone: '',
      member_class: '',
      member_major: '',
    },
    onSubmit: async ({ value }) => {
      try {
        console.log('Create new member:', value);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDialogOpen(false);
        form.reset();
        refetch();
      } catch (err: any) {
        alert(err.message);
      }
    },
  });

  // Table actions
  const tableActions = (
    <>
      <Button variant='soft' size='2' onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? <ReloadIcon className='animate-spin' /> : <ReloadIcon />}
        Refresh
      </Button>
      <Button variant='soft' size='2'>
        <DownloadIcon />
        Export
      </Button>
      
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger>
          <Button variant='solid' size='2'>
            <PlusIcon />
            Add Member
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="500px">
          <Dialog.Title>Add New Member</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Register a new library member
          </Dialog.Description>

          <Form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Box className="space-y-4">
              <form.Field
                name="member_name"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Nama wajib diisi';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <InputField 
                    field={field} 
                    label="Name" 
                    placeholder="Masukkan nama"
                    required 
                    icon={<Icon icon="mdi:user" />}
                  />
                )}
              </form.Field>

              <form.Field
                name="member_phone"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Nomor telepon wajib diisi';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <InputField 
                    field={field} 
                    label="Phone" 
                    placeholder="08xxxxxxxxxx"
                    required 
                    icon={<Icon icon="mdi:phone" />}
                  />
                )}
              </form.Field>

              <Flex gap="3">
                <Box >
                  <form.Field
                    name="member_class"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Kelas wajib diisi';
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <InputField 
                        field={field} 
                        label="Class" 
                        placeholder="X, XI, XII"
                        required 
                        icon={<Icon icon="mdi:school" />}
                      />
                    )}
                  </form.Field>
                </Box>
                <Box>
                  <form.Field
                    name="member_major"
                    validators={{
                      onChange: ({ value }) => {
                        if (!value) return 'Jurusan wajib diisi';
                        return undefined;
                      },
                    }}
                  >
                    {(field) => (
                      <InputField 
                        field={field} 
                        label="Major" 
                        placeholder="IPA, IPS"
                        required 
                        icon={<Icon icon="mdi:book-education" />}
                      />
                    )}
                  </form.Field>
                </Box>
              </Flex>

              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                      <Button variant="soft" color="gray">
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button 
                      type="submit" 
                      variant="solid" 
                      disabled={!canSubmit}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Member'}
                    </Button>
                  </Flex>
                )}
              </form.Subscribe>
            </Box>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );

  const dataTableState = {
    table,
    pagination,
    setPagination,
    search,
    setSearch,
    meta: metaData,
    isLoading,
    refetch,
  };

  return (
    <DataTableProvider value={dataTableState}>
      <Flex direction='column'>
        <DataTableHeader 
          title='Member Management' 
          description='Manage library members' 
        />
        <DataTableToolbar actions={tableActions}/>
        <DataTableBody />
        <DataTableFooter />
      </Flex>
    </DataTableProvider>
  );
}