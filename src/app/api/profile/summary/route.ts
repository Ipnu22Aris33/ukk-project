import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { db } from '@/lib/db';
import { loans, returns, reservations, members } from '@/lib/db/schema'; // Tambahkan members
import { sql, eq } from 'drizzle-orm';
import { NotFound } from '@/lib/utils/httpErrors';

export const GET = handleApi(async ({ user }) => {
  const userId = user.id;
  const now = new Date().toISOString();

  // 1. CARI MEMBER ID TERLEBIH DAHULU
  const member = await db.query.members.findFirst({
    where: eq(members.userId, userId),
  });

  // Jika user ini ternyata tidak punya profil member (misal: admin murni)
  if (!member) {
    throw new NotFound('Data member tidak ditemukan untuk user ini');
  }

  const memberId = member.id; // Gunakan ini untuk filter query bawah

  // 2. JALANKAN STATISTIK DENGAN memberId
  const [userStats] = await db
    .select({
      totalLoans: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.memberId} = ${memberId} AND ${loans.deletedAt} IS NULL)`,
      
      activeLoans: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.memberId} = ${memberId} AND ${loans.status} = 'borrowed' AND ${loans.deletedAt} IS NULL)`,
      
      overdueLoans: sql<number>`(SELECT count(*) FROM ${loans} WHERE ${loans.memberId} = ${memberId} AND ${loans.status} = 'borrowed' AND ${loans.dueDate} < ${now} AND ${loans.deletedAt} IS NULL)`,

      totalReturns: sql<number>`(
        SELECT count(*) 
        FROM ${returns} 
        JOIN ${loans} ON ${returns.loanId} = ${loans.id} 
        WHERE ${loans.memberId} = ${memberId} 
        AND ${returns}.${returns.deletedAt} IS NULL 
        AND ${loans}.${loans.deletedAt} IS NULL
      )`,
      
      activeReservations: sql<number>`(SELECT count(*) FROM ${reservations} WHERE ${reservations.memberId} = ${memberId} AND ${reservations.status} = 'approved' AND ${reservations.deletedAt} IS NULL)`,
    })
    .from(sql`(SELECT 1) as dummy`);

  return ok(
    {
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        memberId: member.id, // Tambahan info kalau butuh di FE
        fullName: member.fullName 
      },
      summary: {
        loans: {
          total: Number(userStats.totalLoans || 0),
          active: Number(userStats.activeLoans || 0),
          overdue: Number(userStats.overdueLoans || 0),
        },
        returns: {
          total: Number(userStats.totalReturns || 0),
        },
        reservations: {
          active: Number(userStats.activeReservations || 0),
        },
      },
    },
    { message: 'User summary retrieved successfully' }
  );
});