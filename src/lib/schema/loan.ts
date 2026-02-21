import { z } from 'zod';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';
import { reservationResponseSchema } from './reservation';

/* ======================
   BASE
====================== */
export const loanSchema = z.object({
  id: z.number().int().positive(),
  memberId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  reservationId: z.number().int().positive().nullable(),
  loanDate: z.date(),
  dueDate: z.date(),
  quantity: z.number(),
  status: z.enum(['borrowed', 'returned', 'late', 'cancelled']),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Loan = z.infer<typeof loanSchema>;

/* ======================
   RESPONSE
====================== */
export const loanResponseSchema = loanSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    member: memberResponseSchema,
    book: bookResponseSchema,
    reservation: reservationResponseSchema.nullable(),
  });

export type LoanResponse = z.infer<typeof loanResponseSchema>;

/* ======================
   CREATE
====================== */
export const createLoanSchema = loanSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({ 
    loanDate: z.date().optional(), 
    dueDate: z.date().optional() 
  });

export type CreateLoanInput = z.infer<typeof createLoanSchema>;

export const validateCreateLoan = (data: unknown): CreateLoanInput => 
  createLoanSchema.parse(data);

/* ======================
   UPDATE
====================== */
export const updateLoanSchema = createLoanSchema.partial();

export type UpdateLoanInput = z.infer<typeof updateLoanSchema>;

export const validateUpdateLoan = (data: unknown): UpdateLoanInput => 
  updateLoanSchema.parse(data);