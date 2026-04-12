import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { members, loans, returns, reservations } from '@/lib/db/schema';
import { isNull, eq, and, sql } from 'drizzle-orm';

export const GET = handleApi(async ({ user }) => {
  // Check if the user is an admin
  if (!user?.role || user.role !== 'admin') {
    throw new NotFound('Access denied');
  }

  const member = await db.query.members.findFirst({
    where: eq(members.userId, user.id),
  });
  

  if (!member || Number.isNaN(member)) {
    throw new NotFound('Invalid member ID');
  }

  // =====================
  // 🔹 FETCH MEMBER
  // =====================

  if (!member) {
    throw new NotFound('Member not found');
  }

  // =====================
  // 🔹 LOANS SUMMARY
  // =====================
  const totalLoans = await db
    .select({ count: sql<number>`count(*)` })
    .from(loans)
    .where(and(eq(loans.memberId, member.id), isNull(loans.deletedAt)))
    .then((r) => Number(r[0].count));

  const activeLoans = await db
    .select({ count: sql<number>`count(*)` })
    .from(loans)
    .where(and(eq(loans.memberId, member.id), isNull(loans.deletedAt), eq(loans.status, 'borrowed')))
    .then((r) => Number(r[0].count));

  const returnedLoans = await db
    .select({ count: sql<number>`count(*)` })
    .from(loans)
    .where(and(eq(loans.memberId, member.id), isNull(loans.deletedAt), eq(loans.status, 'returned')))
    .then((r) => Number(r[0].count));

  const lateLoans = await db
    .select({ count: sql<number>`count(*)` })
    .from(loans)
    .where(and(eq(loans.memberId, member.id), isNull(loans.deletedAt), eq(loans.status, 'late')))
    .then((r) => Number(r[0].count));

  // =====================
  // 🔹 RETURNS (JOIN LOANS)
  // =====================
  const totalReturns = await db
    .select({ count: sql<number>`count(*)` })
    .from(returns)
    .leftJoin(loans, eq(returns.loanId, loans.id))
    .where(and(eq(loans.memberId, member.id), isNull(returns.deletedAt), isNull(loans.deletedAt)))
    .then((r) => Number(r[0].count));

  // =====================
  // 🔹 RESERVATIONS
  // =====================
  const totalReservations = await db
    .select({ count: sql<number>`count(*)` })
    .from(reservations)
    .where(and(eq(reservations.memberId, member.id), isNull(reservations.deletedAt)))
    .then((r) => Number(r[0].count));

  return ok(
    {
      member,
      loans: {
        total: totalLoans,
        active: activeLoans,
        returned: returnedLoans,
        late: lateLoans,
      },
      returns: {
        total: totalReturns,
      },
      reservations: {
        total: totalReservations,
      },
    },
    { message: 'Member overview fetched successfully' }
  );
});
