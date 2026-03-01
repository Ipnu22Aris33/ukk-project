'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import { InputField, SelectField } from '@/components/features/forms';
import { useCategories } from '@/hooks/useCategories';
import { uploadImage } from '@/lib/upload/uploadClient';
import { bookFormSchema, BookFormInput } from '@/lib/schema/book';
import { FileField } from '@/components/features/forms/FileField';
import { Icon } from '@iconify/react';

interface BookFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<BookFormInput> & {
    coverUrl?: string | null;
    coverPublicId?: string | null;
  };
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function BookForm({
  mode,
  initialData = {}, // 🔥 FIX DI SINI
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Book',
  onClose,
}: BookFormProps) {
  const categories = useCategories();
  const [categorySearch, setCategorySearch] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  const categoryList = categories.list({
    page: 1,
    limit: 10,
    search: categorySearch,
  });

  const categoryOptions =
    categoryList.data?.data.map((cat) => ({
      value: cat.id,
      label: cat.name,
    })) ?? [];

  const form = useForm({
    defaultValues: {
      title: initialData.title ?? '',
      author: initialData.author ?? '',
      publisher: initialData.publisher ?? '',
      stock: initialData.stock ?? 1,
      year: initialData.year ?? new Date().getFullYear(),
      isbn: initialData.isbn ?? '',
      categoryId: initialData.categoryId ?? 0,
    },
    validators: {
      onChange: bookFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (mode === 'create' && !coverFile) {
        setCoverError('Cover wajib diupload');
        return;
      }

      setCoverError(null);

      const uploadResult = coverFile ? await uploadImage(coverFile, 'cover') : null;

      await onSubmit({
        ...value,
        coverUrl: uploadResult?.data.url ?? initialData.coverUrl ?? null,
        coverPublicId: uploadResult?.data.publicId ?? initialData.coverPublicId ?? null,
      });
    },
  });

  const getFieldError = (field: any) => field.state.meta.errors?.[0]?.message;

  return (
    <Form.Root
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <Flex direction='column' gap='4'>
        <FileField
          label='Cover Image'
          required={mode === 'create'}
          value={coverFile}
          onChange={setCoverFile}
          error={coverError ?? undefined}
          initialPreviewUrl={initialData.coverUrl ?? null}
        />
        
        <form.Field name='title'>
          {(field) => (
            <InputField
              field={field}
              label='Title'
              icon={<Icon icon='mdi:book' />}
              required
              error={getFieldError(field)}
              placeholder='Enter book title...'
            />
          )}
        </form.Field>

        <form.Field name='author'>
          {(field) => (
            <InputField
              field={field}
              label='Author'
              icon={<Icon icon='mdi:account-edit' />}
              required
              error={getFieldError(field)}
              placeholder='Enter author name...'
            />
          )}
        </form.Field>

        <form.Field name='publisher'>
          {(field) => (
            <InputField
              field={field}
              label='Publisher'
              icon={<Icon icon='mdi:office-building' />}
              required
              error={getFieldError(field)}
              placeholder='Enter publisher name...'
            />
          )}
        </form.Field>

        <form.Field name='isbn'>
          {(field) => (
            <InputField
              field={field}
              label='ISBN'
              icon={<Icon icon='mdi:barcode' />}
              error={getFieldError(field)}
              placeholder='Enter ISBN number...'
            />
          )}
        </form.Field>

        <form.Field name='year'>
          {(field) => (
            <InputField
              field={field}
              type='number'
              label='Year'
              icon={<Icon icon='mdi:calendar' />}
              required
              error={getFieldError(field)}
              placeholder='Enter publication year...'
            />
          )}
        </form.Field>

        <form.Field name='stock'>
          {(field) => (
            <InputField
              field={field}
              type='number'
              label='Stock'
              icon={<Icon icon='mdi:counter' />}
              required
              error={getFieldError(field)}
              placeholder='Enter stock quantity...'
            />
          )}
        </form.Field>

        <form.Field name='categoryId'>
          {(field) => (
            <SelectField
              field={field}
              label='Category'
              options={categoryOptions}
              placeholder='Select a category...'
              searchable
              search={categorySearch}
              onSearchChange={setCategorySearch}
              icon={<Icon icon='mdi:shape' />}
              required
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit]}>
          {([canSubmit]) => (
            <Flex gap='3' justify='end' mt='4'>
              <Button type='button' variant='soft' onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>

              <Button type='submit' disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? 'Saving...' : submitLabel}
              </Button>
            </Flex>
          )}
        </form.Subscribe>
      </Flex>
    </Form.Root>
  );
}
