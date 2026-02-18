import { z } from 'zod';

/* ======================
   BASE
====================== */

export const returnSchema = z.object({
  id_return: z.number().int().positive(),

  loan_id: z.number().int().positive(),

  returned_at: z.iso.datetime(),

  fine_amount: z.number().min(0),

  status: z.enum(['returned', 'late', 'lost']),

  notes: z.string().nullable().optional(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

/* CREATE */
export const createReturnSchema = returnSchema
  .omit({
    id_return: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .extend({ returned_at: z.iso.datetime().optional() });

/* UPDATE */
export const updateReturnSchema = createReturnSchema.partial();

/* TYPES */
export type Return = z.infer<typeof returnSchema>;
export type CreateReturnInput = z.infer<typeof createReturnSchema>;
export type UpdateReturnInput = z.infer<typeof updateReturnSchema>;

/* VALIDATORS */
export const validateCreateReturn = (data: unknown): CreateReturnInput => createReturnSchema.parse(data);

export const validateUpdateReturn = (data: unknown): UpdateReturnInput => updateReturnSchema.parse(data);
