import { z } from 'zod';

export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const categoryInputSchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi').max(255, 'Maksimal 255 karakter'),
  description: z.string().max(1000, 'Maksimal 1000 karakter'),
});

export const categoryResponseSchema = categorySchema.omit({
  deletedAt: true,
});

export const createCategorySchema = categoryInputSchema.extend({
  slug: z.string().min(1).max(255).optional(),
});

export const updateCategorySchema = categoryInputSchema.partial();

export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type Category = z.infer<typeof categorySchema>;
export type CategoryResponse = z.infer<typeof categoryResponseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
