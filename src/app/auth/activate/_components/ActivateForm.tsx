'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import { FormCard, FormActions, InputField } from '@/components/features/forms';
import { Text, Flex, Link, Button, Dialog, Box, IconButton } from '@radix-ui/themes';
import { useAuth } from '@/hooks/useAuth';
import { activateFormSchema } from '@/lib/schema/auth';
import { useRouter } from 'next/navigation';
import { useMembers } from '@/hooks/useMembers';
import { CreditCard, User, Mail, Lock, ShieldCheck, Search } from 'lucide-react';

export default function ActivateForm() {
  const router = useRouter();
  const { activate } = useAuth();
  const member = useMembers();

  const [open, setOpen] = useState(false);
  const [nisData, setNisData] = useState<any>(null);
  const [nis, setNis] = useState<string | null>(null);

  const { data, isFetching, error } = member.getBy('nis', nis, !!nis);

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
        router.replace('/');
        form.reset();
      } catch (err: any) {
        alert(err.message || 'Gagal melakukan aktivasi');
      }
    },
  });

  useEffect(() => {
    if (data) {
      const d = data.data;
      setNisData({
        name: d.fullName,
        class: d.memberClass,
        status: d.isActive === true ? 'Sudah Aktif' : 'Belum Aktif',
      });
      setOpen(true);
      setNis(null);
    }
    if (error) {
      setNis(null);
    }
  }, [data, error]);

  const handleCheckNis = () => {
    const value = form.getFieldValue('nis');
    if (!value) return alert('Masukkan NIS dulu');
    setNis(value);
    setNisData(null);
  };

  return (
    <>
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
          <form.Field name='nis'>
            {(field) => (
              <Flex gap='2' align='end'>
                <Box style={{ flex: 1 }}>
                  <InputField
                    field={field}
                    label='Nomor Induk Siswa (NIS)'
                    placeholder='Masukkan NIS Anda'
                    required
                    icon={<CreditCard size={16} />}
                  />
                </Box>
                <IconButton variant='soft' onClick={handleCheckNis} loading={isFetching} style={{ height: 40, width: 40 }}>
                  <Search size={16} />
                </IconButton>
              </Flex>
            )}
          </form.Field>

          <form.Field name='username'>
            {(field) => <InputField field={field} label='Username' placeholder='Pilih username unik' required icon={<User size={16} />} />}
          </form.Field>

          <form.Field name='email'>
            {(field) => <InputField field={field} label='Email' type='email' placeholder='contoh@email.com' required icon={<Mail size={16} />} />}
          </form.Field>

          <form.Field name='password'>
            {(field) => (
              <InputField field={field} label='Password Baru' type='password' placeholder='Minimal 8 karakter' required icon={<Lock size={16} />} />
            )}
          </form.Field>

          <form.Field name='confirmPassword'>
            {(field) => (
              <InputField
                field={field}
                label='Konfirmasi Password'
                type='password'
                placeholder='Ulangi password'
                required
                icon={<ShieldCheck size={16} />}
              />
            )}
          </form.Field>

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
          <Link href='/auth/login' weight='medium'>
            Login
          </Link>
        </Flex>
      </FormCard>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth='400px'>
          <Dialog.Title>Data Siswa</Dialog.Title>
          {nisData && (
            <Flex direction='column' gap='2' mt='3'>
              <Text>Nama: {nisData.name}</Text>
              <Text>Kelas: {nisData.class}</Text>
              <Text>Status: {nisData.status}</Text>
            </Flex>
          )}
          <Flex justify='end' mt='4'>
            <Dialog.Close>
              <Button>Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
