// app/api/members/code/[code]/returns/route.ts

import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { returns, loans, members } from '@/lib/db/schema';
import { eq, isNull, and, gte, lte, inArray } from 'drizzle-orm';

export const GET = handleApi(async ({ req, params }) => {
  const code = String(params?.code);
  const url = new URL(req.url);

  const { page, limit, search, orderBy, orderDir, filters } = parseQuery(url, {
    filters: {
      condition: 'string',
      fromDate: 'string',
      toDate: 'string',
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

  // 🔥 3. Kondisi filter
  const conditions = [isNull(returns.deletedAt), loanIds.length ? inArray(returns.loanId, loanIds) : undefined];

  if (filters.condition) {
    conditions.push(eq(returns.condition, filters.condition));
  }

  if (filters.fromDate) {
    conditions.push(gte(returns.returnedAt, new Date(filters.fromDate)));
  }

  if (filters.toDate) {
    conditions.push(lte(returns.returnedAt, new Date(filters.toDate)));
  }

  // 🔥 4. Query paginate
  const result = await paginate({
    db,
    table: returns,
    query: db.query.returns,
    page,
    limit,
    search,
    searchable: [returns.condition],
    sortable: {
      id: returns.id,
      returnedAt: returns.returnedAt,
      condition: returns.condition,
    },
    orderBy,
    orderDir,
    where: and(...conditions.filter(Boolean)),
    with: {
      loan: {
        with: {
          book: { with: { category: true } },
          member: { with: { user: true } },
        },
      },
    },
  });

  return ok(result.data, {
    message: `Riwayat return member (${code}) berhasil diambil`,
    meta: result.meta,
  });
});
