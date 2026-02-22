import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, Unauthorized, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { reservations, books } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { z } from 'zod';
import { updateReservationSchema } from '@/lib/schema/reservation';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

export const PATCH = handleApi(async ({ req, params, user }) => {
  if (!user) throw new Unauthorized('Silakan login terlebih dahulu');

  const reservationId = Number(params.id);
  if (!reservationId) throw new UnprocessableEntity('ID tidak valid');

  const data = await req.json();
  const payload = validateSchema(updateReservationSchema, data);

  const reservation = await db.query.reservations.findFirst({
    where: and(eq(reservations.id, reservationId), isNull(reservations.deletedAt)),
  });

  if (!reservation) throw new NotFound('Reservasi tidak ditemukan');

  if (user.role === 'member' && reservation.memberId !== user.member.id) {
    throw new Unauthorized('Anda tidak memiliki akses ke reservasi ini');
  }

  const updated = await db.transaction(async (tx) => {
    if (payload.status === 'approved' && reservation.status === 'pending') {
      const book = await tx.query.books.findFirst({
        where: eq(books.id, reservation.bookId),
      });

      if (!book || book.stock < reservation.quantity) {
        throw new UnprocessableEntity('Stok buku tidak mencukupi');
      }

      await tx
        .update(books)
        .set({
          stock: book.stock - reservation.quantity,
        })
        .where(eq(books.id, book.id));
    }

    if (payload.status === 'canceled' && reservation.status === 'approved') {
      const book = await tx.query.books.findFirst({
        where: eq(books.id, reservation.bookId),
      });

      if (book) {
        await tx
          .update(books)
          .set({
            stock: book.stock + reservation.quantity,
          })
          .where(eq(books.id, book.id));
      }
    }

    const [updatedReservation] = await tx
      .update(reservations)
      .set({
        ...payload,
      })
      .where(eq(reservations.id, reservationId))
      .returning();

    return updatedReservation;
  });

  return ok(safeParseResponse(updateReservationSchema, updated).data, { message: 'Reservasi berhasil diperbarui' });
});
