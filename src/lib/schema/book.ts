import { z } from 'zod';
import { categoryResponseSchema } from './category';

const CURRENT_YEAR = new Date().getFullYear();

// 1. Base Schema (Mencerminkan kolom Fisik di DB)
export const bookSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  categoryId: z.number().int().positive(),
  publisher: z.string().min(1).max(255).nullable(),
  
  // 4 Pilar Stok Fisik di DB
  totalStock: z.number().int().min(0),
  availableStock: z.number().int().min(0),
  reservedStock: z.number().int().min(0),
  loanedStock: z.number().int().min(0),
  
  slug: z.string().min(1).max(255),
  isbn: z.string().min(10).max(13).nullable(),
  coverUrl: z.url().nullable().or(z.literal('')), 
  coverPublicId: z.string().nullable(),
  year: z.number().int().min(1900).max(CURRENT_YEAR + 5).nullable(),
  
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// 2. Form Schema (Biasanya digunakan di Frontend/React Hook Form)
export const bookFormSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255),
  author: z.string().min(1, 'Penulis wajib diisi').max(255),
  categoryId: z.number().min(1, 'Kategori wajib dipilih'),
  publisher: z.string().min(1, 'Penerbit wajib diisi').max(255),
  totalStock: z.number().min(0, 'Total stok minimal 0'),
  availableStock: z.number().min(0, 'Stok tersedia minimal 0'),
  isbn: z.string().min(10, 'ISBN minimal 10 digit').max(13, 'ISBN maksimal 13 digit'),
  year: z.number().min(1900).max(CURRENT_YEAR + 5),
});

// 3. Create API Schema
export const createBookSchema = bookSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  reservedStock: true, // Default 0
  loanedStock: true,   // Default 0
})

// 4. Update API Schema
export const updateBookSchema = createBookSchema.partial();

// 5. Response Schema (Untuk dikirim ke Frontend)
export const bookResponseSchema = bookSchema
  .omit({ deletedAt: true })
  .extend({
    category: categoryResponseSchema.optional(),
  });

// Types
export type Book = z.infer<typeof bookSchema>;
export type BookFormInput = z.infer<typeof bookFormSchema>;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type BookResponse = z.infer<typeof bookResponseSchema>;