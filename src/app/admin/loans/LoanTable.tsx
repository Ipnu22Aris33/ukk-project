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
import { useMembers } from '@/hooks/useMembers';
import { useBooks } from '@/hooks/useBooks';
import { Icon } from '@iconify/react';
import type { ColumnDef } from '@tanstack/react-table';

// ====================
// TYPES
// ====================

type LoanStatus = 'borrowed' | 'returned' | 'late' | 'cancelled';

interface LoanRow {
  id_loan: number;
  member_id: number;
  book_id: number;
  loan_date: string;
  due_date: string;
  quantity: number;
  status: LoanStatus;
  created_at: string;
  updated_at: string;
  member_name: string; // computed
  book_title: string; // computed
}

// Form data dari user
interface LoanFormData {
  member_id: string; // select value comes as string
  book_id: string;
  count: number;
  due_date: string;
}

// ====================
// COMPONENT
// ====================

export function LoanTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  // Hooks CRUD
  const loans = useLoans();
  const members = useMembers();
  const books = useBooks();

  // Fetch loans list
  const loansList = loans.list({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    debounceMs: 400,
  });

  // Fetch members for select dropdown
  const memberList = members.list({
    page: 1,
    limit: 100,
    search: memberSearch,
    debounceMs: 400,
  });

  // Fetch books for select dropdown
  const bookList = books.list({
    page: 1,
    limit: 100,
    search: bookSearch,
    debounceMs: 400,
  });

  const tableData: LoanRow[] =
    (loansList.data?.data || []).map((l: any) => ({
      ...l,
      member_name: l.member?.full_name ?? '',
      book_title: l.book?.title ?? '',
    })) || [];

  const metaData = loansList.data?.meta;
  const isLoading = loansList.isLoading;
  const refetch = loansList.refetch;

  // Members & books options
  const memberOptions =
    (memberList.data?.data || []).map((m: any) => ({
      value: String(m.id_member),
      label: `${m.full_name} (${m.member_class})`,
    })) || [];

  const bookOptions =
    (bookList.data?.data || []).map((b: any) => ({
      value: String(b.id_book),
      label: `${b.title} - ${b.author}`,
    })) || [];

  // ====================
  // TABLE COLUMNS
  // ====================
  const col = ColumnFactory<LoanRow>();

  const columns: ColumnDef<LoanRow>[] = [
    col.selectColumn(),
    col.textColumn('id_loan', 'ID', { color: 'gray' }),
    col.textColumn('member_name', 'Member', { weight: 'medium' }),
    col.textColumn('book_title', 'Book'),
    col.numberColumn('quantity', 'Qty'), // gunakan quantity
    col.dateColumn('loan_date', 'Loan Date'),
    col.dateColumn('due_date', 'Due Date'),
    col.statusBadgeColumn('status', 'Status', {
      borrowed: { label: 'Borrowed', color: 'blue' },
      returned: { label: 'Returned', color: 'jade' },
      late: { label: 'Late', color: 'crimson' },
      cancelled: { label: 'Cancelled', color: 'gray' },
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

  // ====================
  // FORM
  // ====================
  const form = useForm({
    defaultValues: {
      member_id: '',
      book_id: '',
      count: 1,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    onSubmit: async ({ value }) => {
      try {
        await loans.create.mutateAsync({
          member_id: Number(value.member_id),
          book_id: Number(value.book_id),
          quantity: value.count, // rename count → quantity
          loan_date: new Date().toISOString().split('T')[0],
          due_date: value.due_date,
          status: 'borrowed',
        });

        setDialogOpen(false);
        form.reset();
        refetch();
        setMemberSearch('');
        setBookSearch('');
      } catch (err: any) {
        alert(err.message);
      }
    },
  });

  // ====================
  // TABLE ACTIONS
  // ====================
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

      {/* Dialog with form */}
      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
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
              {/* Member select */}
              <form.Field
                name='member_id'
                validators={{
                  onChange: ({ value }) => (!value ? 'Member wajib dipilih' : undefined),
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
                    searchable
                    search={memberSearch}
                    onSearchChange={setMemberSearch}
                  />
                )}
              </form.Field>

              {/* Book select */}
              <form.Field
                name='book_id'
                validators={{
                  onChange: ({ value }) => (!value ? 'Buku wajib dipilih' : undefined),
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
                    searchable
                    search={bookSearch}
                    onSearchChange={setBookSearch}
                  />
                )}
              </form.Field>

              {/* Quantity */}
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

              {/* Due date */}
              <form.Field
                name='due_date'
                validators={{
                  onChange: ({ value }) => (!value ? 'Tanggal kembali wajib diisi' : undefined),
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

              {/* Form actions */}
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

  // ====================
  // PROVIDER
  // ====================
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
