// components/datatable/ReturnFormDialog.tsx
'use client';

import { Flex, Button, Dialog, Text } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { SelectField, TextareaField } from '@/components/features/forms';
import { ClipboardList, NotepadText } from 'lucide-react';
import type { LoanResponse } from '@/lib/schema/loan';

interface ReturnFormDialogProps {
  loan: LoanResponse;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { condition: string; notes: string }) => Promise<void>;
}

export function ReturnFormDialog({ loan, open, onClose, onSubmit }: ReturnFormDialogProps) {
  const form = useForm({
    defaultValues: {
      condition: 'good',
      notes: '',
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && !form.state.isSubmitting && onClose()}>
      <Dialog.Content maxWidth='440px'>
        <Dialog.Title>Return Book</Dialog.Title>
        <Dialog.Description size='2' color='gray' mb='4'>
          Loan <Text weight='bold'>#{loan.id}</Text> — <Text weight='medium'>{loan.member?.fullName}</Text> ·{' '}
          <Text color='gray'>{loan.book?.title}</Text>
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
                  label='Book Condition'
                  options={[
                    { value: 'good', label: '✅ Good' },
                    { value: 'damaged', label: '⚠️ Damaged' },
                    { value: 'lost', label: '❌ Lost' },
                  ]}
                  placeholder='Select condition...'
                  required
                  icon={<ClipboardList />}
                  error={getFieldError(field)}
                />
              )}
            </form.Field>

            <form.Field name='notes'>
              {(field) => (
                <TextareaField
                  field={field}
                  label='Notes'
                  placeholder='Any additional notes...'
                  icon={<NotepadText />}
                  error={getFieldError(field)}
                  rows={3}
                />
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Flex gap='3' mt='2' justify='end'>
                  <Button variant='soft' color='gray' type='button' onClick={onClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type='submit' color='green' disabled={!canSubmit || isSubmitting} loading={isSubmitting}>
                    Confirm Return
                  </Button>
                </Flex>
              )}
            </form.Subscribe>
          </Flex>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
