import { z } from 'zod';

/* ======================
   BASE
====================== */

export const loanSchema = z.object({
  id_loan: z.number().int().positive(),

  member_id: z.number().int().positive(),
  book_id: z.number().int().positive(),
  reservation_id: z.number().int().positive().nullable(),

  loan_date: z.iso.datetime(),
  due_date: z.iso.datetime(),
  quantity: z.number(),
  status: z.enum(['borrowed', 'returned', 'late', 'cancelled']),

  notes: z.string().nullable().optional(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

/* CREATE */
export const createLoanSchema = loanSchema
  .omit({
    id_loan: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .extend({ loan_date: z.iso.datetime().optional(), due_date: z.iso.datetime().optional() });

/* UPDATE */
export const updateLoanSchema = createLoanSchema.partial();

/* TYPES */
export type Loan = z.infer<typeof loanSchema>;
export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;

/* VALIDATORS */
export const validateCreateLoan = (data: unknown): CreateLoanInput => createLoanSchema.parse(data);

export const validateUpdateLoan = (data: unknown): UpdateLoanInput => updateLoanSchema.parse(data);
