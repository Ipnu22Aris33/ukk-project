import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, Unauthorized, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { reservations, books, loans } from '@/lib/db/schema';
import { eq, and, isNull, sql } from 'drizzle-orm';
import { updateReservationSchema } from '@/lib/schema/reservation';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

export const PATCH = handleApi(async ({ req, params, user }) => {
  if (!user) throw new Unauthorized('Silakan login terlebih dahulu');

  const reservationId = Number(params.id);
  if (!reservationId) throw new UnprocessableEntity('ID tidak valid');

  const data = await req.json();
  const payload = validateSchema(updateReservationSchema, data);

  const result = await db.transaction(async (tx) => {
    // 1. Ambil data reservasi lama
    const reservation = await tx.query.reservations.findFirst({
      where: and(eq(reservations.id, reservationId), isNull(reservations.deletedAt)),
    });

    if (!reservation) throw new NotFound('Reservasi tidak ditemukan');
    if (user.role === 'member') throw new Unauthorized('Akses ditolak');

    // Jika status tidak berubah, langsung update data lainnya saja
    if (payload.status === reservation.status) {
      const [updated] = await tx.update(reservations).set(payload).where(eq(reservations.id, reservationId)).returning();
      return updated;
    }

    const now = new Date();

    // --- LOGIKA 4 PILAR STOK BERDASARKAN PERUBAHAN STATUS ---

    // CASE A: PENDING -> PICKED_UP (Buku diambil oleh member)
    if (payload.status === 'picked_up' && reservation.status === 'pending') {
      // Buat data Loan otomatis
      await tx.insert(loans).values({
        memberId: reservation.memberId,
        bookId: reservation.bookId,
        quantity: reservation.quantity,
        reservationId: reservation.id,
        loanDate: now,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
      });

      // Update Stok: Pindah dari reserved ke loaned
      await tx.update(books)
        .set({
          reservedStock: sql`${books.reservedStock} - ${reservation.quantity}`,
          loanedStock: sql`${books.loanedStock} + ${reservation.quantity}`,
        })
        .where(eq(books.id, reservation.bookId));
      
      payload.pickedUpAt = now;
      payload.pickedUpBy = user.id;
    }

    // CASE B: PENDING -> CANCELED / REJECTED (Reservasi batal, stok balik ke rak)
    if ((payload.status === 'cancelled' || payload.status === 'rejected') && reservation.status === 'pending') {
      await tx.update(books)
        .set({
          reservedStock: sql`${books.reservedStock} - ${reservation.quantity}`,
          availableStock: sql`${books.availableStock} + ${reservation.quantity}`,
        })
        .where(eq(books.id, reservation.bookId));
    }

    // CASE C: PICKED_UP -> CANCELLED (Skenario khusus jika peminjaman dibatalkan sepihak sebelum buku dibawa)
    if (payload.status === 'cancelled' && reservation.status === 'picked_up') {
       // Opsional: Hapus loan yang terlanjur dibuat atau update status loan-nya
       await tx.update(books)
        .set({
          loanedStock: sql`${books.loanedStock} - ${reservation.quantity}`,
          availableStock: sql`${books.availableStock} + ${reservation.quantity}`,
        })
        .where(eq(books.id, reservation.bookId));
    }

    const [updatedReservation] = await tx
      .update(reservations)
      .set({ ...payload, updatedAt: now })
      .where(eq(reservations.id, reservationId))
      .returning();

    return updatedReservation;
  });

  return ok(result, { message: 'Reservasi berhasil diperbarui' });
});