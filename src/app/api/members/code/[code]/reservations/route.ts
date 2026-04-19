// app/api/members/[code]/reservations/route.ts

import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { reservations, members } from '@/lib/db/schema';
import { eq, isNull, and, gte, lte } from 'drizzle-orm';
import { reservationResponseSchema } from '@/lib/schema/reservation';
import { safeParseResponse } from '@/lib/utils/validate';
import { reservationStatusEnum } from '@/lib/db/schema';

type ReservationStatus = (typeof reservationStatusEnum.enumValues)[number];

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

  // 🔥 cari member dulu
  const member = await db.query.members.findFirst({
    where: (m, { eq, isNull }) => and(eq(m.memberCode, code), isNull(m.deletedAt)),
  });

  if (!member) {
    throw new NotFound('Member tidak ditemukan');
  }

  // 🔥 kondisi dasar
  const conditions = [
    isNull(reservations.deletedAt),
    eq(reservations.memberId, member.id), // ⬅️ ini pembeda utama
  ];

  // 🔥 filter tambahan (copy dari endpoint utama kamu)
  if (filters.status) {
    conditions.push(eq(reservations.status, filters.status as ReservationStatus));
  }

  if (filters.fromDate) {
    conditions.push(gte(reservations.reservedAt, new Date(filters.fromDate)));
  }

  if (filters.toDate) {
    conditions.push(lte(reservations.reservedAt, new Date(filters.toDate)));
  }

  const result = await paginate({
    db,
    table: reservations,
    query: db.query.reservations,
    page,
    limit,
    search,
    searchable: [reservations.reservationCode, reservations.status],
    sortable: {
      id: reservations.id,
      reservedAt: reservations.reservedAt,
      expiresAt: reservations.expiresAt,
      status: reservations.status,
    },
    orderBy,
    orderDir,
    where: and(...conditions),
    with: {
      member: { with: { user: true } },
      book: { with: { category: true } },
      pickedUpByUser: true,
    },
  });

  return ok(safeParseResponse(reservationResponseSchema, result.data).data, {
    message: `Reservasi member (${code}) berhasil diambil`,
    meta: result.meta,
  });
});
