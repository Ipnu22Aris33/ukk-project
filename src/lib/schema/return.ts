import { z } from 'zod';
import { loanResponseSchema } from './loan';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';
import { fineStatusEnum, returnConditionEnum } from '../db/schema';

export const returnSchema = z.object({
  id: z.number().int().positive(),
  loanId: z.number().int().positive(),
  returnedAt: z.date(),
  fineAmount: z.number().min(0).nullable(),
  fineStatus: z.enum(fineStatusEnum.enumValues).nullable(),
  condition: z.enum(returnConditionEnum.enumValues).nullable(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const returnInputSchema = returnSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const returnResponseSchema = returnSchema.omit({ deletedAt: true }).extend({
  loan: loanResponseSchema,
  member: memberResponseSchema,
  book: bookResponseSchema,
});

export const createReturnSchema = returnInputSchema.pick({
  loanId: true,
  notes: true,
  condition: true,
});

export const updateReturnSchema = returnInputSchema
  .pick({
    fineStatus: true,
    condition: true,
    notes: true,
  })
  .partial();

export type Return = z.infer<typeof returnSchema>;
export type ReturnResponse = z.infer<typeof returnResponseSchema>;
export type CreateReturnInput = z.infer<typeof createReturnSchema>;
export type UpdateReturnInput = z.infer<typeof updateReturnSchema>;
