import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { loans, members } from '@/lib/db/schema';
import { eq, isNull, and, gte, lte } from 'drizzle-orm';

export const GET = handleApi(async ({ req, params }) => {
  const code = String(params?.code);

  const url = new URL(req.url);

  const { page, limit, search, orderBy, orderDir, filters } = parseQuery(url, {
    filters: {
      status: 'string',
      fromDate: 'string',
      toDate: 'string',
    },
  });

  // 🔥 ambil member
  const member = await db.query.members.findFirst({
    where: (m, { eq, isNull }) => and(eq(m.memberCode, code), isNull(m.deletedAt)),
  });

  if (!member) {
    throw new NotFound('Member tidak ditemukan');
  }

  // 🔥 kondisi dasar
  const conditions = [isNull(loans.deletedAt), eq(loans.memberId, member.id)];

  // 🔥 filter tambahan
  if (filters.status) {
    conditions.push(eq(loans.status, filters.status));
  }

  if (filters.fromDate) {
    conditions.push(gte(loans.loanDate, new Date(filters.fromDate)));
  }

  if (filters.toDate) {
    conditions.push(lte(loans.loanDate, new Date(filters.toDate)));
  }

  const result = await paginate({
    db,
    table: loans,
    query: db.query.loans,
    page,
    limit,
    search,
    searchable: [loans.bookId, loans.status, members.fullName, members.memberCode],
    sortable: {
      id: loans.id,
      loanDate: loans.loanDate,
      dueDate: loans.dueDate,
      status: loans.status,
    },
    orderBy,
    orderDir,
    where: and(...conditions),
    with: {
      member: { with: { user: true } },
      book: { with: { category: true } },
    },
  });

  return ok(result.data, {
    message: `Loans member (${code}) berhasil diambil`,
    meta: result.meta,
  });
});
