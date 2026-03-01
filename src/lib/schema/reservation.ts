import { z } from 'zod';
import { memberResponseSchema } from './member';
import { bookResponseSchema } from './book';
import { userResponseSchema } from './user';
import { reservationStatusEnum } from '../db/schema';

export const reservationSchema = z.object({
  id: z.number().int().positive(),
  reservationCode: z.string().min(3).max(100),
  memberId: z.number().int().positive(),
  bookId: z.number().int().positive(),
  status: z.enum(reservationStatusEnum.enumValues),
  quantity: z.number().int().positive(),
  reservedAt: z.date(),
  approvedAt: z.date().nullable(),
  approvedBy: z.number().int().positive().nullable(),
  expiresAt: z.date().nullable(),
  notes: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const reservationInputSchema = reservationSchema.omit({
  id: true,
  reservationCode: true,
  memberId: true,
  status: true,
  reservedAt: true,
  approvedAt: true,
  approvedBy: true,
  expiresAt: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const reservationResponseSchema = reservationSchema.omit({ deletedAt: true }).extend({
  member: memberResponseSchema,
  book: bookResponseSchema,
  approver: userResponseSchema.nullable(),
});

export const createReservationSchema = reservationInputSchema;
export const updateReservationSchema = reservationInputSchema.partial();

export type Reservation = z.infer<typeof reservationSchema>;
export type ReservationResponse = z.infer<typeof reservationResponseSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
