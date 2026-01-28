import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { NotFound, UnprocessableEntity } from '@/lib/httpErrors';
import { crudHelper } from '@/lib/db/crudHelper';

export interface ReturnModel {
  id_return: string;
  loan_id: string;
  return_date: Date;
  penalty_fee: number;
  status: string;
}

const returnCrud = crudHelper({
  table: 'returns',
  key: 'id_return',
  alias: 'r',
});

export const POST = handleApi(async ({ req }) => {
  const { loan_id } = await req.json();

  if (!loan_id) {
    throw new NotFound('loan_id is required');
  }

  const result = await returnCrud.transaction(async ({ current: returnRepo, createRepo }) => {
    const loanRepo = createRepo({
      table: 'loans',
      key: 'id_loan',
    });

    const bookRepo = createRepo({
      table: 'books',
      key: 'id_book',
    });

    const loans: any[] = await returnRepo.rawQuery(
      `
      SELECT 
        l.id_loan,
        l.book_id,
        l.count,
        l.due_date,
        l.return_date
      FROM loans l
      JOIN books b ON b.id_book = l.book_id
      WHERE l.id_loan = ?
      FOR UPDATE
      `,
      [loan_id]
    );

    if (!loans.length) {
      throw new NotFound('Data peminjaman tidak ditemukan');
    }

    const loan = loans[0];

    if (loan.return_date) {
      throw new UnprocessableEntity('Buku sudah dikembalikan');
    }

    const now = new Date();
    const dueDate = new Date(loan.due_date);

    const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const penaltyFee = lateDays * 1000;
    const status = penaltyFee > 0 ? 'unpaid' : 'paid';

    const inserted = await returnRepo.create({
      loan_id: loan.id_loan,
      return_date: now,
      penalty_fee: penaltyFee,
      status,
    });

    await loanRepo.updateById(loan.id_loan, {
      return_date: now,
      status: 'returned',
    });

    await bookRepo.rawQuery(`UPDATE books SET stock = stock + ? WHERE id_book = ?`, [loan.count, loan.book_id]);

    return returnRepo.getById(inserted.id_return) as Promise<ReturnModel>;
  });

  return ok(result, {
    message: 'Book returned successfully',
  });
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);

  const { data, meta } = await returnCrud.paginate({
    page: Number(url.searchParams.get('page') ?? 1),
    limit: Number(url.searchParams.get('limit') ?? 10),
    search: url.searchParams.get('q') ?? undefined,
    searchable: ['r.id_return', 'r.status', 'm.name', 'm.email', 'b.title'],
    orderBy: 'r.id_return DESC',
    select: `
      r.id_return,
      r.loan_id,
      r.return_date,
      r.penalty_fee,
      r.status AS return_status,

      l.id_loan,
      l.loan_date,
      l.due_date,
      l.status AS loan_status,

      m.id_member,
      m.name AS member_name,
      m.email AS member_email,
      m.phone AS member_phone,
      m.class AS member_class,
      m.major AS member_major,

      b.id_book,
      b.title AS book_title,
      b.author AS book_author,
      b.publisher AS book_publisher,
      b.category AS book_category,

      a.id_admin,
      a.username AS admin_name
    `,
    joins: [
      { type: 'INNER', table: 'loans l', on: 'l.id_loan = r.loan_id' },
      { type: 'LEFT', table: 'members m', on: 'm.id_member = l.member_id' },
      { type: 'LEFT', table: 'books b', on: 'b.id_book = l.book_id' },
      { type: 'LEFT', table: 'admins a', on: 'a.id_admin = l.admin_id' },
    ],
  });

  return ok(data, {
    message: 'Returns retrieved successfully',
    meta,
  });
});
