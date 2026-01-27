import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { queryWithPagination } from '@/lib/db';

export async function GET(req: Request) {
  return handleApi(async () => {
    const { data, meta } = await queryWithPagination({
      req,
      base: {
        table: 'loans l',
        select: `
          l.id_loan,
          l.count,
          l.loan_date,
          l.due_date,
          l.return_date,
          l.status,
              
          b.id_book   AS book_id,
          b.title     AS book_title,
          b.author    AS book_author,
          b.publisher AS book_publisher,
          b.category  AS book_category,
              
          m.id_member AS member_id,
          m.name      AS member_name,
          m.email     AS member_email,
          m.phone     AS member_phone,
          m.class     AS member_class,
          m.major     AS member_major,

          a.username  AS added_by,
          a.email     AS added_by_email
        `,
      },
      joins: [
        {
          type: 'LEFT',
          table: 'books b',
          on: 'b.id_book = l.book_id',
        },
        {
          type: 'LEFT',
          table: 'members m',
          on: 'm.id_member = l.member_id',
        },
        {
          type: 'LEFT',
          table: 'admins a',
          on: 'a.id_admin = l.admin_id',
        },
      ],
      searchable: ['b.title', 'm.name', 'm.email', 'a.username'],
      orderBy: 'l.id_loan DESC',
    });

    return ok(data, {
      message: 'Loans retrieved successfully',
      meta,
    });
  });
}
