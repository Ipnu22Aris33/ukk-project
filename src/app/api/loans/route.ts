import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { BadRequest, NotFound, UnprocessableEntity } from '@/lib/httpErrors';

const loanCrud = crudHelper({
  table: 'loans',
  key: 'id_loan',
  alias: 'l',
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  // Validasi input
  const { member_id, book_id, count } = data;
  if (!member_id || !book_id || !count) {
    throw new BadRequest('member_id, book_id, and count are required');
  }

  const result = await loanCrud.transaction(async ({ current, createRepo }) => {
    const bookRepo = createRepo({ table: 'books', key: 'id_book' });
    const memberRepo = createRepo({ table: 'members', key: 'id_member' });

    // Lock book untuk stock aman
    const book = (await bookRepo.lockById(book_id)) as any;
    if (!book) {
      throw new NotFound('Book not found');
    }

    if (book.stock < count) {
      throw new UnprocessableEntity('Not enough stock');
    }

    // Opsional: cek member exist
    const member = await memberRepo.getById(member_id);
    if (!member) {
      throw new NotFound('Member not found');
    }

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 7); // default 7 hari peminjaman

    // Buat loan baru
    const loanResult = await current.create({
      member_id,
      book_id,
      count,
      loan_date: now,
      due_date: dueDate,
      status: 'borrowed',
    });

    // Kurangi stock buku
    await bookRepo.updateById(book_id, { stock: book.stock - count });

    // Ambil data loan terbaru
    const newLoan = await current.getById(loanResult.insertId);

    return newLoan;
  });

  return ok(result, { message: 'Book borrowed successfully' });
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
        m.major     AS member_major

      `,

    joins: [
      { type: 'LEFT', table: 'books b', on: 'b.id_book = l.book_id' },
      { type: 'LEFT', table: 'members m', on: 'm.id_member = l.member_id' },
    ],

    searchable: ['b.title', 'm.name', 'm.email'],
    search: url.searchParams.get('q') ?? undefined,
  });

  return ok(page.data, {
    message: 'Loans retrieved successfully',
    meta: page.meta,
  });
});
