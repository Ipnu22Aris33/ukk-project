'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField, TextareaField } from '@/components/features/forms';
import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useBooks } from '@/hooks/useBooks';
import { loanFormSchema, LoanInput } from '@/lib/schema/loan';
import { BookOpen, CalendarClock, CalendarCheck, ListChecks, NotepadText, User2, Hash } from 'lucide-react';

interface LoanFormProps {
  initialData?: Partial<LoanInput>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  isUpdate?: boolean;
  onClose?: () => void;
}

export function LoanForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Loan', isUpdate = false, onClose }: LoanFormProps) {
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');

  const members = useMembers();
  const books = useBooks();

  const memberList = members.list({ page: 1, limit: 100, search: memberSearch });
  const bookList = books.list({ page: 1, limit: 100, search: bookSearch });

  const memberOptions = (memberList.data?.data || []).map((member) => ({
    value: member.id,
    label: `${member.fullName} (${member.memberCode})`,
  }));

  const bookOptions = (bookList.data?.data || []).map((book) => ({
    value: book.id,
    label: `${book.title} - ${book.author} (Avail: ${book.availableStock})`,
  }));

  const form = useForm({
    defaultValues: {
      memberId: initialData.memberId || '',
      bookId: initialData.bookId || '',
      quantity: initialData.quantity || 1,
      loanDate: initialData.loanDate || new Date(),
      dueDate: initialData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
              icon={<User2 size={16} />}
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
              icon={<BookOpen size={16} />}
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
              icon={<Hash size={16} />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <Flex gap='4'>
          <form.Field name='loanDate'>
            {(field) => (
              <InputField field={field} label='Loan Date' type='date' required icon={<CalendarClock size={16} />} error={getFieldError(field)} />
            )}
          </form.Field>

          <form.Field name='dueDate'>
            {(field) => (
              <InputField field={field} label='Due Date' type='date' required icon={<CalendarCheck size={16} />} error={getFieldError(field)} />
            )}
          </form.Field>
        </Flex>

        {isUpdate && (
          <form.Field name='status'>
            {(field) => (
              <SelectField
                field={field}
                label='Status'
                options={[
                  { value: 'borrowed', label: 'Borrowed' },
                  { value: 'returned', label: 'Returned' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'lost', label: 'Lost' },
                ]}
                placeholder='Select status...'
                required
                icon={<ListChecks size={16} />}
                error={getFieldError(field)}
              />
            )}
          </form.Field>
        )}

        <form.Field name='notes'>
          {(field) => (
            <TextareaField
              field={field}
              label='Notes'
              placeholder='Enter any notes...'
              icon={<NotepadText size={16} />}
              error={getFieldError(field)}
              rows={3}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Flex gap='3' mt='4' justify='end'>
              <Button variant='soft' color='gray' onClick={onClose} type='button' disabled={isSubmitting}>
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
