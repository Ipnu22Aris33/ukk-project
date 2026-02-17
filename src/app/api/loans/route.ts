import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { BadRequest, NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { loanRepo, bookRepo, memberRepo } from '@/config/dbRepo';
import { withTransaction } from '@/lib/db';
import { validateCreateLoan } from '@/lib/models/loan';
import { mapDb, col, dbMappings } from '@/config/dbMappings';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { member_id, book_id, quantity, notes, loan_date, due_date } = validateCreateLoan(data);

  const result = await withTransaction(async () => {
    const book = await bookRepo.findOne({ id_book: book_id });
    if (!book) {
      throw new NotFound('Book not found');
    }

    const member = await memberRepo.exists({ id_member: member_id });
    if (!member) {
      throw new NotFound('Member not found');
    }

    // 🔥 AUTO DATE LOGIC
    const now = new Date();

    const finalLoanDate = loan_date ? new Date(loan_date) : now;

    const finalDueDate = due_date ? new Date(due_date) : new Date(finalLoanDate.getTime() + 3 * 24 * 60 * 60 * 1000);

    // Optional: validasi due_date tidak boleh kurang dari loan_date
    if (finalDueDate <= finalLoanDate) {
      throw new BadRequest('Due date must be after loan date');
    }

    // Optional: cek stok cukup
    if (book.stock < quantity) {
      throw new BadRequest('Book stock is insufficient');
    }

    // Insert Loan
    const loan = await loanRepo.insertOne(
      mapDb('loans', {
        memberId: member_id,
        bookId: book_id,
        quantity,
        notes,
        loanDate: finalLoanDate.toISOString(),
        dueDate: finalDueDate.toISOString(),
        status: 'borrowed',
      })
    );

    // 🔥 Kurangi stok
    await bookRepo.updateOne({ id_book: book_id }, { stock: book.stock - quantity });

    return loan;
  });

  return ok(result, { message: 'Loan created successfully' });
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

    select: [
      col('loans', 'id'),
      col('loans', 'quantity'),
      col('loans', 'status'),
      col('loans', 'loanDate'),
      col('loans', 'dueDate'),
      col('loans', 'notes'),

      // ===== BOOKS =====
      `${col('books', 'id')} AS book_id`,
      `${col('books', 'title')} AS book_title`,
      `${col('books', 'author')} AS book_author`,
      `${col('books', 'publisher')} AS book_publisher`,
      `${col('books', 'categoryId')} AS book_category_id`,

      // ===== MEMBERS =====
      `${col('members', 'id')} AS member_id`,
      `${col('members', 'fullName')} AS member_name`,
      `${col('members', 'phone')} AS member_phone`,
      `${col('members', 'memberClass')} AS member_class`,
    ],

    joins: [
      {
        table: dbMappings.books.repo.table,
        alias: dbMappings.books.repo.alias,
        on: `${col('books', 'id')} = ${col('loans', 'bookId')}`,
        type: 'INNER',
      },
      {
        table: dbMappings.members.repo.table,
        alias: dbMappings.members.repo.alias,
        on: `${col('members', 'id')} = ${col('loans', 'memberId')}`,
        type: 'INNER',
      },
    ],
  });

  return ok(data, {
    message: 'Loans retrieved successfully',
    meta,
  });
});
