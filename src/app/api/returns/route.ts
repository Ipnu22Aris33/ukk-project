import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { createReturnSchema, returnResponseSchema } from '@/lib/schema/return';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { returns, loans, books } from '@/lib/db/schema';
import { eq, isNull, and, sql } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const { loanId, notes, condition } = validateSchema(createReturnSchema, data);

  const result = await db.transaction(async (tx) => {
    // 1. Ambil data Loan & Lock baris buku
    const loan = await tx.query.loans.findFirst({
      where: and(eq(loans.id, loanId), isNull(loans.deletedAt)),
    });

    if (!loan) throw new NotFound('Data peminjaman tidak ditemukan');
    if (loan.status === 'returned') throw new BadRequest('Buku sudah pernah dikembalikan');

    const [book] = await tx.select().from(books).where(eq(books.id, loan.bookId)).for('update');
    if (!book) throw new NotFound('Data buku tidak ditemukan');

    // 2. Kalkulasi Denda (Functional)
    const now = new Date();
    const dueDate = new Date(loan.dueDate);
    const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = lateDays * 1000;

    // 3. Tentukan Delta Stok berdasarkan Kondisi Buku
    // Jika LOST: totalStock berkurang, loanedStock berkurang (available tetap).
    // Jika GOOD/DAMAGED: availableStock bertambah, loanedStock berkurang.
    const isLost = condition === 'lost';
    const stockUpdate = isLost
      ? { totalStock: sql`${books.totalStock} - ${loan.quantity}` }
      : { availableStock: sql`${books.availableStock} + ${loan.quantity}` };

    // 4. Eksekusi Updates secara Paralel
    const [insertedReturn] = await Promise.all([
      // A. Catat data pengembalian
      tx.insert(returns).values({
        loanId: loan.id,
        returnedAt: now,
        fineAmount: fineAmount.toString(),
        fineStatus: fineAmount > 0 ? 'unpaid' : 'paid',
        condition,
        notes: notes ?? null,
      }).returning(),

      // B. Update status peminjaman
      tx.update(loans).set({ 
        status: 'returned', 
        updatedAt: now 
      }).where(eq(loans.id, loan.id)),

      // C. Update 4 Pilar Stok Buku
      tx.update(books).set({
        ...stockUpdate,
        loanedStock: sql`${books.loanedStock} - ${loan.quantity}`,
        updatedAt: now,
      }).where(eq(books.id, loan.bookId)),
    ]);

    return insertedReturn[0];
  });

  return ok(safeParseResponse(returnResponseSchema, result).data, { 
    message: condition === 'lost' 
      ? 'Buku dilaporkan hilang, stok total telah disesuaikan.' 
      : 'Buku berhasil dikembalikan.' 
  });
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir } = parseQuery(url);

  const result = await paginate({
    db,
    table: returns,
    query: db.query.returns,
    page,
    limit,
    search,
    searchable: [returns.id, returns.fineStatus, returns.condition],
    sortable: {
      id: returns.id,
      returnedAt: returns.returnedAt,
      fineAmount: returns.fineAmount,
    },
    orderBy,
    orderDir,
    where: isNull(returns.deletedAt),
    with: {
      loan: {
        with: {
          member: {
            with: {
              user: true,
            },
          },
          book: {
            with: {
              category: true,
            },
          },
        },
      },
    },
  });
  const safe = safeParseResponse(returnResponseSchema, result.data);
  return ok(safe.data, {
    message: 'Returns retrieved successfully',
    meta: result.meta,
  });
});
