import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { BadRequest, NotFound } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';
import { db } from '@/lib/db';
import { loans, books, members, loanStatusEnum, reservations } from '@/lib/db/schema';
import { eq, and, isNull, sql, gte, lte } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { createLoanSchema, loanResponseSchema } from '@/lib/schema/loan';

type LoanStatus = (typeof loanStatusEnum.enumValues)[number];
// =========================
// POST - Create Loan
// =========================
export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const transformedBody = {
    ...data,
    loanDate: data.loanDate ? new Date(data.loanDate) : undefined,
    dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  };

  const { memberId, bookId, quantity, notes, loanDate, dueDate, reservationId } = 
    validateSchema(createLoanSchema, transformedBody);

  const result = await db.transaction(async (tx) => {
    // 1. Ambil data buku dengan PESSIMISTIC LOCK (for update)
    const [book] = await tx
      .select()
      .from(books)
      .where(and(eq(books.id, bookId), isNull(books.deletedAt)))
      .for('update');

    if (!book) throw new NotFound('Buku tidak ditemukan');

    // 2. Cek apakah ini peminjaman dari reservasi atau langsung
    const isFromReservation = !!reservationId;

    if (isFromReservation) {
      // Logic jika dari reservasi: Cek validitas reservasi
      const reservation = await tx.query.reservations.findFirst({
        where: and(eq(reservations.id, reservationId), eq(reservations.status, 'pending'))
      });
      if (!reservation) throw new BadRequest('Reservasi tidak valid atau sudah expired');
      
      // Update stok: reserved berkurang, loaned bertambah (available tetap)
      await tx.update(books)
        .set({
          reservedStock: sql`${books.reservedStock} - ${quantity}`,
          loanedStock: sql`${books.loanedStock} + ${quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(books.id, bookId));
        
      // Update status reservasi jadi completed/loaned
      await tx.update(reservations)
        .set({ status: 'completed' })
        .where(eq(reservations.id, reservationId));

    } else {
      // Logic peminjaman langsung: Cek availableStock
      if (book.availableStock < quantity) throw new BadRequest('Stok buku di rak tidak mencukupi');

      // Update stok: available berkurang, loaned bertambah
      await tx.update(books)
        .set({
          availableStock: sql`${books.availableStock} - ${quantity}`,
          loanedStock: sql`${books.loanedStock} + ${quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(books.id, bookId));
    }

    // 3. Insert ke tabel loans
    const now = new Date();
    const finalLoanDate = loanDate ?? now;
    const finalDueDate = dueDate ?? new Date(finalLoanDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    const [insertedLoan] = await tx
      .insert(loans)
      .values({
        memberId,
        bookId,
        quantity,
        reservationId: reservationId ?? null,
        notes: notes ?? null,
        loanDate: finalLoanDate,
        dueDate: finalDueDate,
        status: 'borrowed',
      })
      .returning();

    return insertedLoan;
  });

  return ok(safeParseResponse(loanResponseSchema, result).data, { 
    message: 'Peminjaman berhasil dicatat' 
  });
});

export const GET = handleApi(async ({ req, user }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc', filters } = parseQuery(url, {filters: {
    status: 'string',
    fromDate: 'string',
    toDate: 'string',
    memberId: 'number',
    bookId: 'number',
  }});

  const conditions = [isNull(loans.deletedAt)];

  // Filter berdasarkan status jika ada - dengan casting ke tipe yang sesuai
  if (filters.status) {
    conditions.push(eq(loans.status, filters.status as LoanStatus));
  }

  // Filter berdasarkan tanggal
  if (filters.fromDate) conditions.push(gte(loans.loanDate, new Date(filters.fromDate)));
  if (filters.toDate) conditions.push(lte(loans.loanDate, new Date(filters.toDate)));

  // Filter berdasarkan memberId jika ada (untuk admin)
  if (filters.memberId && user?.role === 'admin') {
    conditions.push(eq(loans.memberId, filters.memberId));
  }

  // Filter berdasarkan bookId jika ada
  if (filters.bookId) {
    conditions.push(eq(loans.bookId, filters.bookId));
  }

  // Jika user adalah member, hanya tampilkan loans miliknya
  if (user?.role === 'member') {
    const member = await db.query.members.findFirst({
      where: and(eq(members.userId, user.id), isNull(members.deletedAt)),
    });
    
    if (!member) throw new NotFound('Data anggota tidak ditemukan');
    conditions.push(eq(loans.memberId, member.id));
  }

  const result = await paginate({
    db,
    table: loans,
    query: db.query.loans,
    page,
    limit,
    search,
    searchable: [books.title, members.fullName],
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
      book: { with: { category: true } },
      member: { with: { user: true } },
    },
  });

  return ok(safeParseResponse(loanResponseSchema, result.data).data, {
    message: 'Loans retrieved successfully',
    meta: result.meta,
  });
});