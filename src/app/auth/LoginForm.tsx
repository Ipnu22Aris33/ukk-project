'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField } from '@/components/features/forms';
import { Text, Flex, Link } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/schema/auth';

export default function LoginForm({ setActiveTab }: { setActiveTab: () => void }) {
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
          name='identifier'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Email wajib diisi';
              return undefined;
            },
          }}
        >
          {(field) => <InputField field={field} label='Email' type='text' placeholder='contoh@email.com' required icon={<Icon icon='mdi:email' />} />}
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

      <Flex align='center' justify='center' gap='1' mt='5' pt='5' style={{ borderTop: '1px solid var(--gray-6)' }}>
        <Text size='2' color='gray'>
          Belum punya akun?
        </Text>

        <Link size='2' weight='medium' onClick={setActiveTab} style={{ cursor: 'pointer' }}>
          Daftar Sekarang
        </Link>
      </Flex>
    </FormCard>
  );
}
