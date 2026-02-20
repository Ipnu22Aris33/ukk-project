import { z } from 'zod';

export const categorySchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  createdAt: z.date(),  // Diubah ke z.date() dan camelCase
  updatedAt: z.date(),  // Diubah ke z.date() dan camelCase
  deletedAt: z.date().nullable(),  // Diubah ke z.date() dan camelCase
});

export type Category = z.infer<typeof categorySchema>;

export const categoryResponseSchema = categorySchema.omit({
  deletedAt: true,  // camelCase
});

export type CategoryResponse = z.infer<typeof categoryResponseSchema>;

export const createCategorySchema = categorySchema
  .omit({
    id: true,
    createdAt: true,  // camelCase
    updatedAt: true,  // camelCase
    deletedAt: true,  // camelCase
  })
  .extend({
    slug: z.string().min(1).max(255).optional(),
  });

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const validateCreateCategory = (data: unknown) => {
  return createCategorySchema.parse(data);
};

/* ======================
   UPDATE
====================== */
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const validateUpdateCategory = (data: unknown) => {
  return updateCategorySchema.parse(data);
};