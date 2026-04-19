// components/features/categories/CategoryForm.tsx
'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, TextareaField } from '@/components/features/forms';
import { CreateCategoryInput, UpdateCategoryInput, categoryFormSchema } from '@/lib/schema/category';
import { Tag, AlignLeft } from 'lucide-react';

interface CategoryFormProps {
  initialData?: CreateCategoryInput | UpdateCategoryInput;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function CategoryForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Category', onClose }: CategoryFormProps) {
  const form = useForm({
    defaultValues: {
      name: initialData.name || '',
      description: initialData.description || '',
    },
    validators: {
      onChange: categoryFormSchema,
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
        <form.Field name='name'>
          {(field) => (
            <InputField
              field={field}
              label='Name'
              placeholder='Enter category name...'
              icon={<Tag size={16} />}
              required
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='description'>
          {(field) => (
            <TextareaField
              field={field}
              label='Description'
              placeholder='Enter category description...'
              icon={<AlignLeft size={16} />}
              required
              error={getFieldError(field)}
              rows={4}
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
