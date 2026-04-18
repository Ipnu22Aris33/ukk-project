'use client';

import { Text, Card, Flex, Badge, Box, Tooltip, IconButton, Spinner, Dialog, Button } from '@radix-ui/themes';
import { BookCheck, Info, NotepadText, Undo2 } from 'lucide-react';
import { useLoans } from '@/hooks/useLoans';
import { useReturns } from '@/hooks/useReturns';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { SelectField, TextareaField } from '@/components/features/forms';
import { useState } from 'react'; // Tambahkan useState

export function MemberLoans({ code }: { code: string }) {
  const loans = useLoans();
  const returns = useReturns();

  // State untuk mengontrol dialog mana yang sedang terbuka
  const [openDialogId, setOpenDialogId] = useState<string | number | null>(null);

  const { data, isLoading } = loans.getBy('members', code);
  const { mutate: createReturn, isPending: isSubmitting } = returns.create;

  const raw = data?.data;
  const loanList = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const form = useForm({
    defaultValues: {
      condition: 'good' as 'good' | 'lost' | 'damaged',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      const loanId = (form.state.values as any).loanId;

      createReturn(
        {
          loanId,
          condition: value.condition,
          notes: value.notes,
        },
        {
          onSuccess: () => {
            loans.invalidate.all();
            form.reset();
            setOpenDialogId(null); // 🔥 CLOSE DIALOG DI SINI
          },
        }
      );
    },
  });

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  if (isLoading)
    return (
      <Flex align='center' gap='2' p='4' justify='center'>
        <Spinner size='2' />
        <Text size='2' color='gray'>
          Memuat data peminjaman...
        </Text>
      </Flex>
    );

  return (
    <Flex direction='column' gap='3'>
      {loanList.map((loan) => (
        <Card key={loan.id} variant='surface'>
          <Flex align='center' justify='between' gap='3'>
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

            <Flex gap='2'>
              <IconButton size='2' variant='soft' color='gray'>
                <Info size={16} />
              </IconButton>

              {loan.status !== 'RETURNED' && (
                <Dialog.Root
                  open={openDialogId === loan.id} // 🔥 Kontrol status buka/tutup
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenDialogId(loan.id);
                      form.setFieldValue('loanId' as any, loan.id);
                    } else {
                      setOpenDialogId(null);
                      form.reset();
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
                        form.handleSubmit();
                      }}
                    >
                      <Flex direction='column' gap='4'>
                        <form.Field name='condition'>
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
                        </form.Field>

                        <form.Field name='notes'>
                          {(field) => (
                            <TextareaField
                              field={field}
                              label='Notes'
                              icon={<NotepadText />}
                              placeholder='Tambahkan catatan jika ada kerusakan...'
                              error={getFieldError(field)}
                            />
                          )}
                        </form.Field>

                        <form.Subscribe selector={(state) => [state.canSubmit]}>
                          {([canSubmit]) => (
                            <Flex gap='3' justify='end' mt='4'>
                              <Dialog.Close>
                                <Button type='button' variant='soft' color='gray' disabled={isSubmitting}>
                                  Cancel
                                </Button>
                              </Dialog.Close>
                              <Button type='submit' disabled={!canSubmit || isSubmitting}>
                                {isSubmitting ? 'Saving...' : 'Confirm Return'}
                              </Button>
                            </Flex>
                          )}
                        </form.Subscribe>
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
  );
}
