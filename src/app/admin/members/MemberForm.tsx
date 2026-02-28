'use client';

import { Flex, Button } from '@radix-ui/themes';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { InputField, TextareaField } from '@/components/features/forms';
import { Icon } from '@iconify/react';
import { CreateMemberInput, UpdateMemberInput, memberFormSchema } from '@/lib/schema/member';

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
      email: initialData.email || '',
    },
    validators: {
      onChange: memberFormSchema,
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

        {/* Email Field - Required */}
        <form.Field name='email'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Email'
                placeholder='Enter email...'
                icon={<Icon icon='mdi:email' />}
                required
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Full Name Field - Required */}
        <form.Field name='fullName'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Full Name'
                placeholder='Enter full name...'
                icon={<Icon icon='mdi:account' />}
                required
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Class Field - Optional */}
        <form.Field name='memberClass'>
          {(field) => {
            const error = getFieldError(field);
            return <InputField field={field} label='Class' placeholder='Enter class (optional)...' icon={<Icon icon='mdi:school' />} error={error} />;
          }}
        </form.Field>

        {/* NIS Field - Optional */}
        <form.Field name='nis'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='NIS'
                placeholder='Enter NIS (optional)...'
                icon={<Icon icon='mdi:card-account-details' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Phone Field - Optional */}
        <form.Field name='phone'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField field={field} label='Phone' placeholder='Enter phone number (optional)...' icon={<Icon icon='mdi:phone' />} error={error} />
            );
          }}
        </form.Field>

        {/* Major Field - Optional */}
        <form.Field name='major'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <InputField
                field={field}
                label='Major'
                placeholder='Enter major (optional)...'
                icon={<Icon icon='mdi:book-education' />}
                error={error}
              />
            );
          }}
        </form.Field>

        {/* Address Field - TextArea */}
        <form.Field name='address'>
          {(field) => {
            const error = getFieldError(field);
            return (
              <TextareaField
                field={field}
                label='Address'
                placeholder='Enter address...'
                required
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