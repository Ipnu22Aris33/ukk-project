'use client';

import { useForm } from '@tanstack/react-form';
import * as Form from '@radix-ui/react-form';
import {
  FormCard,
  FormActions,
  InputField,
  SelectField,
  TextareaField,
} from '@/components/ui/forms';

export default function BookForm() {
  const form = useForm({
    defaultValues: {
      title: '',
      author: '',
      year: '',
      genre: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      console.log('Book data:', value);
      alert(`Buku "${value.title}" berhasil disimpan`);
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center p-4'>
      <FormCard
        title='Tambah Buku Baru'
        description='Isi informasi buku yang akan ditambahkan ke koleksi'
      >
        <Form.Root
          className='space-y-4'
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* TITLE */}
          <form.Field
            name='title'
            validators={{
              onChange: ({ value }) => (!value ? 'Judul wajib diisi' : undefined),
            }}
          >
            {(field) => (
              <InputField
                field={field}
                label='Judul Buku'
                placeholder='Masukkan judul buku'
                required
              />
            )}
          </form.Field>

          {/* AUTHOR */}
          <form.Field
            name='author'
            validators={{
              onChange: ({ value }) => (!value ? 'Penulis wajib diisi' : undefined),
            }}
          >
            {(field) => (
              <InputField field={field} label='Penulis' placeholder='Nama penulis' required />
            )}
          </form.Field>

          {/* YEAR */}
          <form.Field
            name='year'
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'Tahun terbit wajib diisi';
                const year = parseInt(value);
                if (isNaN(year)) return 'Tahun harus angka';
                if (year < 1900) return 'Tahun minimal 1900';
                if (year > new Date().getFullYear() + 1) return 'Tahun terlalu besar';
                return undefined;
              },
            }}
          >
            {(field) => (
              <InputField
                field={field}
                label='Tahun Terbit'
                type='number'
                placeholder='Contoh: 2023'
                required
              />
            )}
          </form.Field>

          {/* GENRE */}
          <form.Field name='genre'>
            {(field) => (
              <SelectField
                field={field}
                label='Genre'
                options={[
                  { value: 'fiction', label: 'Fiksi' },
                  { value: 'non-fiction', label: 'Non-Fiksi' },
                  { value: 'fantasy', label: 'Fantasi' },
                  { value: 'sci-fi', label: 'Sains Fiksi' },
                  { value: 'other', label: 'Lainnya' },
                ]}
                placeholder='Pilih genre'
              />
            )}
          </form.Field>

          <form.Field
            name='description'
            validators={{
              onChange: ({ value }) =>
                value && value.length > 500 ? 'Maksimal 500 karakter' : undefined,
            }}
          >
            {(field) => (
              <TextareaField
                field={field}
                label='Deskripsi'
                placeholder='Masukkan deskripsi buku'
                rows={4}
              />
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <FormActions
                canSubmit={canSubmit}
                isSubmitting={isSubmitting}
                submitLabel='Simpan Buku'
                onReset={() => form.reset()}
              />
            )}
          </form.Subscribe>
        </Form.Root>
      </FormCard>
    </div>
  );
}
