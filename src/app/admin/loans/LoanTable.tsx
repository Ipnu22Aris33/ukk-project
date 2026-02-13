// components/datatable/LoanTable.tsx
'use client';

import { useState } from 'react';
import { Button, Flex, Dialog, Box } from '@radix-ui/themes';
import { ReloadIcon, DownloadIcon, PlusIcon } from '@radix-ui/react-icons';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField } from '@/components/features/forms';
import { ColumnFactory, DataTableProvider } from '@/components/features/datatable';
import { DataTableHeader } from '@/components/features/datatable/DataTableHeader';
import { DataTableToolbar } from '@/components/features/datatable/DataTableToolbar';
import { DataTableBody } from '@/components/features/datatable/DataTableBody';
import { DataTableFooter } from '@/components/features/datatable/DataTableFooter';
import { useDataTable } from '@/hooks/useDataTable';
import { useLoans } from '@/hooks/useLoans';
import { Icon } from '@iconify/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMembers } from '@/hooks/useMembers';
import { useBooks } from '@/hooks/useBooks';

type LoanStatus = 'borrowed' | 'returned' | 'overdue' | 'late';

interface Loan {
  id_loan: number;
  count: number;
  loan_date: string;
  due_date: string;
  status: LoanStatus;
  book_id: number;
  book_title: string;
  book_author: string;
  book_publisher: string;
  book_category: number;
  member_id: number;
  member_name: string;
  member_phone: string;
  member_class: string;
  member_major: string;
}

interface LoanFormData {
  member_id: string;
  book_id: string;
  count: number;
  due_date: string;
}

export function LoanTable() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  // State untuk pencarian di form dialog
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const { list, create } = useLoans({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  // Fetch members untuk dropdown
  const { list: memberList } = useMembers({
    page: 1,
    limit: 100, // Ambil banyak untuk dropdown
    search: memberSearch,
    debounceMs: 400,
  });

  // Fetch books untuk dropdown
  const { list: bookList } = useBooks({
    page: 1,
    limit: 100, // Ambil banyak untuk dropdown
    search: bookSearch,
    debounceMs: 400,
  });

  const tableData = list.data?.data ?? [];
  const metaData = list.data?.meta;
  const isLoading = list.isLoading;
  const refetch = list.refetch;

  // Konversi members ke format Option
  const memberOptions = (memberList.data?.data || []).map((member) => ({
    value: String(member.id_member),
    label: `${member.name} (${member.class})`, // Sesuaikan dengan struktur data member Anda
  }));

  // Konversi books ke format Option
  const bookOptions = (bookList.data?.data || []).map((book) => ({
    value: String(book.id_book),
    label: `${book.title} - ${book.author}`,
  }));

  const col = ColumnFactory<Loan>();

  const columns: ColumnDef<Loan>[] = [
    col.selectColumn(),
    col.textColumn('id_loan', 'ID', { color: 'gray' }),
    col.textColumn('member_name', 'Member', { weight: 'medium' }),
    col.textColumn('book_title', 'Book'),
    col.numberColumn('count', 'Qty'),
    col.dateColumn('loan_date', 'Loan Date'),
    col.dateColumn('due_date', 'Due Date'),
    col.statusBadgeColumn('status', 'Status', {
      borrowed: { label: 'Borrowed', color: 'blue' },
      returned: { label: 'Returned', color: 'jade' },
      overdue: { label: 'Overdue', color: 'red' },
      late: { label: 'Late', color: 'crimson' },
    }),
    col.actionsColumn({
      useDefault: true,
      handlers: {
        view: (row) => console.log('View', row),
        edit: (row) => console.log('Edit', row),
        delete: (row) => console.log('Delete', row),
      },
    }),
  ];

  const { table } = useDataTable({
    data: tableData,
    columns,
    pageSize: metaData?.limit || 10,
  });

  // FORM
  const form = useForm({
    defaultValues: {
      member_id: '',
      book_id: '',
      count: 1,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      try {
        await create.mutateAsync({
          ...value,
          loan_date: new Date().toISOString().split('T')[0],
        });

        setDialogOpen(false);
        form.reset();
        refetch();

        // Reset search states
        setMemberSearch('');
        setBookSearch('');
      } catch (err: any) {
        alert(err.message);
      }
    },
  });

  // Table actions
  const tableActions = (
    <>
      <Button variant='soft' size='2' onClick={() => window.print()}>
        Print
      </Button>
      <Button variant='soft' size='2' onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? <ReloadIcon className='animate-spin' /> : <ReloadIcon />}
        Refresh
      </Button>
      <Button variant='soft' size='2'>
        <DownloadIcon />
        Export
      </Button>

      {/* DIALOG WITH FORM */}
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            // Reset form and search when dialog closes
            form.reset();
            setMemberSearch('');
            setBookSearch('');
          }
        }}
      >
        <Dialog.Trigger>
          <Button variant='solid' size='2'>
            <PlusIcon />
            New Loan
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth='500px'>
          <Dialog.Title>Create New Loan</Dialog.Title>
          <Dialog.Description size='2' mb='4'>
            Add a new book loan transaction
          </Dialog.Description>

          <Form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <Box className='space-y-4'>
              {/* MEMBER SELECT */}
              <form.Field
                name='member_id'
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Member wajib dipilih';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <SelectField
                    icon={<Icon icon='mdi:account' width={16} height={16} />}
                    field={field}
                    label='Member'
                    options={memberOptions}
                    placeholder='Cari member...'
                    required
                    searchable={true}
                    search={memberSearch}
                    onSearchChange={setMemberSearch}
                  />
                )}
              </form.Field>

              {/* BOOK SELECT */}
              <form.Field
                name='book_id'
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Buku wajib dipilih';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <SelectField
                    icon={<Icon icon='mdi:book' width={16} height={16} />}
                    field={field}
                    label='Book'
                    options={bookOptions}
                    placeholder='Cari buku...'
                    required
                    searchable={true}
                    search={bookSearch}
                    onSearchChange={setBookSearch}
                  />
                )}
              </form.Field>

              {/* QUANTITY */}
              <form.Field
                name='count'
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Jumlah wajib diisi';
                    if (value < 1) return 'Minimal 1 buku';
                    if (value > 5) return 'Maksimal 5 buku';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <InputField
                    field={field}
                    label='Quantity'
                    type='number'
                    placeholder='Masukkan jumlah'
                    required
                    icon={<Icon icon='mdi:counter' />}
                  />
                )}
              </form.Field>

              {/* DUE DATE */}
              <form.Field
                name='due_date'
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Tanggal kembali wajib diisi';
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <InputField
                    field={field}
                    label='Due Date'
                    type='date'
                    placeholder='Pilih tanggal kembali'
                    required
                    icon={<Icon icon='mdi:calendar' />}
                  />
                )}
              </form.Field>

              {/* FORM ACTIONS */}
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Button type='submit' variant='solid' disabled={!canSubmit} loading={isSubmitting}>
                      {isSubmitting ? 'Creating...' : 'Create Loan'}
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

  // Context value untuk provider
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
        <DataTableHeader title='Loan Management' description='Manage and track all book loans' />
        <DataTableToolbar actions={tableActions} />
        <DataTableBody />
        <DataTableFooter />
      </Flex>
    </DataTableProvider>
  );
}
