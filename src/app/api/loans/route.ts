import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { BadRequest, NotFound } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';
import { db } from '@/lib/db';
import { loans, books, members } from '@/lib/db/schema';
import { eq, and, isNull, sql, asc, desc, or } from 'drizzle-orm';

// =========================
// POST - Create Loan
// =========================
export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const { member_id, book_id, quantity, notes, loan_date, due_date } = data;

  if (!member_id || !book_id || !quantity) {
    throw new BadRequest('Required fields are missing');
  }

  const [book, member] = await Promise.all([
    db.query.books.findFirst({ where: eq(books.id, book_id) }),
    db.query.members.findFirst({ where: eq(members.id, member_id) }),
  ]);

  if (!book) throw new NotFound('Book not found');
  if (!member) throw new NotFound('Member not found');
  if (book.stock < quantity) throw new BadRequest('Book stock is insufficient');

  const now = new Date();
  const finalLoanDate = loan_date ? new Date(loan_date) : now;
  const finalDueDate = due_date ? new Date(due_date) : new Date(finalLoanDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  if (finalDueDate <= finalLoanDate) throw new BadRequest('Due date must be after loan date');

  const [insertedLoan] = await db.transaction(async (tx) => {
    const [loan] = await tx
      .insert(loans)
      .values({
        memberId: member_id,
        bookId: book_id,
        quantity,
        notes: notes ?? null,
        loanDate: finalLoanDate,
        dueDate: finalDueDate,
        status: 'borrowed',
      })
      .returning();

    await tx
      .update(books)
      .set({ stock: sql`${books.stock} - ${quantity}` })
      .where(eq(books.id, book_id));

    return [loan];
  });

  return ok(insertedLoan, { message: 'Loan created successfully' });
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
      book: true,
      member: true,
    },
  });

  return ok(result.data, {
    message: 'Loans retrieved successfully',
    meta: result.meta,
  });
});
