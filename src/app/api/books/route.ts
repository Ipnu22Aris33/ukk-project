// pages/api/books.ts
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { bookRepo } from '@/config/dbRepo';
import { parseQuery } from '@/lib/utils/parseQuery';
import { mapDb } from '@/config/dbMappings';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await bookRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: ['b.title', 'b.author', 'c.name'],
    sortable: ['b.created_at', 'b.title', 'c.name'],
    select: ['b.id_book', 'b.title', 'b.author', 'c.name as category'],
    joins: [
      {
        type: 'LEFT',
        table: 'categories',
        alias: 'c',
        on: 'c.id_category = b.category_id',
      },
    ],
  });

  return ok(data, { message: 'Books retrieved successfully', meta });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();

  // pakai mapDb supaya tidak perlu menulis kolom DB satu per satu
  const bookData = mapDb('books', {
    title: body.title,
    author: body.author,
    categoryId: body.category_id,
    publisher: body.publisher,
    stock: body.stock,
    year: body.year,
  });

  const newBook = await bookRepo.insertOne(bookData);

  return ok(newBook, { message: 'Book created successfully' });
});
