import { z } from 'zod';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';
import { reservationResponseSchema } from './reservation';
import { loanStatusEnum } from '../db/schema';

export const loanSchema = z.object({
  id: z.number().int().positive(),
  memberId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  reservationId: z.number().int().positive().nullable().default(null),
  loanDate: z.date(),
  dueDate: z.date(),
  quantity: z.number().int().positive(),
  status: z.enum(loanStatusEnum.enumValues),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const loanInputSchema = loanSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const loanResponseSchema = loanSchema.omit({ deletedAt: true }).extend({
  member: memberResponseSchema,
  book: bookResponseSchema,
  reservation: reservationResponseSchema.optional(),
});

export const createLoanSchema = loanInputSchema.extend({
  loanDate: z.date().optional(),
  dueDate: z.date().optional(),
});

export const updateLoanSchema = loanInputSchema.partial();

export const loanFormSchema = z.object({
  memberId: z.number().int().positive().optional(),
  bookId: z.number().int().positive().optional(),
  quantity: z.number().int().positive(),           // ← required, default di form
  loanDate: z.date(),                               // ← required, default di form
  dueDate: z.date(),                                // ← required, default di form
  notes: z.string(),                                // ← required, default di form
  status: z.enum(loanStatusEnum.enumValues).optional(),
});

export const loanSubmitSchema = z.object({
  memberId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  loanDate: z.date(),
  dueDate: z.date(),
  notes: z.string().optional(),
  status: z.enum(loanStatusEnum.enumValues).optional(),
});

export type Loan = z.infer<typeof loanSchema>;
export type LoanResponse = z.infer<typeof loanResponseSchema>;
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;
export type LoanFormValues = z.infer<typeof loanFormSchema>;
export type LoanSubmitValues = z.infer<typeof loanSubmitSchema>;
