import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { BadRequest, NotFound, UnprocessableEntity } from '@/lib/httpErrors';
import { parseQuery } from '@/lib/query';
import { PgRepo } from '@/lib/pgRepo';
import { loanRepo } from '@/config/dbMappings';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { member_id, book_id, quantity, notes } = data;

  if (!member_id || !book_id || !quantity) {
    throw new BadRequest('member_id, book_id, and quantity are required');
  }

  const result = await loanRepo.transaction(async ({ loans: loanRepo, members: memberRepo, books: bookRepo }) => {
    const book = await bookRepo.existsById(book_id);
    if (!book) {
      throw new NotFound('Book not found');
    }

    const member = await memberRepo.existsById(member_id);
    if (!member) {
      throw new NotFound('Member not found');
    }

    const loan = await loanRepo.create({
      member_id,
      book_id,
      quantity,
      status: 'pending',
      notes,
    });

    return loan;
  });

  return ok(result, { message: 'Loan request submitted successfully' });
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await loanRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: ['b.title', 'm.full_name'],

    select: `
      l.id_loan,
      l.quantity,
      l.status,
      l.requested_at,
      l.approved_at,
      l.borrowed_at,
      l.due_date,
      l.notes,

      b.id_book   AS book_id,
      b.title     AS book_title,
      b.author    AS book_author,
      b.publisher AS book_publisher,
      b.category_id AS book_category,

      m.id_member AS member_id,
      m.full_name      AS member_name,
      m.phone     AS member_phone,
      m.class     AS member_class
    `,

    joins: [
      { type: 'INNER', table: 'books b', on: 'b.id_book = l.book_id' },
      { type: 'INNER', table: 'members m', on: 'm.id_member = l.member_id' },
    ],
  });

  return ok(data, {
    message: 'Loans retrieved successfully',
    meta,
  });
});
