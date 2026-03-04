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
import { loanFormSchema, LoanInput } from '@/lib/schema/loan';

interface LoanFormProps {
  initialData?: Partial<LoanInput>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  isUpdate?: boolean;
  onClose?: () => void;
}

export function LoanForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Loan', isUpdate = false, onClose }: LoanFormProps) {
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
      memberId: initialData.memberId || '',
      bookId: initialData.bookId || '',
      quantity: initialData.quantity || 1,
      loanDate: initialData.loanDate || new Date(),
      dueDate: initialData.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      notes: initialData.notes || '',
      status: initialData.status || 'borrowed',
    },
    validators: {
      onChange: loanFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
  });

  const getFieldError = (field: any) => {
    return field.state.meta.errors?.[0]?.message;
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Flex direction='column' gap='4'>
        {/* Member Field - Required */}
        <form.Field name='memberId'>
          {(field) => {
            const error = getFieldError(field);
            return (
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
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Book Field - Required */}
        <form.Field name='bookId'>
          {(field) => {
            const error = getFieldError(field);
            return (
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
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Quantity Field - Required */}
        <form.Field name='quantity'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Quantity'
                type='number'
                placeholder='Enter quantity...'
                required
                icon={<Icon icon='mdi:counter' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Loan Date Field - Required */}
        <form.Field name='loanDate'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Loan Date'
                type='date'
                placeholder='Select loan date...'
                required
                icon={<Icon icon='mdi:calendar-start' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Due Date Field - Required */}
        <form.Field name='dueDate'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Due Date'
                type='date'
                placeholder='Select due date...'
                required
                icon={<Icon icon='mdi:calendar-end' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Status Field - Only for Update */}
        {isUpdate && (
          <form.Field name='status'>
            {(field) => {
              const error = getFieldError(field);
              return (
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
                  error={error}
                />
              );
            }}
          </form.Field>
        )}

        {/* Notes Field - TextArea */}
        <form.Field name='notes'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <TextareaField
                field={field}
                label='Notes'
                placeholder='Enter any notes...'
                icon={<Icon icon='mdi:note-text-outline' />}
                error={error}
                rows={3}
              />
            );
          }}
        </form.Field>

        {/* Form Actions */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit]) => (
            <Flex gap='3' mt='4' justify='end'>
              <Button variant='soft' color='gray' onClick={handleClose} type='button' disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type='submit' variant='solid' disabled={!canSubmit || isSubmitting} loading={isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </Flex>
          )}
        </form.Subscribe>
      </Flex>
    </Form.Root>
  );
}
