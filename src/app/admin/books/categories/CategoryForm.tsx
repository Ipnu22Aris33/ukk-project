// components/features/categories/CategoryForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, TextareaField } from '@/components/features/forms';
import { Icon } from '@iconify/react';
import { CreateCategoryInput, UpdateCategoryInput, categoryFormSchema } from '@/lib/schema/category';

interface CategoryFormProps {
  initialData?: CreateCategoryInput | UpdateCategoryInput;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function CategoryForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Category', onClose }: CategoryFormProps) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
    },
    validators: {
      onChange: categoryFormSchema,
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
        {/* Name Field */}
        <form.Field name='name'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField field={field} label='Name' placeholder='Enter category name...' icon={<Icon icon='mdi:tag' />} required error={error} />
            );
          }}
        </form.Field>

        {/* Description Field with TextArea */}
        <form.Field name='description'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <TextareaField
                field={field}
                label='Description'
                placeholder='Enter category description...'
                // icon={<Icon icon='mdi:text-box' />}
                required
                error={error}
                rows={4}
              />
            );
          }}
        </form.Field>

        {/* Form Actions */}
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit]) => (
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
