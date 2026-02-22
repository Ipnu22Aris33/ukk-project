import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { BadRequest, NotFound } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';
import { db } from '@/lib/db';
import { loans, books, members, reservations } from '@/lib/db/schema';
import { eq, and, isNull, sql, asc, desc, or } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { createLoanSchema, loanResponseSchema } from '@/lib/schema/loan';
import { ca } from 'date-fns/locale';

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

  const { memberId, bookId, quantity, notes, loanDate, dueDate } = validateSchema(createLoanSchema, transformedBody);

  const [book, member] = await Promise.all([
    db.query.books.findFirst({ where: eq(books.id, bookId) }),
    db.query.members.findFirst({ where: eq(members.id, memberId) }),
  ]);

  if (!book) throw new NotFound('Book not found');
  if (!member) throw new NotFound('Member not found');
  if (book.stock < quantity) throw new BadRequest('Book stock is insufficient');

  const now = new Date();
  const finalLoanDate = loanDate ? new Date(loanDate) : now;
  const finalDueDate = dueDate ? new Date(dueDate) : new Date(finalLoanDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  if (finalDueDate <= finalLoanDate) throw new BadRequest('Due date must be after loan date');

  const [insertedLoan] = await db.transaction(async (tx) => {
    const [loan] = await tx
      .insert(loans)
      .values({
        memberId,
        bookId,
        quantity,
        reservationId: null,
        notes: notes ?? null,
        loanDate: finalLoanDate,
        dueDate: finalDueDate,
        status: 'borrowed',
      })
      .returning();

    await tx
      .update(books)
      .set({ stock: sql`${books.stock} - ${quantity}` })
      .where(eq(books.id, bookId));

    return [loan];
  });

  return ok(safeParseResponse(loanResponseSchema, insertedLoan).data, { message: 'Loan created successfully' });
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

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
    where: isNull(loans.deletedAt),
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
