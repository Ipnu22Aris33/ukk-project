import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { BadRequest, NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { returnRepo, loanRepo, bookRepo, withTransaction, mapDb, col } from '@/lib/db';
import { createReturnSchema, validateCreateReturn } from '@/lib/models/return';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { loan_id, notes } = validateCreateReturn(data);

  const result = await withTransaction(async () => {
    const loan = await loanRepo.findByPk(loan_id);

    if (!loan) {
      throw new NotFound('Data peminjaman tidak ditemukan');
    }

    if (loan.return_at) {
      throw new UnprocessableEntity('Buku sudah dikembalikan');
    }

    const now = new Date();
    const dueDate = new Date(loan.due_date);

    const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const fineAmount = lateDays * 1000;
    const fineStatus = fineAmount > 0 ? 'unpaid' : 'paid';

    const inserted = await returnRepo.insertOne({
      loan_id: loan.id_loan,
      returned_at: now,
      fine_amount: fineAmount,
      status: fineStatus,
      notes: notes ?? null,
    });

    await loanRepo.updateByPk(loan.id_loan, { status: 'returned' });

    await bookRepo.increment({ column: col('books', 'id'), value: loan.book_id }, col('books', 'stock'), loan.quantity);

    return returnRepo.findByPk(inserted.id_return);
  });

  return ok(result, { message: 'Book returned successfully' });
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await returnRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: [col('returns', 'id'), col('returns', 'status'), col('members', 'fullName'), col('users', 'email'), col('books', 'title')],
    select: [
      col('returns', 'id'),
      col('returns', 'loanId'),
      col('returns', 'returnedAt'),
      col('returns', 'fineAmount'),
      col('returns', 'status'),

      col('loans', 'id'),
      col('loans', 'loanDate'),
      col('loans', 'dueDate'),
      `${col('loans', 'status')} AS loan_status`,

      col('members', 'id'),
      `${col('members', 'fullName')} AS member_name`,
      `${col('members', 'phone')} AS member_phone`,
      `${col('members', 'memberClass')} AS member_class`,
      `${col('members', 'major')} AS member_major`,

      col('books', 'id'),
      `${col('books', 'title')} AS book_title`,
      `${col('books', 'author')} AS book_author`,
      `${col('books', 'publisher')} AS book_publisher`,
      `${col('books', 'categoryId')} AS book_category`,
    ],
    joins: [
      {
        type: 'INNER',
        table: 'loans',
        alias: 'l',
        on: { left: col('loans', 'id'), right: col('returns', 'loanId') },
      },
      {
        type: 'LEFT',
        table: 'members',
        alias: 'm',
        on: { left: col('members', 'id'), right: col('loans', 'memberId') },
      },
      {
        type: 'LEFT',
        table: 'books',
        alias: 'b',
        on: { left: col('books', 'id'), right: col('loans', 'bookId') },
      },
    ],
  });

  return ok(data, { message: 'Returns retrieved successfully', meta });
});
