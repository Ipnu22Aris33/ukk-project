'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField } from '@/components/features/forms';
import { Text, Flex, Link } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/schema/auth';
import { Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      identifier: '',
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
        autoComplete='on'
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name='identifier'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Email wajib diisi';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label='Email or Username'
              type='text'
              placeholder='Masukkan email atau username Anda'
              required
              icon={<Mail size={16} />}
            />
          )}
        </form.Field>

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
            <InputField field={field} label='Password' type='password' placeholder='Masukkan password Anda' required icon={<Lock size={16} />} />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <FormActions layout='column' canSubmit={canSubmit} isSubmitting={isSubmitting} submitLabel='Masuk' onReset={() => form.reset()} />
          )}
        </form.Subscribe>
      </Form.Root>

      <Flex align='center' justify='center' gap='1' mt='5' pt='5' style={{ borderTop: '1px solid var(--gray-6)' }}>
        <Text size='2' color='gray'>
          Belum melakukan aktivasi?
        </Text>
        <Link href='/auth/activate' size='2' weight='medium'>
          Aktivasi
        </Link>
      </Flex>
    </FormCard>
  );
}
