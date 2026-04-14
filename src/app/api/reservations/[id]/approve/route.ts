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

  const result = await db.transaction(async (tx) => {
    // 1. Ambil data reservasi & Lock baris buku untuk mencegah race condition
    const reservation = await tx.query.reservations.findFirst({
      where: and(eq(reservations.id, id), isNull(reservations.deletedAt)),
    });

    if (!reservation) throw new NotFound('Reservasi tidak ditemukan');
    if (reservation.status !== 'pending') throw new BadRequest('Reservasi sudah diproses atau dibatalkan');

    // Ambil data buku terbaru
    const [book] = await tx.select().from(books).where(eq(books.id, reservation.bookId)).for('update');
    if (!book) throw new NotFound('Data buku tidak ditemukan');

    // Validasi: Karena reservasi sudah memotong availableStock di awal, 
    // kita hanya perlu memastikan reservasi ini sah.
    
    const now = new Date();

    // 2. Update status reservasi menjadi picked_up (diambil)
    const [updatedReservation] = await tx
      .update(reservations)
      .set({
        status: 'picked_up',
        pickedUpAt: now,
        pickedUpBy: user?.id ?? null, // Mencatat siapa yang menyetujui
        updatedAt: now,
      })
      .where(eq(reservations.id, id))
      .returning();

    // 3. Buat data peminjaman (LOAN) otomatis
    const [loan] = await tx
      .insert(loans)
      .values({
        memberId: reservation.memberId,
        bookId: reservation.bookId,
        quantity: reservation.quantity,
        reservationId: reservation.id,
        notes: reservation.notes,
        loanDate: now,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Default 14 hari
        status: 'borrowed',
      })
      .returning();

    // 4. Update 4 Pilar Stok: Pindah dari Reserved ke Loaned
    // availableStock tidak berubah karena sudah dikurangi saat reservasi dibuat (pending)
    await tx
      .update(books)
      .set({
        reservedStock: sql`${books.reservedStock} - ${reservation.quantity}`,
        loanedStock: sql`${books.loanedStock} + ${reservation.quantity}`,
        updatedAt: now,
      })
      .where(eq(books.id, reservation.bookId));

    // Ambil data lengkap untuk response (karena kita butuh relasi member/book)
    const fullReservation = await tx.query.reservations.findFirst({
        where: eq(reservations.id, updatedReservation.id),
        with: { book: true, member: true }
    });

    const fullLoan = await tx.query.loans.findFirst({
        where: eq(loans.id, loan.id),
        with: { book: true, member: true }
    });

    return {
      reservation: safeParseResponse(reservationResponseSchema, fullReservation).data,
      loan: safeParseResponse(loanResponseSchema, fullLoan).data,
    };
  });

  return ok(result, {
    message: 'Reservasi disetujui dan peminjaman telah dibuat.',
  });
});
