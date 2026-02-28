// components/features/books/BookForm.tsx
'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, SelectField } from '@/components/features/forms';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { CreateBookInput, UpdateBookInput, bookFormSchema } from '@/lib/schema/book';

interface BookFormProps {
  initialData?: CreateBookInput | UpdateBookInput;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onClose?: () => void; // Tambahin ini
}

export function BookForm({ 
  initialData = {}, 
  onSubmit, 
  isSubmitting = false, 
  submitLabel = 'Save Book',
  onClose // Prop baru
}: BookFormProps) {
  const categories = useCategories();
  const [categorySearch, setCategorySearch] = useState('');

  const categoryList = categories.list({
    page: 1,
    limit: 10,
    search: categorySearch,
  });

  const categoryOptions = (categoryList.data?.data || []).map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const form = useForm({
    defaultValues: {
      title: initialData.title || '',
      author: initialData.author || '',
      publisher: initialData.publisher || '',
      stock: initialData.stock || 1,
      year: initialData.year || new Date().getFullYear(),
      isbn: initialData.isbn || '',
      categoryId: initialData.categoryId ?? undefined,
    },
    validators: {
      onChange: bookFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('FORM VALUE:', value);
      await onSubmit(value);
    },
  });

  const getFieldError = (field: any) => {
    return field.state.meta.errors?.[0]?.message;
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
        {/* Title Field */}
        <form.Field name='title'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField field={field} label='Title' placeholder='Enter book title...' icon={<Icon icon='mdi:book' />} required error={error} />
            );
          }}
        </form.Field>

        {/* Author Field */}
        <form.Field name='author'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Author'
                placeholder='Enter author name...'
                icon={<Icon icon='mdi:account-edit' />}
                required
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Publisher Field */}
        <form.Field name='publisher'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Publisher'
                placeholder='Enter publisher name...'
                icon={<Icon icon='mdi:office-building' />}
                required
                error={error}
              />
            );
          }}
        </form.Field>

        {/* ISBN Field */}
        <form.Field name='isbn'>
          {(field) => {
            const error = getFieldError(field);
            return <InputField field={field} label='ISBN' placeholder='Enter ISBN number...' icon={<Icon icon='mdi:barcode' />} error={error} />;
          }}
        </form.Field>

        {/* Year Field */}
        <form.Field name='year'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Year'
                type='number'
                placeholder='Enter publication year...'
                icon={<Icon icon='mdi:calendar' />}
                required
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Stock Field */}
        <form.Field name='stock'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Stock'
                type='number'
                placeholder='Enter stock quantity...'
                required
                icon={<Icon icon='mdi:counter' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Category Field */}
        <form.Field name='categoryId'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <SelectField
                field={field}
                label='Category'
                options={categoryOptions}
                placeholder='Select a category...'
                required
                searchable
                search={categorySearch}
                onSearchChange={setCategorySearch}
                icon={<Icon icon='mdi:shape' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Form Actions */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit]) => (
            <Flex gap='3' mt='4' justify='end'>
              <Button 
                variant='soft' 
                color='gray' 
                onClick={onClose} // Panggil onClose, bukan router.back()
                type='button' 
                disabled={isSubmitting}
              >
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