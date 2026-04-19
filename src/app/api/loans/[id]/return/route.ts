// app/api/loans/[id]/return/route.ts

import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { createReturnSchema } from '@/lib/schema/return';
import { returnResponseSchema } from '@/lib/schema/return';
import { db } from '@/lib/db';
import { returns, loans, books } from '@/lib/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

export const POST = handleApi(async ({ req, params }) => {
  const loanId = Number(params?.id);
  if (!loanId) throw new BadRequest('ID peminjaman tidak valid');

  const data = await req.json();
  const { notes, condition } = validateSchema(
    createReturnSchema.omit({ loanId: true }),
    data
  );

  const result = await db.transaction(async (tx) => {
    const loan = await tx.query.loans.findFirst({
      where: and(eq(loans.id, loanId), isNull(loans.deletedAt)),
    });

    if (!loan) throw new NotFound('Data peminjaman tidak ditemukan');
    if (loan.status === 'returned') throw new BadRequest('Buku sudah pernah dikembalikan');

    const [book] = await tx.select().from(books).where(eq(books.id, loan.bookId)).for('update');
    if (!book) throw new NotFound('Data buku tidak ditemukan');

    const now = new Date();
    const dueDate = new Date(loan.dueDate);
    const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = lateDays * 1000;

    const isLost = condition === 'lost';
    const stockUpdate = isLost
      ? { totalStock: sql`${books.totalStock} - ${loan.quantity}` }
      : { availableStock: sql`${books.availableStock} + ${loan.quantity}` };

    const [insertedReturn] = await Promise.all([
      tx
        .insert(returns)
        .values({
          loanId: loan.id,
          returnedAt: now,
          fineAmount: fineAmount.toString(),
          fineStatus: fineAmount > 0 ? 'unpaid' : 'none',
          condition,
          notes: notes ?? null,
        })
        .returning(),

      tx.update(loans).set({ status: 'returned', updatedAt: now }).where(eq(loans.id, loan.id)),

      tx
        .update(books)
        .set({
          ...stockUpdate,
          loanedStock: sql`${books.loanedStock} - ${loan.quantity}`,
          updatedAt: now,
        })
        .where(eq(books.id, loan.bookId)),
    ]);

    return insertedReturn[0];
  });

  return ok(safeParseResponse(returnResponseSchema, result).data, {
    message: condition === 'lost' ? 'Buku dilaporkan hilang, stok total telah disesuaikan.' : 'Buku berhasil dikembalikan.',
  });
});
