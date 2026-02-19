import { z } from 'zod';

const CURRENT_YEAR = new Date().getFullYear();

/* ======================
   BASE DB SCHEMA
====================== */

export const bookSchema = z.object({
  id_book: z.number().int().positive(),

  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  category_id: z.number().int().positive(),
  publisher: z.string().min(1).max(255),

  stock: z.number().int().min(0),
  slug: z.string().min(1).max(255),
  isbn: z.string().min(10).max(13),
  year: z
    .number()
    .int()
    .min(1900)
    .max(CURRENT_YEAR + 5),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export const categoryResponseSchema = z.object({
  id_category: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
});

/* ======================
   BOOK RESPONSE
====================== */
export const bookResponseSchema = z.object({
  id_book: z.number().int().positive(),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
   slug: z.string().min(1).max(255),
  stock: z.number().int().min(0),
  isbn: z.string(),
  year: z.number().int(),

  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),

  category: categoryResponseSchema, // nested
});

/* ======================
   TYPE INFERENCE
====================== */
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;

/* CREATE */
export const createBookSchema = bookSchema.omit({
  id_book: true,
  slug: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

/* UPDATE */
export const updateBookSchema = createBookSchema.partial();

export type Book = z.infer<typeof bookSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export const validateCreateBook = (data: unknown): CreateBookInput => {
  return createBookSchema.parse(data);
};

export const validateUpdateBook = (data: unknown): UpdateBookInput => {
  return updateBookSchema.parse(data);
};
