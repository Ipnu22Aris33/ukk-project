import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { validateCreateReturn } from '@/lib/models/return';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';

import { db } from '@/lib/db';
import { returns, loans, books } from '@/lib/db/schema';

import { eq, isNull, and, sql } from 'drizzle-orm';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const { loan_id, notes, condition } = validateCreateReturn(data);
  
  // Ensure condition is one of the allowed enum values
  const validConditions = ['lost', 'good', 'damaged'] as const;
  if (!validConditions.includes(condition as any)) {
    throw new UnprocessableEntity('Invalid condition value');
  }
  const typedCondition = condition as typeof validConditions[number];

  const result = await db.transaction(async (tx) => {
    /* ===============================
       FIND LOAN (ONLY ACTIVE)
    =============================== */

    const loan = await tx.query.loans.findFirst({
      where: and(eq(loans.id, loan_id), isNull(loans.deletedAt)),
    });

    if (!loan) {
      throw new NotFound('Data peminjaman tidak ditemukan');
    }

    if (loan.status === 'returned') {
      throw new UnprocessableEntity('Buku sudah dikembalikan');
    }

    /* ===============================
       FINE CALCULATION
    =============================== */

    const now = new Date();
    const dueDate = new Date(loan.dueDate);

    const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const fineAmount = lateDays * 1000;
    const fineStatus = fineAmount > 0 ? 'unpaid' : 'paid';

    /* ===============================
       INSERT RETURN
    =============================== */

    const [insertedReturn] = await tx
      .insert(returns)
      .values({
        loanId: loan.id,
        returnedAt: now,
        fineAmount: fineAmount.toString(), // karena numeric
        fineStatus,
        condition: typedCondition,
        notes: notes ?? null,
      })
      .returning();

    /* ===============================
       UPDATE LOAN STATUS
    =============================== */

    await tx
      .update(loans)
      .set({
        status: 'returned',
        updatedAt: new Date(),
      })
      .where(eq(loans.id, loan.id));

    /* ===============================
       INCREMENT BOOK STOCK
    =============================== */

    await tx
      .update(books)
      .set({
        stock: sql`${books.stock} + ${loan.quantity}`,
      })
      .where(eq(books.id, loan.bookId));

    return insertedReturn;
  });

  return ok(result, { message: 'Book returned successfully' });
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
          member: true,
          book: true,
        },
      },
    },
  });

  return ok(result.data, {
    message: 'Returns retrieved successfully',
    meta: result.meta,
  });
});
