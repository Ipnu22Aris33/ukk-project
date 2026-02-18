// pages/api/books.ts
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { bookRepo } from '@/lib/db/dbRepo';
import { parseQuery } from '@/lib/utils/parseQuery';
import { mapDb, col, dbMappings } from '@/lib/db/dbMappings';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await bookRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: [col('books', 'title'), col('books', 'author'), col('categories', 'name')],
    sortable: [col('books', 'createdAt'), col('books', 'title'), col('categories', 'name')],
    select: [col('books', 'id'), col('books', 'title'), col('books', 'author'), `${col('categories', 'name')} AS category`],
    joins: [
      {
        type: 'LEFT',
        table: dbMappings.categories.repo.table,
        alias: dbMappings.categories.repo.alias,
        on: { left: col('categories', 'id'), operator: '=', right: col('books', 'categoryId') },
      },
    ],
  });

  return ok(data, { message: 'Books retrieved successfully', meta });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();

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
