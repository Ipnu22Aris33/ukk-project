import { z } from 'zod';

/* ======================
   BASE
====================== */

export const reservationSchema = z.object({
  id_reservation: z.number().int().positive(),

  reservation_code: z.string().min(3).max(100),

  member_id: z.number().int().positive(),
  book_id: z.number().int().positive(),

  status: z.enum(['pending', 'approved', 'rejected', 'expired', 'completed']),
  quantity: z.number(),
  reserved_at: z.iso.datetime(),
  approved_at: z.iso.datetime().nullable(),
  approved_by: z.number().int().positive().nullable(),

  expires_at: z.iso.datetime().nullable(),

  notes: z.string().nullable().optional(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

/* CREATE */
export const createReservationSchema = reservationSchema.omit({
  id_reservation: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

/* UPDATE */
export const updateReservationSchema = createReservationSchema.partial();

/* TYPES */
export type Reservation = z.infer<typeof reservationSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

/* VALIDATORS */
export const validateCreateReservation = (data: unknown): CreateReservationInput => createReservationSchema.parse(data);

export const validateUpdateReservation = (data: unknown): UpdateReservationInput => updateReservationSchema.parse(data);
