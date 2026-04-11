import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { reservations, books } from '@/lib/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { safeParseResponse } from '@/lib/utils/validate';
import { reservationResponseSchema } from '@/lib/schema/reservation';

export const PATCH = handleApi(async ({ params, user }) => {
  const id = Number(params.id);
  if (!id) throw new BadRequest('Invalid reservation id');

  const result = await db.transaction(async (tx) => {
    // 1. Cari data reservasi
    const reservation = await tx.query.reservations.findFirst({
      where: and(eq(reservations.id, id), isNull(reservations.deletedAt)),
    });

    if (!reservation) throw new NotFound('Reservasi tidak ditemukan');
    if (reservation.status !== 'pending') {
      throw new BadRequest(`Reservasi tidak bisa ditolak karena statusnya sudah ${reservation.status}`);
    }

    const now = new Date();

    // 2. Update status reservasi menjadi REJECTED
    const [updatedReservation] = await tx
      .update(reservations)
      .set({
        status: 'rejected',
        updatedAt: now,
        // Optional: Jika kamu punya kolom rejectedBy atau notes untuk alasan penolakan
      })
      .where(eq(reservations.id, id))
      .returning();

    // 3. Kembalikan stok: Kurangi Reserved, Tambahkan kembali ke Available
    await tx
      .update(books)
      .set({
        reservedStock: sql`${books.reservedStock} - ${reservation.quantity}`,
        availableStock: sql`${books.availableStock} + ${reservation.quantity}`,
        updatedAt: now,
      })
      .where(eq(books.id, reservation.bookId));

    // 4. Ambil data lengkap untuk response
    const fullReservation = await tx.query.reservations.findFirst({
      where: eq(reservations.id, updatedReservation.id),
      with: { book: true, member: true }
    });

    return safeParseResponse(reservationResponseSchema, fullReservation).data;
  });

  return ok(result, {
    message: 'Reservasi telah ditolak dan stok buku telah dikembalikan.',
  });
});