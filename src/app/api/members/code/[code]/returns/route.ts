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
      fineStatus: 'string',
    },
  });

  // 🔥 1. Cari member
  const member = await db.query.members.findFirst({
    where: (m, { eq, isNull }) =>
      and(eq(m.memberCode, code), isNull(m.deletedAt)),
  });

  if (!member) {
    throw new NotFound('Member tidak ditemukan');
  }

  // 🔥 2. Ambil loan
  const loanIds = (
    await db
      .select({ id: loans.id })
      .from(loans)
      .where(eq(loans.memberId, member.id))
  ).map((l) => l.id);

  if (!loanIds.length) {
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

  // 🔥 3. Base conditions
  const baseConditions = [
    isNull(returns.deletedAt),
    inArray(returns.loanId, loanIds),

    filters.condition && eq(returns.condition, filters.condition),

    filters.fromDate &&
      gte(returns.returnedAt, new Date(filters.fromDate)),

    filters.toDate &&
      lte(
        returns.returnedAt,
        (() => {
          const d = new Date(filters.toDate);
          d.setHours(23, 59, 59, 999);
          return d;
        })()
      ),
  ].filter(Boolean);

  // 🔥 4. Normalize fineStatus (tanpa mutation)
  const normalizedFineStatus =
    typeof filters.fineStatus === 'string'
      ? filters.fineStatus.toLowerCase()
      : Array.isArray(filters.fineStatus)
      ? filters.fineStatus[0]?.toLowerCase()
      : undefined;

  // 🔥 5. Fine conditions (pure mapping)
  const fineConditionMap = {
    paid: and(
      sql`${returns.fineStatus} = 'paid'`,
      sql`${returns.fineAmount} > 0`
    ),
    unpaid: sql`(${returns.fineStatus} = 'unpaid' OR (${returns.fineAmount} > 0 AND ${returns.fineStatus} IS NULL))`,
    none: sql`(${returns.fineAmount} = 0 OR ${returns.fineAmount} IS NULL)`,
  } as const;

  const fineCondition =
    normalizedFineStatus && fineConditionMap[normalizedFineStatus];

  // 🔥 6. Final where (no let)
  const finalWhere = and(
    ...baseConditions,
    ...(fineCondition ? [fineCondition] : [])
  );

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