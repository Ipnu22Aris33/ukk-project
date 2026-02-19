import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { validateCreateBook } from '@/lib/models/book';
import { slugify } from '@/lib/utils/slugify';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';

import { isNull } from 'drizzle-orm';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page = 1, limit = 10, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const result = await paginate({
    db,
    table: books,
    query: db.query.books,
    page,
    limit,
    search,
    searchable: [books.title, books.author],
    sortable: {
      createdAt: books.createdAt,
      title: books.title,
    },
    orderBy,
    orderDir,
    where: isNull(books.deletedAt),
    with: {
      category: true,
    },
  });

  return ok(result.data, {
    message: 'Books retrieved successfully',
    meta: result.meta,
  });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();

  const { title, author, publisher, category_id: categoryId, stock, year, isbn } = validateCreateBook(body);

  const [newBook] = await db
    .insert(books)
    .values({
      title,
      author,
      isbn,
      slug: slugify(title),
      categoryId,
      publisher,
      stock,
      year,
    })
    .returning();

  return ok(newBook, { message: 'Book created successfully' });
});
