// types/book.ts
import { z } from 'zod';
import { ApiResponse } from '@/lib/apiResponse';

/* =======================
 * BASE SCHEMA
 * ======================= */

// Schema untuk Book (sesuai dengan database)
export const bookSchema = z.object({
  id_book: z.string(), // atau z.string() kalau bukan UUID
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author too long'),
  publisher: z.string().min(1, 'Publisher is required').max(255, 'Publisher too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  year: z.number().int().min(1900, 'Year must be 1900 or later').max(new Date().getFullYear(), 'Year cannot be in the future'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters').max(13, 'ISBN too long'),
  category_id: z.string(), // atau z.string() kalau bukan UUID

  // Optional fields (kalau ada)
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  deleted_at: z.string().datetime().optional().nullable(),
});

// Schema untuk Book dengan relasi Category (untuk response list/detail)
export const bookWithCategorySchema = bookSchema.extend({
  category: z
    .object({
      id_category: z.string(),
      name: z.string(),
      slug: z.string(),
    })
    .optional(),
});

/* =======================
 * INPUT SCHEMAS (untuk create/update)
 * ======================= */

// Schema untuk Create Book (tanpa id_book, slug, dan timestamps)
export const createBookSchema = bookSchema
  .omit({
    id_book: true,
    slug: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .extend({
    // Validasi tambahan untuk create
    stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
    year: z
      .number()
      .int()
      .min(1900, 'Year must be 1900 or later')
      .max(new Date().getFullYear() + 5, 'Year terlalu jauh'), // +5 untuk buku baru
  });

// Schema untuk Update Book (semua field optional except id)
export const updateBookSchema = z.object({
  id_book: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long').optional(),
  author: z.string().min(1, 'Author is required').max(255, 'Author too long').optional(),
  publisher: z.string().min(1, 'Publisher is required').max(255, 'Publisher too long').optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 5, 'Year terlalu jauh')
    .optional(),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters').max(13, 'ISBN too long').optional(),
  category_id: z.string().uuid().optional(),
});

// Schema untuk Update tanpa ID (payload saja)
export const updateBookPayloadSchema = updateBookSchema.omit({ id_book: true });

/* =======================
 * QUERY PARAMS SCHEMA
 * ======================= */

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  orderBy: z.enum(['b.created_at', 'b.title', 'b.author', 'b.year', 'b.stock']).optional(),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
  category_id: z.string().uuid().optional(),
  min_year: z.coerce.number().int().optional(),
  max_year: z.coerce.number().int().optional(),
  in_stock: z.coerce.boolean().optional(),
});

/* =======================
 * TYPES (z.infer)
 * ======================= */

// Type untuk Book (dari database)
export type Book = z.infer<typeof bookSchema>;

// Type untuk Book dengan Category
export type BookWithCategory = z.infer<typeof bookWithCategorySchema>;

// Type untuk Create Book Input
export type CreateBookInput = z.infer<typeof createBookSchema>;

// Type untuk Update Book Input (dengan ID)
export type UpdateBookInput = z.infer<typeof updateBookSchema>;

// Type untuk Update Book Payload (tanpa ID)
export type UpdateBookPayload = z.infer<typeof updateBookPayloadSchema>;

// Type untuk Query Params
export type BookQueryParams = z.infer<typeof bookQuerySchema>;

/* =======================
 * API RESPONSE TYPES
 * ======================= */

// List Response
export type BookListResponse = ApiResponse<
  BookWithCategory[],
  {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
>;

// Single Book Response
export type BookDetailResponse = ApiResponse<BookWithCategory>;

// Create Response
export type BookCreateResponse = ApiResponse<Book>;

// Update Response
export type BookUpdateResponse = ApiResponse<Book>;

// Delete Response
export type BookDeleteResponse = ApiResponse<null>;

/* =======================
 * FORM DEFAULTS
 * ======================= */

// Default values untuk form create
export const defaultCreateBook: CreateBookInput = {
  title: '',
  author: '',
  publisher: '',
  stock: 0,
  year: new Date().getFullYear(),
  isbn: '',
  category_id: '',
};

/* =======================
 * VALIDATION FUNCTIONS
 * ======================= */

// Helper functions untuk validasi
export const validateCreateBook = (data: unknown) => {
  return createBookSchema.parse(data);
};

export const validateUpdateBook = (data: unknown) => {
  return updateBookPayloadSchema.parse(data);
};

export const validateBookQuery = (data: unknown) => {
  return bookQuerySchema.parse(data);
};
