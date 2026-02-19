import { z } from 'zod';

/* ======================
   BASE (DB SHAPE - snake_case)
====================== */

export const returnSchema = z.object({
  id_return: z.number().int().positive(),

  loan_id: z.number().int().positive(),

  returned_at: z.string().datetime(),

  fine_amount: z.number().min(0).nullable(),

  fine_status: z.enum(['paid', 'unpaid']).nullable(),

  condition: z.string().max(100).nullable(),

  notes: z.string().nullable().optional(),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  deleted_at: z.string().datetime().nullable(),
});

/* ======================
   CREATE
====================== */

export const createReturnSchema = z.object({
  loan_id: z.number().int().positive(),
  notes: z.string().nullable().optional(),
  condition: z.string().max(100).optional(),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;

/* ======================
   UPDATE
====================== */

export const updateReturnSchema = z.object({
  fine_status: z.enum(['paid', 'unpaid']).optional(),
  condition: z.string().max(100).optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateReturnInput = z.infer<typeof updateReturnSchema>;

/* ======================
   RESPONSE (camelCase - API shape)
====================== */

export const returnResponseSchema = z.object({
  id: z.number(),
  returnedAt: z.string(),
  fineAmount: z.number().nullable(),
  fineStatus: z.enum(['paid', 'unpaid']).nullable(),
  condition: z.string().nullable(),

  loan: z.object({
    id: z.number(),
    loanDate: z.string(),
    dueDate: z.string(),
    status: z.string(),
  }),

  member: z
    .object({
      id: z.number(),
      fullName: z.string(),
      phone: z.string().nullable(),
      memberClass: z.string().nullable(),
      major: z.string().nullable(),
    })
    .nullable(),

  book: z
    .object({
      id: z.number(),
      title: z.string(),
      author: z.string().nullable(),
      publisher: z.string().nullable(),
      categoryId: z.number().nullable(),
    })
    .nullable(),
});

export type ReturnResponse = z.infer<typeof returnResponseSchema>;

/* ======================
   VALIDATORS
====================== */

export const validateCreateReturn = (data: unknown): CreateReturnInput =>
  createReturnSchema.parse(data);

export const validateUpdateReturn = (data: unknown): UpdateReturnInput =>
  updateReturnSchema.parse(data);
