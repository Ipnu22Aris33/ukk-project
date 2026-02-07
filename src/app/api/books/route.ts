import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { slugify } from '@/lib/slugify';
import { parseQuery } from '@/lib/query';

const bookCrud = crudHelper({
  table: 'books',
  key: 'id_book',
  alias: 'b',
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir= 'desc' } = parseQuery(url);

  const { data, meta } = await bookCrud.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    sortable: ['b.id_book', 'b.title', 'b.author', 'b.created_at', 'c.name'],
    searchable: ['b.title', 'b.author', 'b.slug'],
    select: `
      b.*,
      c.name as category
    `,
    joins: [
      {
        type: 'INNER',
        table: 'categories c',
        on: 'c.id_category = b.category_id',
      },
    ],
  });

  return ok(data, {
    message: 'Books retrieved successfully',
    meta,
  });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  const result = await bookCrud.create({
    title: body.title,
    author: body.author,
    slug: slugify(body.title),
    publisher: body.publisher,
    category_id: body.category_id,
    stock: body.stock,
    year: body.year,
    isbn: body.isbn,
  });

  const newBook = await bookCrud.getById(result.id_book);

  return ok(newBook, {
    message: 'Book created successfully',
  });
});
