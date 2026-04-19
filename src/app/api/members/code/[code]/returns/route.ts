// app/api/members/code/[code]/returns/route.ts

import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { returns, loans, members } from '@/lib/db/schema';
import { eq, isNull, and, gte, lte, inArray, sql } from 'drizzle-orm';

export const GET = handleApi(async ({ req, params }) => {
  const code = String(params?.code);
  const url = new URL(req.url);

  const { page, limit, search, orderBy, orderDir, filters } = parseQuery(url, {
    filters: {
      condition: 'string',
      fromDate: 'string',
      toDate: 'string',
      fineStatus: 'string' // PAID / UNPAID
    },
  });

  // 🔥 1. Cari member
  const member = await db.query.members.findFirst({
    where: (m, { eq, isNull }) => and(eq(m.memberCode, code), isNull(m.deletedAt)),
  });

  if (!member) {
    throw new NotFound('Member tidak ditemukan');
  }

  // 🔥 2. Ambil semua loan milik member
  const memberLoans = await db.select({ id: loans.id }).from(loans).where(eq(loans.memberId, member.id));

  const loanIds = memberLoans.map((l) => l.id);

  // 🔥 3. Kondisi dasar
  const baseConditions = [isNull(returns.deletedAt)];
  
  if (loanIds.length) {
    baseConditions.push(inArray(returns.loanId, loanIds));
  } else {
    // Jika tidak ada loan, return empty result
    return ok([], {
      message: `Riwayat return member (${code}) berhasil diambil`,
      meta: {
        page: 1,
        limit: limit || 10,
        total: 0,
        totalPages: 0,
      },
    });
  }

  // 🔥 4. Filter condition (kondisi buku)
  if (filters.condition) {
    baseConditions.push(eq(returns.condition, filters.condition));
  }

  // 🔥 5. Filter date range
  if (filters.fromDate) {
    baseConditions.push(gte(returns.returnedAt, new Date(filters.fromDate)));
  }

  if (filters.toDate) {
    // Set ke end of day untuk toDate
    const toDateEnd = new Date(filters.toDate);
    toDateEnd.setHours(23, 59, 59, 999);
    baseConditions.push(lte(returns.returnedAt, toDateEnd));
  }

  // 🔥 6. Filter fineStatus (PAID / UNPAID)
  let finalWhere = and(...baseConditions);

  if (filters.fineStatus) {
    const fineStatus = filters.fineStatus;
    
    if (fineStatus === 'paid') {
      // Fine sudah dibayar: fineStatus = 'PAID' AND fineAmount > 0
      finalWhere = and(
        finalWhere,
        sql`${returns.fineStatus} = 'PAID'`,
        sql`${returns.fineAmount} > 0`
      );
    } else if (fineStatus === 'unpaid') {
      // Fine belum dibayar: fineStatus = 'UNPAID' OR (fineAmount > 0 AND fineStatus IS NULL)
      finalWhere = and(
        finalWhere,
        sql`(${returns.fineStatus} = 'unpaid' OR (${returns.fineAmount} > 0 AND ${returns.fineStatus} IS NULL))`
      );
    } else if (fineStatus === 'none') {
      // Tanpa denda: fineAmount = 0 atau NULL
      finalWhere = and(
        finalWhere,
        sql`(${returns.fineAmount} = 0 OR ${returns.fineAmount} IS NULL)`
      );
    }
  }

  // 🔥 7. Query paginate
  const result = await paginate({
    db,
    table: returns,
    query: db.query.returns,
    page,
    limit,
    search,
    searchable: [returns.condition, returns.id],
    sortable: {
      id: returns.id,
      returnedAt: returns.returnedAt,
      condition: returns.condition,
      fineAmount: returns.fineAmount,
      fineStatus: returns.fineStatus,
    },
    orderBy,
    orderDir,
    where: finalWhere,
    with: {
      loan: {
        with: {
          book: {
            with: {
              category: true,
            },
          },
          member: {
            with: {
              user: true,
            },
          },
        },
      },
    },
  });

  return ok(result.data, {
    message: `Riwayat return member (${code}) berhasil diambil`,
    meta: result.meta,
  });
});