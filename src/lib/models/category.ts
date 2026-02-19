import { z } from 'zod';

export const categorySchema = z.object({
  id: z.number().int().positive(),

  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().nullable().optional(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

/* CREATE */
export const createCategorySchema = categorySchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
}).extend({slug: z.string().min(1).max(255).optional()});

/* UPDATE */
export const updateCategorySchema = createCategorySchema.partial();

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export const validateCreateCategory = (data: unknown) => {
  return createCategorySchema.parse(data);
};

export const validateUpdateCategory = (data: unknown) => {
  return updateCategorySchema.parse(data);
};
