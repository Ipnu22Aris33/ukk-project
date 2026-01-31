'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField, SelectField } from '@/components/features/forms';
import { Text } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { RegisterInput, registerSchema } from '@/lib/schemas/auth';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm({ setActiveTab }: { setActiveTab: () => void }) {
  const { register } = useAuth();

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      class: '',
      major: '',
      phone: '',
    },

    validators: {
      onSubmit: registerSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await register(value);
        form.reset();
      } catch (err: any) {
        alert(err.message);
      }
    },
  });
  return (
    <FormCard maxWidth='500px' title='Daftar Akun' description='Isi data diri Anda untuk membuat akun baru'>
      <Form.Root
        autoComplete='ok'
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* NAME */}
        <form.Field
          name='name'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Nama lengkap wajib diisi';
              if (value.length < 3) return 'Nama minimal 3 karakter';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label='Nama Lengkap'
              placeholder='Masukkan nama lengkap Anda'
              required
              icon={<Icon icon='mdi:account-outline' />}
            />
          )}
        </form.Field>

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
            <InputField field={field} label='Email' type='email' placeholder='contoh@email.com' required icon={<Icon icon='mdi:email-outline' />} />
          )}
        </form.Field>

        {/* PASSWORD */}
        <form.Field
          name='password'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Password wajib diisi';
              if (value.length < 8) return 'Password minimal 8 karakter';
              if (!/[A-Z]/.test(value)) return 'Password harus mengandung huruf besar';
              if (!/[0-9]/.test(value)) return 'Password harus mengandung angka';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label='Password'
              type='password'
              placeholder='Minimal 8 karakter dengan huruf besar dan angka'
              required
              icon={<Icon icon='mdi:lock-outline' />}
            />
          )}
        </form.Field>

        {/* CLASS */}
        <form.Field
          name='class'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Kelas wajib diisi';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField field={field} label='Kelas' placeholder='Contoh: XII IPA 1, 3A, Semester 5' required icon={<Icon icon='mdi:class' />} />
          )}
        </form.Field>

        {/* MAJOR */}
        <form.Field
          name='major'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Jurusan wajib diisi';
              return undefined;
            },
          }}
        >
          {(field) => (
            <SelectField
              icon={<Icon icon='mdi:class' width={16} height={16} />}
              field={field}
              label='Jurusan'
              options={[
                { value: 'informatika', label: 'Informatika' },
                { value: 'sipil', label: 'Teknik Sipil' },
                { value: 'elektro', label: 'Teknik Elektro' },
                { value: 'mesin', label: 'Teknik Mesin' },
                { value: 'industri', label: 'Teknik Industri' },
                { value: 'arsitektur', label: 'Arsitektur' },
                { value: 'kedokteran', label: 'Kedokteran' },
                { value: 'hukum', label: 'Hukum' },
                { value: 'ekonomi', label: 'Ekonomi' },
                { value: 'lainnya', label: 'Lainnya' },
              ]}
              placeholder='Pilih jurusan'
              required
            />
          )}
        </form.Field>

        {/* PHONE */}
        <form.Field
          name='phone'
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Nomor telepon wajib diisi';
              const phoneRegex = /^[0-9+\-\s()]+$/;
              if (!phoneRegex.test(value)) return 'Format nomor telepon tidak valid';
              if (value.replace(/\D/g, '').length < 10) return 'Nomor telepon minimal 10 digit';
              return undefined;
            },
          }}
        >
          {(field) => (
            <InputField
              field={field}
              label='Nomor Telepon'
              type='tel'
              placeholder='Contoh: 081234567890'
              required
              icon={<Icon icon='mdi:phone-outline' />}
            />
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <FormActions layout='column' canSubmit={canSubmit} isSubmitting={isSubmitting} submitLabel='Daftar' onReset={() => form.reset()} />
          )}
        </form.Subscribe>
      </Form.Root>

      <div className='text-center mt-8 pt-8 border-t border-(--gray-6)'>
        <Text size='2' className='text-(--gray-11)' as='span'>
          Sudah punya akun?{' '}
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
          Masuk Sekarang
        </button>
      </div>
    </FormCard>
  );
}
