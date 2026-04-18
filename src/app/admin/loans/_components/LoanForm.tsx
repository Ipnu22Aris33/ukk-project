'use client';

import { useRouter } from 'next/navigation';
import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField, TextareaField } from '@/components/features/forms';
import { useState } from 'react';
import { useMembers } from '@/hooks/useMembers';
import { useBooks } from '@/hooks/useBooks';
import { loanFormSchema, LoanInput } from '@/lib/schema/loan';
import { Book, CalendarClock, ListChecks, NotepadText, User2, LayersPlus } from 'lucide-react';

interface LoanFormProps {
  initialData?: Partial<LoanInput>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  isUpdate?: boolean;
  onClose?: () => void;
}

// Helper untuk format date ke string YYYY-MM-DD agar bisa dibaca input date
const toISODate = (date: Date | string | undefined) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export function LoanForm({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false, 
  submitLabel = 'Save Loan', 
  isUpdate = false, 
  onClose 
}: LoanFormProps) {
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
    // 🔥 SESUAIKAN: Menampilkan availableStock, bukan stock lama
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
              icon={<User2/>}
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
              icon={<Book />}
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
              icon={<LayersPlus />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <Flex gap="4">
          <form.Field name='loanDate'>
            {(field) => (
              <InputField
                field={field}
                label='Loan Date'
                type='date'
                required
                icon={<CalendarClock/>}
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
                required
                icon={<CalendarClock/>}
                error={getFieldError(field)}
              />
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
                icon={<ListChecks/>}
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
              icon={<NotepadText />}
              error={getFieldError(field)}
              rows={3}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Flex gap='3' mt='4' justify='end'>
              <Button variant='soft' color='gray' onClick={handleClose} type='button' disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type='submit' variant='solid' disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </Flex>
          )}
        </form.Subscribe>
      </Flex>
    </Form.Root>
  );
}