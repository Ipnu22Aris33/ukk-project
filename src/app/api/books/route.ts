import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';
import { bookResponseSchema } from '@/lib/schema/book';
import { createBookSchema } from '@/lib/schema/book';
import { slugify } from '@/lib/utils/slugify';
import { validateSchema } from '@/lib/utils/validate';
import { isNull, inArray, SQL } from 'drizzle-orm';
import { safeParseResponse } from '@/lib/utils/validate';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);

  const { page, limit, search, orderBy, orderDir, filters } = parseQuery(url, {
    filters: {
      category: 'number',
      author: 'string',
    },
  });

  const where: SQL[] = [isNull(books.deletedAt)];

  if (filters.category?.length) {
    where.push(inArray(books.categoryId, filters.category));
  }

  if (filters.author?.length) {
    where.push(inArray(books.author, filters.author));
  }

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
    where,
    with: {
      category: true,
    },
  });

  return ok(safeParseResponse(bookResponseSchema, result.data).data, {
    message: 'Books retrieved successfully',
    meta: {
      ...result.meta,

      ...(filters.category?.length && { category: filters.category }),
      ...(filters.author?.length && { author: filters.author }),
    },
    timestamp: true,
  });
});
export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  const data = validateSchema(createBookSchema, body);

  // Jika availableStock tidak dikirim, default-nya adalah totalStock

  const [newBook] = await db
    .insert(books)
    .values({
      ...data,
      slug: slugify(data.title),
      availableStock: data.totalStock,
      reservedStock: 0,
      loanedStock: 0,
    })
    .returning();

  return ok(safeParseResponse(bookResponseSchema, newBook).data);
});
