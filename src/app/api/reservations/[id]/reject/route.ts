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

    // 2. Cek current stock buku
    const currentBook = await tx.query.books.findFirst({
      where: eq(books.id, reservation.bookId),
    });

    if (!currentBook) throw new NotFound('Buku tidak ditemukan');

    // 3. Validasi agar tidak menjadi negatif
    const newReservedStock = currentBook.reservedStock - reservation.quantity;
    const newAvailableStock = currentBook.availableStock + reservation.quantity;

    if (newReservedStock < 0) {
      throw new BadRequest(`Data tidak konsisten: reserved stock (${currentBook.reservedStock}) tidak bisa dikurangi ${reservation.quantity}`);
    }

    if (newAvailableStock > currentBook.totalStock) {
      throw new BadRequest(`Data tidak konsisten: available stock (${newAvailableStock}) melebihi total stock (${currentBook.totalStock})`);
    }

    const now = new Date();

    // 4. Update status reservasi menjadi REJECTED
    const [updatedReservation] = await tx
      .update(reservations)
      .set({
        status: 'rejected',
        updatedAt: now,
        // rejectedBy: user?.id, // jika ada kolom rejectedBy
        // rejectedAt: now, // jika ada kolom rejectedAt
      })
      .where(eq(reservations.id, id))
      .returning();

    // 5. Kembalikan stok dengan aman menggunakan nilai absolut
    await tx
      .update(books)
      .set({
        reservedStock: sql`GREATEST(${books.reservedStock} - ${reservation.quantity}, 0)`,
        availableStock: sql`LEAST(${books.availableStock} + ${reservation.quantity}, ${books.totalStock})`,
        updatedAt: now,
      })
      .where(eq(books.id, reservation.bookId));

    // 6. Ambil data lengkap untuk response
    const fullReservation = await tx.query.reservations.findFirst({
      where: eq(reservations.id, updatedReservation.id),
      with: { book: true, member: true },
    });

    return safeParseResponse(reservationResponseSchema, fullReservation).data;
  });

  return ok(result, {
    message: 'Reservasi telah ditolak dan stok buku telah dikembalikan.',
  });
});
