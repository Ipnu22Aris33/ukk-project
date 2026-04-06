'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField } from '@/components/features/forms';
import { Text, Flex, Link } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';
import { activateFormSchema } from '@/lib/schema/auth';
import { useRouter } from 'next/navigation';

export default function ActivateForm({ setActiveTab }: { setActiveTab: () => void }) {
  const router = useRouter();
  const { activate } = useAuth();

  const form = useForm({
    defaultValues: {
      nis: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: activateFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await activate(value);
        router.replace('/'); // Redirect ke dashboard setelah aktivasi sukses
        form.reset();
        // Biasanya setelah aktivasi langsung redirect ke dashboard (diurus di dalam useAuth)
      } catch (err: any) {
        alert(err.message || 'Gagal melakukan aktivasi');
      }
    },
  });

  return (
    <FormCard maxWidth='450px' title='Aktivasi Akun' description='Masukkan NIS Anda dan lengkapi data untuk mengaktifkan akun perpustakaan'>
      <Form.Root
        autoComplete='off'
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* NIS - Kunci utama untuk mencari data Member */}
        <form.Field
          name='nis'
          children={(field) => (
            <InputField
              field={field}
              label='Nomor Induk Siswa (NIS)'
              placeholder='Masukkan NIS Anda'
              required
              icon={<Icon icon='mdi:card-account-details-outline' />}
            />
          )}
        />

        {/* USERNAME */}
        <form.Field
          name='username'
          children={(field) => (
            <InputField field={field} label='Username' placeholder='Pilih username unik' required icon={<Icon icon='mdi:account-circle-outline' />} />
          )}
        />

        {/* EMAIL */}
        <form.Field
          name='email'
          children={(field) => (
            <InputField field={field} label='Email' type='email' placeholder='contoh@email.com' required icon={<Icon icon='mdi:email-outline' />} />
          )}
        />

        {/* PASSWORD */}
        <form.Field
          name='password'
          children={(field) => (
            <InputField
              field={field}
              label='Password Baru'
              type='password'
              placeholder='Minimal 8 karakter'
              required
              icon={<Icon icon='mdi:lock-outline' />}
            />
          )}
        />

        {/* CONFIRM PASSWORD */}
        <form.Field
          name='confirmPassword'
          children={(field) => (
            <InputField
              field={field}
              label='Konfirmasi Password'
              type='password'
              placeholder='Ulangi password'
              required
              icon={<Icon icon='mdi:lock-check-outline' />}
            />
          )}
        />

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <FormActions
              layout='column'
              canSubmit={canSubmit}
              isSubmitting={isSubmitting}
              submitLabel='Aktifkan Sekarang'
              onReset={() => form.reset()}
            />
          )}
        </form.Subscribe>
      </Form.Root>

      <Flex align='center' justify='center' gap='1' mt='5' pt='5' style={{ borderTop: '1px solid var(--gray-6)' }}>
        <Text size='2' color='gray'>
          Sudah pernah melakukan aktivasi?
        </Text>

        <Link size='2' weight='medium' onClick={setActiveTab} style={{ cursor: 'pointer' }}>
          Login
        </Link>
      </Flex>
    </FormCard>
  );
}
