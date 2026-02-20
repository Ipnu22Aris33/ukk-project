import { z } from 'zod';
import { loanResponseSchema } from './loan';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';

export const returnSchema = z.object({
  id: z.number().int().positive(),
  loanId: z.number().int().positive(),
  returnedAt: z.date(),
  fineAmount: z.number().min(0).nullable(),
  fineStatus: z.enum(['paid', 'unpaid']).nullable(),
  condition: z.string().max(100).nullable(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Return = z.infer<typeof returnSchema>;

/* ======================
   RESPONSE
====================== */
export const returnResponseSchema = returnSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    loan: loanResponseSchema,
    member: memberResponseSchema,
    book: bookResponseSchema,
  });

export type ReturnResponse = z.infer<typeof returnResponseSchema>;

/* ======================
   CREATE
====================== */
export const createReturnSchema = z.object({
  loanId: z.number().int().positive(),
  notes: z.string().nullable().optional(),
  condition: z.string().max(100).optional(),
});

export type CreateReturnInput = z.infer<typeof createReturnSchema>;

export const validateCreateReturn = (data: unknown): CreateReturnInput => createReturnSchema.parse(data);

/* ======================
   UPDATE
====================== */
export const updateReturnSchema = z.object({
  fineStatus: z.enum(['paid', 'unpaid']).optional(),
  condition: z.string().max(100).optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateReturnInput = z.infer<typeof updateReturnSchema>;

export const validateUpdateReturn = (data: unknown): UpdateReturnInput => updateReturnSchema.parse(data);