'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, TextareaField } from '@/components/features/forms';
import { CreateMemberInput, UpdateMemberInput, memberFormSchema } from '@/lib/schema/member';
import { User2, School, CreditCard, Phone, BookOpen, MapPin } from 'lucide-react';

interface MemberFormProps {
  initialData?: CreateMemberInput | UpdateMemberInput;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onClose?: () => void;
}

export function MemberForm({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Member', onClose }: MemberFormProps) {
  const form = useForm({
    defaultValues: {
      fullName: initialData.fullName || '',
      memberClass: initialData.memberClass || '',
      address: initialData.address || '',
      nis: initialData.nis || '',
      phone: initialData.phone || '',
      major: initialData.major || '',
    },
    validators: {
      onChange: memberFormSchema,
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
        <form.Field name='fullName'>
          {(field) => (
            <InputField
              field={field}
              label='Full Name'
              placeholder='Enter full name...'
              icon={<User2 size={16} />}
              required
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='memberClass'>
          {(field) => (
            <InputField
              field={field}
              label='Class'
              placeholder='Enter class (optional)...'
              icon={<School size={16} />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='nis'>
          {(field) => (
            <InputField
              field={field}
              label='NIS'
              placeholder='Enter NIS (optional)...'
              icon={<CreditCard size={16} />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='phone'>
          {(field) => (
            <InputField
              field={field}
              label='Phone'
              placeholder='Enter phone number (optional)...'
              icon={<Phone size={16} />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='major'>
          {(field) => (
            <InputField
              field={field}
              label='Major'
              placeholder='Enter major (optional)...'
              icon={<BookOpen size={16} />}
              error={getFieldError(field)}
            />
          )}
        </form.Field>

        <form.Field name='address'>
          {(field) => (
            <TextareaField
              field={field}
              label='Address'
              placeholder='Enter address...'
              icon={<MapPin size={16} />}
              required
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
