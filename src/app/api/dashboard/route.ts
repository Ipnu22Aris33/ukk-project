import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { db } from '@/lib/db';
import { books, loans, returns, members, reservations } from '@/lib/db/schema';
import { eq, and, isNull, lt, sql } from 'drizzle-orm';

export const GET = handleApi(async () => {
  const now = new Date().toISOString();
  
  const [stats] = await db
    .select({
      // BOOKS
      totalBooks: sql<number>`(SELECT count(*) FROM ${books} WHERE ${books.deletedAt} IS NULL)`,
      borrowedBooks: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.status} = 'borrowed' AND ${loans.deletedAt} IS NULL)`,
      lostBooks: sql<number>`(SELECT count(*) FROM ${returns} WHERE ${returns.condition} = 'lost' AND ${returns.deletedAt} IS NULL)`,

      // MEMBERS
      totalMembers: sql<number>`(SELECT count(*) FROM ${members} WHERE ${members.deletedAt} IS NULL)`,

      // LOANS
      totalLoans: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.deletedAt} IS NULL)`,
      overdueLoans: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.status} = 'borrowed' AND ${loans.dueDate} < ${now} AND ${loans.deletedAt} IS NULL)`,

      // RETURNS
      totalReturns: sql<number>`(SELECT count(*) FROM ${returns} WHERE ${returns.deletedAt} IS NULL)`,

      // RESERVATIONS
      totalReservations: sql<number>`(SELECT count(*) FROM ${reservations} WHERE ${reservations.deletedAt} IS NULL)`,
      activeReservations: sql<number>`(SELECT count(*) FROM ${reservations} WHERE ${reservations.status} = 'approved' AND ${reservations.deletedAt} IS NULL)`,
    })
    .from(sql`(SELECT 1) as dummy`);

  const totalBooks = Number(stats.totalBooks);
  const borrowedBooks = Number(stats.borrowedBooks);
  const availableBooks = totalBooks - borrowedBooks;

  return ok(
    {
      books: {
        total: totalBooks,
        available: availableBooks,
        borrowed: borrowedBooks,
        lost: Number(stats.lostBooks),
      },
      members: {
        total: Number(stats.totalMembers),
      },
      loans: {
        total: Number(stats.totalLoans),
        active: borrowedBooks,
        overdue: Number(stats.overdueLoans),
        perMember: borrowedBooks,
      },
      returns: {
        total: Number(stats.totalReturns),
        late: Number(stats.lostBooks),
        lost: Number(stats.lostBooks),
      },
      reservations: {
        total: Number(stats.totalReservations),
        active: Number(stats.activeReservations),
      },
    },
    { message: 'Dashboard overview retrieved successfully' }
  );
});
