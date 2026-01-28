import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';

const loanCrud = crudHelper({
  table: 'loans',
  key: 'id_loan',
  alias: 'l',
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);

  const page = await loanCrud.paginate({
    page: Number(url.searchParams.get('page') ?? 1),
    limit: Number(url.searchParams.get('limit') ?? 10),
    orderBy: 'l.id_loan DESC',

    select: `
        l.id_loan,
        l.count,
        l.loan_date,
        l.due_date,
        l.status,

        b.id_book   AS book_id,
        b.title     AS book_title,
        b.author    AS book_author,
        b.publisher AS book_publisher,
        b.category_id  AS book_category,

        m.id_member AS member_id,
        m.name      AS member_name,
        m.phone     AS member_phone,
        m.class     AS member_class,
        m.major     AS member_major,

        a.username  AS added_by
      `,

    joins: [
      { type: 'LEFT', table: 'books b', on: 'b.id_book = l.book_id' },
      { type: 'LEFT', table: 'members m', on: 'm.id_member = l.member_id' },
      { type: 'LEFT', table: 'admins a', on: 'a.id_admin = l.admin_id' },
    ],

    searchable: ['b.title', 'm.name', 'm.email', 'a.username'],
    search: url.searchParams.get('q') ?? undefined,
  });

  return ok(page.data, {
    message: 'Loans retrieved successfully',
    meta: page.meta,
  });
});
