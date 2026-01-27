import { queryWithPagination, withTransaction } from '@/lib/db';
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
});

export async function POST(req: Request) {
  return handleApi(async () => {
    const { loan_id } = await req.json();

    if (!loan_id) {
      throw new NotFound('loan_id is required');
    }

    const result = await withTransaction(async (conn) => {
      const returnRepo = crudHelper({ table: 'returns', key: 'id_return' }, conn);
      const [rows]: any = await conn.query(
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

      if (rows.length === 0) {
        throw new NotFound('Data peminjaman tidak ditemukan');
      }

      const loan = rows[0];

      if (loan.return_date) {
        throw new UnprocessableEntity('Buku sudah dikembalikan');
      }

      const now = new Date();
      const dueDate = new Date(loan.due_date);

      const lateDays = now > dueDate ? Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      const penaltyFee = lateDays * 1000;
      const returnStatus = penaltyFee > 0 ? 'unpaid' : 'paid';

      const [insertRes]: any = await conn.execute(
        `INSERT INTO returns (loan_id, return_date, penalty_fee, status)
          VALUES (?, ?, ?, ?)`,
        [loan.id_loan, now, penaltyFee, returnStatus]
      );

      const returnId = insertRes.insertId;

      await conn.execute(`UPDATE loans SET return_date = ?, status = 'returned' WHERE id_loan = ?`, [now, loan.id_loan]);

      await conn.execute(`UPDATE books SET stock = stock + ? WHERE id_book = ?`, [loan.count, loan.book_id]);

      return (await returnRepo.getById(returnId)) as ReturnModel;
    });

    return ok(result, {
      message: 'Book returned successfully',
    });
  });
}

export async function GET(req: Request) {
  return handleApi(async () => {
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
        {
          type: 'INNER',
          table: 'loans l',
          on: 'l.id_loan = r.loan_id',
        },
        {
          type: 'LEFT',
          table: 'members m',
          on: 'm.id_member = l.member_id',
        },
        {
          type: 'LEFT',
          table: 'books b',
          on: 'b.id_book = l.book_id',
        },
        {
          type: 'LEFT',
          table: 'admins a',
          on: 'a.id_admin = l.admin_id',
        },
      ],
    });

    return ok(data, {
      message: 'Returns retrieved successfully',
      meta,
    });
  });
}
