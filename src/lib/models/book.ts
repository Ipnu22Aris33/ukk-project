// types/book.ts
import { z } from 'zod';
import { ApiResponse } from '@/lib/utils/apiResponse';

/* =====================================================
 * CONSTANTS
 * ===================================================== */

const CURRENT_YEAR = new Date().getFullYear();

/* =====================================================
 * DATABASE SCHEMA (Representation from DB)
 * ===================================================== */

export const bookDbSchema = z.object({
  id_book: z.string(),

  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  publisher: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),

  stock: z.number().int().min(0),
  year: z
    .number()
    .int()
    .min(1900)
    .max(CURRENT_YEAR + 5),
  isbn: z.string().min(10).max(13),

  category_id: z.string().uuid(),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

/* =====================================================
 * RELATION SCHEMA
 * ===================================================== */

export const categoryRelationSchema = z.object({
  id_category: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
});

export const bookWithCategorySchema = bookDbSchema.extend({
  category: categoryRelationSchema.optional(),
});

/* =====================================================
 * INPUT SCHEMAS
 * ===================================================== */

// Base input tanpa system fields
const bookInputBase = bookDbSchema.omit({
  id_book: true,
  slug: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

// CREATE
export const createBookSchema = bookInputBase.extend({
  stock: z.number().int().min(0).default(0),
});

// UPDATE (semua optional)
export const updateBookSchema = bookInputBase.partial();

/* =====================================================
 * QUERY SCHEMA (SIMPLE VERSION)
 * ===================================================== */

export const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
});

/* =====================================================
 * TYPES
 * ===================================================== */

export type Book = z.infer<typeof bookDbSchema>;
export type BookWithCategory = z.infer<typeof bookWithCategorySchema>;

export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;

export type BookQueryParams = z.infer<typeof bookQuerySchema>;

/* =====================================================
 * API RESPONSE TYPES
 * ===================================================== */

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type BookListResponse = ApiResponse<BookWithCategory[], PaginationMeta>;

export type BookDetailResponse = ApiResponse<BookWithCategory>;

export type BookMutationResponse = ApiResponse<Book>;

export type BookDeleteResponse = ApiResponse<null>;

/* =====================================================
 * FORM DEFAULTS
 * ===================================================== */

export const defaultCreateBook: CreateBookInput = {
  title: '',
  author: '',
  publisher: '',
  stock: 0,
  year: CURRENT_YEAR,
  isbn: '',
  category_id: '',
};

/* =====================================================
 * VALIDATION HELPERS
 * ===================================================== */

export const validateCreateBook = (data: unknown) => createBookSchema.parse(data);

export const validateUpdateBook = (data: unknown) => updateBookSchema.parse(data);

export const validateBookQuery = (data: unknown) => bookQuerySchema.parse(data);
