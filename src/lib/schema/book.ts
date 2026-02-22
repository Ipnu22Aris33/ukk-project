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

export const createBookSchema = bookInputSchema;
export const updateBookSchema = bookInputSchema.partial();
export type Book = z.infer<typeof bookSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
