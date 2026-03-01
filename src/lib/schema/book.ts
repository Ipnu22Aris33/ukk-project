import { z } from 'zod';
import { categoryResponseSchema } from './category';

const CURRENT_YEAR = new Date().getFullYear();

export const bookSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  categoryId: z.number().int().positive(),
  publisher: z.string().min(1).max(255),
  stock: z.number().int().min(0),
  slug: z.string().min(1).max(255),
  isbn: z.string().min(10).max(13),
  coverUrl: z.url().nullable(),
  coverPublicId: z.string().nullable(),
  year: z
    .number()
    .int()
    .min(1900)
    .max(CURRENT_YEAR + 5),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const bookInputSchema = bookSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const bookResponseSchema = bookSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    category: categoryResponseSchema,
  });

export const bookFormSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  author: z.string().min(1, 'Penulis wajib diisi').max(255),

  categoryId: z.number().min(1, 'Kategori wajib dipilih'),

  publisher: z.string().min(1, 'Penerbit wajib diisi').max(255),

  stock: z.number().min(0, 'Stok harus ≥ 0'),
  isbn: z.string().min(10, 'ISBN minimal 10 digit').max(13, 'ISBN maksimal 13 digit'),

  year: z
    .number()
    .min(1900, 'Tahun minimal 1900')
    .max(CURRENT_YEAR + 5),
});

export type BookFormInput = z.infer<typeof bookFormSchema>;
export const createBookSchema = bookInputSchema;
export const updateBookSchema = bookInputSchema.partial();
export type Book = z.infer<typeof bookSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
