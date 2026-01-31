'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField } from '@/components/features/forms';
import { Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/schemas/auth';

export default function LoginForm({ setActiveTab }: { setActiveTab: () => void }) {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await login(value);

        router.replace('/');

        form.reset();
      } catch (err: any) {
        alert(err.message);
      }
    },
  });

  return (
    <FormCard maxWidth='500px' title='Login' description='Masukkan email dan password Anda untuk masuk ke akun'>
      <Form.Root
      autoComplete='ok'
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* EMAIL */}
        <form.Field
          name='email'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Email wajib diisi';
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(value)) return 'Format email tidak valid';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField field={field} label='Email' type='email' placeholder='contoh@email.com' required icon={<Icon icon='mdi:email' />} />
          )}
        </form.Field>

        {/* PASSWORD */}
        <form.Field
          name='password'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Password wajib diisi';
              if (value.length < 6) return 'Password minimal 6 karakter';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label='Password'
              type='password'
              placeholder='Masukkan password Anda'
              required
              icon={<Icon icon='mdi:lock-outline' />}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <FormActions layout='column' canSubmit={canSubmit} isSubmitting={isSubmitting} submitLabel='Masuk' onReset={() => form.reset()} />
          )}
        </form.Subscribe>
      </Form.Root>

      <div className='text-center mt-8 pt-8 border-t border-(--gray-6)'>
        <Text size='2' className='text-(--gray-11)' as='span'>
          Belum punya akun?{' '}
        </Text>
        <button
          type='button'
          onClick={setActiveTab}
          className='
            font-semibold 
            p-0 
            border-0 
            bg-transparent 
            cursor-pointer
            transition-colors
            duration-200
            text-(--accent-11) 
            hover:text-(--accent-12)
            hover:underline
          '
        >
          Daftar Sekarang
        </button>
      </div>
    </FormCard>
  );
}
