import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';

import { db } from '@/lib/db';
import { books, loans, returns, members, reservations } from '@/lib/db/schema';

import { eq, and, isNull, lt, sql } from 'drizzle-orm';

export const GET = handleApi(async () => {
  const now = new Date();

  /* ===============================
     BOOKS
  =============================== */

  const [[{ totalBooks }], [{ borrowedBooks }], [{ lostBooks }]] = await Promise.all([
    db
      .select({ totalBooks: sql<number>`count(*)` })
      .from(books)
      .where(isNull(books.deletedAt)),

    db
      .select({ borrowedBooks: sql<number>`count(*)` })
      .from(loans)
      .where(and(eq(loans.status, 'borrowed'), isNull(loans.deletedAt))),

    db
      .select({ lostBooks: sql<number>`count(*)` })
      .from(returns)
      .where(and(eq(returns.condition, 'lost'), isNull(returns.deletedAt))),
  ]);

  const availableBooks = Number(totalBooks) - Number(borrowedBooks);

  /* ===============================
     MEMBERS
  =============================== */

  const [{ totalMembers }] = await db
    .select({ totalMembers: sql<number>`count(*)` })
    .from(members)
    .where(isNull(members.deletedAt));

  /* ===============================
     LOANS
  =============================== */

  const [[{ totalLoans }], [{ activeLoans }], [{ overdueLoans }]] = await Promise.all([
    db
      .select({ totalLoans: sql<number>`count(*)` })
      .from(loans)
      .where(isNull(loans.deletedAt)),

    db
      .select({ activeLoans: sql<number>`count(*)` })
      .from(loans)
      .where(and(eq(loans.status, 'borrowed'), isNull(loans.deletedAt))),

    db
      .select({ overdueLoans: sql<number>`count(*)` })
      .from(loans)
      .where(and(eq(loans.status, 'borrowed'), lt(loans.dueDate, now), isNull(loans.deletedAt))),
  ]);

  /* ===============================
     RETURNS
  =============================== */

  const [[{ totalReturns }], [{ lateReturns }]] = await Promise.all([
    db
      .select({ totalReturns: sql<number>`count(*)` })
      .from(returns)
      .where(isNull(returns.deletedAt)),

    db
      .select({ lateReturns: sql<number>`count(*)` })
      .from(returns)
      .where(and(eq(returns.condition, 'lost'), isNull(returns.deletedAt))),
  ]);

  /* ===============================
     RESERVATIONS
  =============================== */

  const [[{ totalReservations }], [{ activeReservations }]] = await Promise.all([
    db
      .select({ totalReservations: sql<number>`count(*)` })
      .from(reservations)
      .where(isNull(reservations.deletedAt)),

    db
      .select({ activeReservations: sql<number>`count(*)` })
      .from(reservations)
      .where(and(eq(reservations.status, 'approved'), isNull(reservations.deletedAt))),
  ]);

  /* ===============================
     LOANS PER MEMBER (JOIN)
  =============================== */

  const [{ loansPerMember }] = await db
    .select({ loansPerMember: sql<number>`count(*)` })
    .from(loans)
    .innerJoin(members, eq(members.id, loans.memberId))
    .where(and(eq(loans.status, 'borrowed'), isNull(loans.deletedAt)));

  return ok(
    {
      books: {
        total: Number(totalBooks),
        available: availableBooks,
        borrowed: Number(borrowedBooks),
        lost: Number(lostBooks),
      },
      members: {
        total: Number(totalMembers),
      },
      loans: {
        total: Number(totalLoans),
        active: Number(activeLoans),
        overdue: Number(overdueLoans),
        perMember: Number(loansPerMember),
      },
      returns: {
        total: Number(totalReturns),
        late: Number(lateReturns),
        lost: Number(lostBooks),
      },
      reservations: {
        total: Number(totalReservations),
        active: Number(activeReservations),
      },
    },
    { message: 'Dashboard overview retrieved successfully' }
  );
});
