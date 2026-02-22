// components/features/loans/LoanForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField, TextareaField } from '@/components/features/forms';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useBooks } from '@/hooks/useBooks';
import { loanFormSchema, LoanFormValues } from '@/lib/schema/loan';
import { loanStatusEnum } from '@/lib/db/schema';
interface LoanFormProps {
  initialData?: Partial<LoanFormValues>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  isUpdate?: boolean;
}

export function LoanForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Loan', isUpdate = false }: LoanFormProps) {
  const router = useRouter();
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const members = useMembers();
  const books = useBooks();

  const memberList = members.list({
    page: 1,
    limit: 100,
    search: memberSearch,
  });

  const bookList = books.list({
    page: 1,
    limit: 100,
    search: bookSearch,
  });

  const memberOptions = (memberList.data?.data || []).map((member) => ({
    value: member.id,
    label: `${member.fullName} (${member.memberCode})`,
  }));

  const bookOptions = (bookList.data?.data || []).map((book) => ({
    value: book.id,
    label: `${book.title} - ${book.author} (Stock: ${book.stock})`,
  }));

  const form = useForm({
    defaultValues: {
      memberId: initialData.memberId,
      reservationId: null,
      bookId: initialData.bookId,
      quantity: initialData.quantity || 1,
      loanDate: initialData.loanDate || new Date(),
      dueDate: initialData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: initialData.notes || '',
      status: initialData.status || 'borrowed',
    } as LoanFormValues,
    validators: {
      onChange: loanFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('VALUE BEFORE SUBMIT:', JSON.stringify(value, null, 2));
      console.log('loanDate type:', typeof value.loanDate, value.loanDate);
      console.log('dueDate type:', typeof value.dueDate, value.dueDate);
      const submitData = {
        ...value,
        loanDate: value.loanDate instanceof Date ? value.loanDate : new Date(value.loanDate),
        dueDate: value.dueDate instanceof Date ? value.dueDate : new Date(value.dueDate),
      };

      await onSubmit(submitData);
    },
  });

  const getFieldError = (field: any) => {
    return field.state.meta.errors?.[0]?.message;
  };

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Flex direction='column' gap='4'>
        <form.Field name='memberId'>
          {(field) => (
            <SelectField
              field={field}
              label='Member'
              options={memberOptions}
              placeholder='Select a member...'
              required
              searchable
              search={memberSearch}
              onSearchChange={setMemberSearch}
              icon={<Icon icon='mdi:account' />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='bookId'>
          {(field) => (
            <SelectField
              field={field}
              label='Book'
              options={bookOptions}
              placeholder='Select a book...'
              required
              searchable
              search={bookSearch}
              onSearchChange={setBookSearch}
              icon={<Icon icon='mdi:book' />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='quantity'>
          {(field) => (
            <InputField
              field={field}
              label='Quantity'
              type='number'
              placeholder='Enter quantity...'
              required
              icon={<Icon icon='mdi:counter' />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='loanDate'>
          {(field) => (
            <InputField
              field={field}
              label='Loan Date'
              type='date'
              placeholder='Select loan date...'
              required
              icon={<Icon icon='mdi:calendar-start' />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='dueDate'>
          {(field) => (
            <InputField
              field={field}
              label='Due Date'
              type='date'
              placeholder='Select due date...'
              required
              icon={<Icon icon='mdi:calendar-end' />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        {isUpdate && (
          <form.Field name='status'>
            {(field) => (
              <SelectField
                field={field}
                label='Status'
                options={[
                  { value: 'BORROWED', label: 'Borrowed' },
                  { value: 'RETURNED', label: 'Returned' },
                  { value: 'OVERDUE', label: 'Overdue' },
                  { value: 'LOST', label: 'Lost' },
                ]}
                placeholder='Select status...'
                required
                icon={<Icon icon='mdi:status' />}
                error={getFieldError(field)}
              />
            )}
          </form.Field>
        )}

        <form.Field name='notes'>
          {(field) => <TextareaField field={field} label='Notes' placeholder='Enter any notes...' error={getFieldError(field)} rows={3} />}
        </form.Field>

        <Flex gap='3' mt='4' justify='end'>
          <Button variant='soft' color='gray' onClick={() => router.back()} type='button' disabled={isSubmitting}>
            Cancel
          </Button>
          <form.Subscribe selector={(state) => [state.canSubmit]}>
            {([canSubmit]) => (
              <Button type='submit' variant='solid' disabled={!canSubmit || isSubmitting} loading={isSubmitting}>
                {submitLabel}
              </Button>
            )}
          </form.Subscribe>
        </Flex>
      </Flex>
    </Form.Root>
  );
}
