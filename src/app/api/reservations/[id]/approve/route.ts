import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { reservations, loans, books } from '@/lib/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { safeParseResponse } from '@/lib/utils/validate';
import { reservationResponseSchema } from '@/lib/schema/reservation';
import { loanResponseSchema } from '@/lib/schema/loan';

export const PATCH = handleApi(async ({ params, user }) => {
  const id = Number(params.id);

  if (!id) throw new BadRequest('Invalid reservation id');

  const reservation = await db.query.reservations.findFirst({
    where: and(eq(reservations.id, id), isNull(reservations.deletedAt)),
    with: {
      book: true,
      member: true,
    },
  });

  if (!reservation) throw new NotFound('Reservation not found');
  if (reservation.status !== 'pending') throw new BadRequest('Reservation is not pending');
  if (reservation.book.stock < reservation.quantity) throw new BadRequest('Book stock is insufficient');

  const result = await db.transaction(async (tx) => {
    // Update reservation status
    const [updatedReservation] = await tx
      .update(reservations)
      .set({
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: user?.id ?? null,
        updatedAt: new Date(),
      })
      .where(eq(reservations.id, id))
      .returning();

    // Create loan from reservation
    const [loan] = await tx
      .insert(loans)
      .values({
        memberId: reservation.memberId,
        bookId: reservation.bookId,
        quantity: reservation.quantity,
        reservationId: reservation.id,
        notes: reservation.notes,
        loanDate: new Date(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: 'borrowed',
      })
      .returning();

    // Update book stock
    await tx
      .update(books)
      .set({
        stock: sql`${books.stock} - ${reservation.quantity}`,
      })
      .where(eq(books.id, reservation.bookId));

    return {
      reservation: safeParseResponse(reservationResponseSchema, updatedReservation).data,
      loan: safeParseResponse(loanResponseSchema, loan).data,
    };
  });

  return ok(result, {
    message: 'Reservation approved and loan created successfully',
  });
});
