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
import { BarcodeIcon, BookIcon, Building, CalendarIcon, LayersPlus, PenBoxIcon, PackageCheck, Tag } from 'lucide-react';

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

export function BookForm({ mode, initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Book', onClose }: BookFormProps) {
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
      totalStock: initialData.totalStock ?? 1,
      availableStock: initialData.availableStock ?? initialData.totalStock ?? 1,
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
              icon={<BookIcon size={16} />}
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
              icon={<PenBoxIcon size={16} />}
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
              icon={<Building size={16} />}
              required
              error={getFieldError(field)}
              placeholder='Enter publisher name...'
            />
          )}
        </form.Field>

        <form.Field name='isbn'>
          {(field) => (
            <InputField field={field} label='ISBN' icon={<BarcodeIcon size={16} />} error={getFieldError(field)} placeholder='Enter ISBN number...' />
          )}
        </form.Field>

        <form.Field name='year'>
          {(field) => (
            <InputField
              field={field}
              type='number'
              label='Year'
              icon={<CalendarIcon size={16} />}
              required
              error={getFieldError(field)}
              placeholder='Enter publication year...'
            />
          )}
        </form.Field>

        <form.Field name='totalStock'>
          {(field) => (
            <InputField
              field={field}
              type='number'
              label='Total Stock'
              icon={<LayersPlus size={16} />}
              required
              error={getFieldError(field)}
              placeholder='Total physical books...'
            />
          )}
        </form.Field>

        <form.Field name='availableStock'>
          {(field) => (
            <InputField
              field={field}
              type='number'
              label='Available Stock'
              icon={<PackageCheck size={16} />}
              required
              error={getFieldError(field)}
              placeholder='Books available on shelf...'
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
              icon={<Tag size={16} />}
              required
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        {/* BUTTON */}
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
