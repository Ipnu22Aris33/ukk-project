'use client';

import { useEffect } from 'react';
import { Dialog, Button, Flex, Box } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import { useForm } from '@tanstack/react-form';
import { InputField, SelectField } from '@/components/features/forms';
import { Icon } from '@iconify/react';

interface Book {
  id_book: string;
  title: string;
  author: string;
  publisher: string;
  slug: string;
  stock: number;
  year: number;
  isbn: string;
  category_id: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onSubmit: (data: any, id: string) => Promise<void>;
  loading?: boolean;
  categoryOptions: { value: string; label: string }[];
  categorySearch: string;
  setCategorySearch: (v: string) => void;
}

export function BookModal({
  open,
  onOpenChange,
  book,
  onSubmit,
  loading = false,
  categoryOptions,
  categorySearch,
  setCategorySearch,
}: Props) {
  const form = useForm({
    defaultValues: {
      title: '',
      author: '',
      publisher: '',
      slug: '',
      stock: 1,
      year: new Date().getFullYear(),
      isbn: '',
      category_id: '',
    },
    onSubmit: async ({ value }) => {
      if (!book) return;

      await onSubmit(
        {
          ...value,
          stock: Number(value.stock),
          year: Number(value.year),
          category_id: Number(value.category_id),
        },
        book.id_book
      );
    },
  });

  // Inject data ketika book berubah
  useEffect(() => {
    if (book) {
      form.setFieldValue('title', book.title);
      form.setFieldValue('author', book.author);
      form.setFieldValue('publisher', book.publisher);
      form.setFieldValue('slug', book.slug);
      form.setFieldValue('stock', book.stock);
      form.setFieldValue('year', book.year);
      form.setFieldValue('isbn', book.isbn);
      form.setFieldValue('category_id', String(book.category_id));
    }
  }, [book]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Edit Book</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Update book information
        </Dialog.Description>

        <Form.Root
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <Box className="space-y-4">

            <form.Field name="title">
              {(field) => (
                <InputField field={field} label="Title" icon={<Icon icon="mdi:book" />} />
              )}
            </form.Field>

            <form.Field name="author">
              {(field) => (
                <InputField field={field} label="Author" icon={<Icon icon="mdi:account-edit" />} />
              )}
            </form.Field>

            <form.Field name="publisher">
              {(field) => (
                <InputField field={field} label="Publisher" icon={<Icon icon="mdi:office-building" />} />
              )}
            </form.Field>

            <form.Field name="isbn">
              {(field) => (
                <InputField field={field} label="ISBN" icon={<Icon icon="mdi:barcode" />} />
              )}
            </form.Field>

            <form.Field name="year">
              {(field) => (
                <InputField field={field} type="number" label="Year" icon={<Icon icon="mdi:calendar" />} />
              )}
            </form.Field>

            <form.Field name="stock">
              {(field) => (
                <InputField field={field} type="number" label="Stock" icon={<Icon icon="mdi:counter" />} />
              )}
            </form.Field>

            <form.Field name="category_id">
              {(field) => (
                <SelectField
                  field={field}
                  label="Category"
                  options={categoryOptions}
                  searchable
                  search={categorySearch}
                  onSearchChange={setCategorySearch}
                  icon={<Icon icon="mdi:shape" />}
                />
              )}
            </form.Field>

            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray">
                  Cancel
                </Button>
              </Dialog.Close>

              <Button type="submit" variant="solid" loading={loading}>
                Update
              </Button>
            </Flex>

          </Box>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
}
