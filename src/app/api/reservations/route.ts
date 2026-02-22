// app/api/reservations/route.ts
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, UnprocessableEntity, Unauthorized } from '@/lib/utils/httpErrors';
import { createReservationSchema, reservationResponseSchema } from '@/lib/schema/reservation';
import { paginate } from '@/lib/db/paginate';
import { parseQuery } from '@/lib/utils/parseQuery';
import { db } from '@/lib/db';
import { reservations, books, members } from '@/lib/db/schema';
import { eq, isNull, and, gte, lte } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { reservationStatusEnum } from '@/lib/db/schema';
type ReservationStatus = (typeof reservationStatusEnum.enumValues)[number];

export const GET = handleApi(async ({ req, user }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir, filters } = parseQuery(url);

  const conditions = [isNull(reservations.deletedAt)];

  if (filters.status) {
    conditions.push(eq(reservations.status, filters.status as ReservationStatus));
  }

  if (filters.fromDate) conditions.push(gte(reservations.reservedAt, new Date(filters.fromDate)));
  if (filters.toDate) conditions.push(lte(reservations.reservedAt, new Date(filters.toDate)));
  if (filters.memberId) conditions.push(eq(reservations.memberId, filters.memberId));
  if (filters.bookId) conditions.push(eq(reservations.bookId, filters.bookId));

  if (user?.role === 'member') {
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, user.id), isNull(members.deletedAt)),
    });
    if (member) conditions.push(eq(reservations.memberId, member.id));
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
      book: true,
    },
  });

  return ok(safeParseResponse(reservationResponseSchema, result.data).data, {
    message: 'Reservasi berhasil diambil',
    meta: result.meta,
  });
});

export const POST = handleApi(async ({ req, user }) => {
  if (!user) throw new Unauthorized('Silakan login terlebih dahulu');
  if (user.role !== 'member') throw new Unauthorized('Hanya member yang bisa reservasi');

  const data = await req.json();
  const { bookId, quantity = 1, notes } = validateSchema(createReservationSchema, data);

  const result = await db.transaction(async (tx) => {
    const book = await tx.query.books.findFirst({
      where: and(eq(books.id, bookId), isNull(books.deletedAt)),
    });
    if (!book) throw new NotFound('Buku tidak ditemukan');
    if (book.stock < quantity) throw new UnprocessableEntity('Stok buku tidak mencukupi');

    const member = await tx.query.members.findFirst({
      where: and(eq(members.userId, user.id), isNull(members.deletedAt)),
    });
    if (!member) throw new NotFound('Data anggota tidak ditemukan');

    const activeReservation = await tx.query.reservations.findFirst({
      where: and(
        eq(reservations.memberId, member.id),
        eq(reservations.bookId, bookId),
        eq(reservations.status, 'pending'),
        isNull(reservations.deletedAt)
      ),
    });
    if (activeReservation) {
      throw new UnprocessableEntity('Anda sudah memiliki reservasi aktif untuk buku ini');
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await tx.$count(reservations);
    const sequence = String(count + 1).padStart(4, '0');
    const reservationCode = `RES-${year}${month}${day}-${sequence}`;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const [insertedReservation] = await tx
      .insert(reservations)
      .values({
        reservationCode,
        memberId: member.id,
        bookId,
        status: 'pending',
        quantity,
        reservedAt: new Date(),
        expiresAt,
        notes: notes ?? null,
      })
      .returning();

    return insertedReservation;
  });

  return ok(safeParseResponse(reservationResponseSchema, result).data, { message: 'Reservasi berhasil dibuat' });
});
