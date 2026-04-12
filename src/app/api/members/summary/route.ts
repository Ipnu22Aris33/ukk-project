import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, Forbidden } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { members, loans, returns, reservations } from '@/lib/db/schema';
import { isNull, eq, and, sql } from 'drizzle-orm';

export const GET = handleApi(async ({ user }) => {
  // 1. Validasi Autentikasi & Role
  if (!user || user.role !== 'member') {
    throw new Forbidden('Hanya anggota yang dapat mengakses ringkasan ini');
  }

  // 2. Ambil data member berdasarkan userId dari session
  const memberData = await db.query.members.findFirst({
    where: and(eq(members.userId, user.id), isNull(members.deletedAt)),
  });

  if (!memberData) {
    throw new NotFound('Profil anggota tidak ditemukan');
  }

  const memberId = memberData.id;

  // 3. Eksekusi semua query secara paralel untuk performa maksimal
  const [loanStats, reservationStats, returnStats, fineStats] = await Promise.all([
    // Summary Pinjaman (LOANS)
    db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`count(*) filter (where ${loans.status} = 'borrowed')`,
        late: sql<number>`count(*) filter (where ${loans.status} = 'late')`,
        returned: sql<number>`count(*) filter (where ${loans.status} = 'returned')`,
        lost: sql<number>`count(*) filter (where ${loans.status} = 'lost')`,
      })
      .from(loans)
      .where(and(eq(loans.memberId, memberId), isNull(loans.deletedAt))),

    // Summary Reservasi
    db
      .select({
        total: sql<number>`count(*)`,
        pending: sql<number>`count(*) filter (where ${reservations.status} = 'pending')`,
        approved: sql<number>`count(*) filter (where ${reservations.status} = 'approved')`,
      })
      .from(reservations)
      .where(and(eq(reservations.memberId, memberId), isNull(reservations.deletedAt))),

    // Summary Pengembalian & Kondisi Buku
    db
      .select({
        total: sql<number>`count(*)`,
        goodCondition: sql<number>`count(*) filter (where ${returns.condition} = 'good')`,
        damagedCondition: sql<number>`count(*) filter (where ${returns.condition} = 'damaged')`,
        lostCondition: sql<number>`count(*) filter (where ${returns.condition} = 'lost')`,
      })
      .from(returns)
      .leftJoin(loans, eq(returns.loanId, loans.id))
      .where(and(eq(loans.memberId, memberId), isNull(returns.deletedAt))),

    // Summary Denda (FINES)
    db
      .select({
        totalUnpaidFine: sql<number>`sum(cast(${returns.fineAmount} as numeric)) filter (where ${returns.fineStatus} = 'unpaid')`,
        countUnpaidFine: sql<number>`count(*) filter (where ${returns.fineStatus} = 'unpaid')`,
      })
      .from(returns)
      .leftJoin(loans, eq(returns.loanId, loans.id))
      .where(eq(loans.memberId, memberId)),
  ]);

  // 4. Transformasi hasil agar clean
  const loans_result = loanStats[0];
  const res_result = reservationStats[0];
  const ret_result = returnStats[0];
  const fine_result = fineStats[0];

  return ok(
    {
      member: memberData,
      summary: {
        loans: {
          total: Number(loans_result.total) || 0,
          active: Number(loans_result.active) || 0,
          late: Number(loans_result.late) || 0,
          returned: Number(loans_result.returned) || 0,
          lost: Number(loans_result.lost) || 0,
        },
        reservations: {
          total: Number(res_result.total) || 0,
          pending: Number(res_result.pending) || 0,
          approved: Number(res_result.approved) || 0,
        },
        returns: {
          total: Number(ret_result.total) || 0,
          conditions: {
            good: Number(ret_result.goodCondition) || 0,
            damaged: Number(ret_result.damagedCondition) || 0,
            lost: Number(ret_result.lostCondition) || 0,
          },
        },
        fines: {
          unpaidAmount: Number(fine_result.totalUnpaidFine) || 0,
          unpaidCount: Number(fine_result.countUnpaidFine) || 0,
        },
      },
    },
    { message: 'Member overview fetched successfully' }
  );
});
