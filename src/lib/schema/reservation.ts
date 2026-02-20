import { z } from 'zod';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';
import { userResponseSchema } from './user';

export const reservationSchema = z.object({
  id: z.number().int().positive(),
  reservationCode: z.string().min(3).max(100),
  memberId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  status: z.enum(['pending', 'approved', 'rejected', 'expired', 'completed']),
  quantity: z.number(),
  reservedAt: z.date(),
  approvedAt: z.date().nullable(),
  approvedBy: z.number().int().positive().nullable(),
  expiresAt: z.date().nullable(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type Reservation = z.infer<typeof reservationSchema>;

export const reservationResponseSchema = reservationSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    member: memberResponseSchema,
    book: bookResponseSchema,
    approver: userResponseSchema.nullable(),
  });

export type ReservationResponse = z.infer<typeof reservationResponseSchema>;

/* ======================
   CREATE
====================== */
export const createReservationSchema = reservationSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  })
  .extend({
    memberId: z.number().int().positive().optional(),
    reservationCode: z.string().min(3).max(100).optional(),
    status: z.enum(['pending', 'approved', 'rejected', 'expired', 'completed']).optional(),
    reservedAt: z.date().optional(),
    approvedAt: z.date().nullable().optional(),
    approvedBy: z.number().int().positive().nullable().optional(),
    expiresAt: z.date().nullable().optional(),
  });

export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const validateCreateReservation = (data: unknown): CreateReservationInput => createReservationSchema.parse(data);

/* ======================
   UPDATE
====================== */
export const updateReservationSchema = createReservationSchema.partial();

export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

export const validateUpdateReservation = (data: unknown): UpdateReservationInput => updateReservationSchema.parse(data);