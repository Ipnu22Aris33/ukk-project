'use client';

import { Text, Card, Flex, Badge, Box, Tooltip, IconButton, Spinner, Dialog, Button } from '@radix-ui/themes';
import { BookCheck, Info, NotepadText, Undo2, BookOpen, Plus } from 'lucide-react';
import { useMembers } from '@/hooks/useMembers';
import { useLoans } from '@/hooks/useLoans';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { SelectField, TextareaField } from '@/components/features/forms';
import { useState } from 'react';
import { AddLoanForm } from './AddLoanForm';

export function MemberLoans({ code }: { code: string }) {
  const members = useMembers();
  const loans = useLoans();

  const [openDialogId, setOpenDialogId] = useState<string | number | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  // 🔥 ambil data member dulu buat dapetin ID
  const { data: memberData } = members.getByPath(['code', code]);
  const memberId = memberData?.data?.id;

  // 🔥 ambil loans by member code + filter borrowed
  const { data, isLoading, refetch } = members.getByPath(['code', code, 'loans'], { status: 'borrowed' });

  const raw = data?.data;
  const loanList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const returnForm = useForm({
    defaultValues: {
      loanId: '' as any,
      condition: 'good' as 'good' | 'lost' | 'damaged',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      loans.custom.mutate(
        {
          id: value.loanId,
          action: 'return',
          method: 'POST',
          body: {
            condition: value.condition,
            notes: value.notes,
          },
        },
        {
          onSuccess: () => {
            loans.invalidate.all();
            refetch();
            returnForm.reset();
            setOpenDialogId(null);
          },
        }
      );
    },
  });

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  const handleAddLoan = async (formData: any) => {
    await loans.create.mutateAsync(formData);
    refetch();
    setOpenAddDialog(false);
  };

  if (isLoading) {
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data peminjaman...
        </Text>
      </Flex>
    );
  }

  return (
    <Flex direction='column' gap='3'>
      {/* Header with Add Button */}
      <Flex justify='end'>
        <Dialog.Root open={openAddDialog} onOpenChange={setOpenAddDialog}>
          <Dialog.Trigger>
            <Button size='2' variant='solid'>
              <Plus size={16} />
              Add New Loan
            </Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth='500px'>
            <Dialog.Title>Create New Loan</Dialog.Title>
            <Dialog.Description size='2' mb='4' color='gray'>
              Fill in the loan details below.
            </Dialog.Description>

            <AddLoanForm
              initialData={{ memberId: memberId }}
              onSubmit={handleAddLoan}
              isSubmitting={loans.create.isPending}
              onClose={() => setOpenAddDialog(false)}
            />
          </Dialog.Content>
        </Dialog.Root>
      </Flex>

      {/* Loan List */}
      {!loanList.length ? (
        <Card variant='surface' style={{ border: '1px dashed var(--gray-6)' }}>
          <Flex direction='column' align='center' gap='2' py='6'>
            <BookOpen size={28} color='var(--gray-8)' />
            <Text size='2' color='gray'>
              Tidak ada data peminjaman aktif.
            </Text>
            <Text size='1' color='gray'>
              Klik tombol "Add New Loan" untuk menambah peminjaman.
            </Text>
          </Flex>
        </Card>
      ) : (
        <Flex direction='column' gap='3'>
          {loanList.map((loan) => (
            <Card key={loan.id} variant='surface'>
              <Flex align='center' justify='between' gap='3'>
                {/* LEFT */}
                <Box>
                  <Text as='div' size='2' weight='bold' mb='1'>
                    {loan.book?.title || 'Unknown Title'}
                  </Text>

                  <Flex gap='3' align='center'>
                    <Badge color={loan.status === 'RETURNED' ? 'green' : 'blue'} variant='soft' radius='full'>
                      {loan.status}
                    </Badge>

                    <Text size='1' color='gray' style={{ fontFamily: 'monospace' }}>
                      #{loan.id}
                    </Text>
                  </Flex>
                </Box>

                {/* RIGHT */}
                <Flex gap='2'>
                  <Tooltip content='Lihat Detail'>
                    <IconButton size='2' variant='soft' color='gray'>
                      <Info size={16} />
                    </IconButton>
                  </Tooltip>

                  {loan.status !== 'RETURNED' && (
                    <Dialog.Root
                      open={openDialogId === loan.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenDialogId(loan.id);
                          returnForm.setFieldValue('loanId', loan.id);
                        } else {
                          setOpenDialogId(null);
                          returnForm.reset();
                        }
                      }}
                    >
                      <Dialog.Trigger>
                        <IconButton size='2' variant='solid' color='blue'>
                          <Undo2 size={16} />
                        </IconButton>
                      </Dialog.Trigger>

                      <Dialog.Content maxWidth='450px'>
                        <Dialog.Title>Return Book</Dialog.Title>
                        <Dialog.Description size='2' mb='4' color='gray'>
                          Laporkan kondisi buku yang dikembalikan.
                        </Dialog.Description>

                        <Form.Root
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            returnForm.handleSubmit();
                          }}
                        >
                          <Flex direction='column' gap='4'>
                            <returnForm.Field name='condition'>
                              {(field) => (
                                <SelectField
                                  field={field}
                                  label='Condition'
                                  icon={<BookCheck />}
                                  required
                                  error={getFieldError(field)}
                                  options={[
                                    { value: 'good', label: 'Bagus (Good)' },
                                    { value: 'damaged', label: 'Rusak (Broken)' },
                                    { value: 'lost', label: 'Hilang (Lost)' },
                                  ]}
                                />
                              )}
                            </returnForm.Field>

                            <returnForm.Field name='notes'>
                              {(field) => (
                                <TextareaField
                                  field={field}
                                  label='Notes'
                                  icon={<NotepadText />}
                                  placeholder='Tambahkan catatan jika ada kerusakan...'
                                  error={getFieldError(field)}
                                />
                              )}
                            </returnForm.Field>

                            <returnForm.Subscribe selector={(s) => [s.canSubmit]}>
                              {([canSubmit]) => (
                                <Flex gap='3' justify='end' mt='4'>
                                  <Dialog.Close>
                                    <Button type='button' variant='soft' color='gray'>
                                      Cancel
                                    </Button>
                                  </Dialog.Close>

                                  <Button type='submit' disabled={!canSubmit}>
                                    Confirm Return
                                  </Button>
                                </Flex>
                              )}
                            </returnForm.Subscribe>
                          </Flex>
                        </Form.Root>
                      </Dialog.Content>
                    </Dialog.Root>
                  )}
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
