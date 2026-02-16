import { NextRequest } from 'next/server';
import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { NotFound } from '@/lib/httpErrors';
import { crudHelper } from '@/lib/db/crudHelper';
import { BadRequest } from '@/lib/httpErrors';

const bookCrud = crudHelper({
  table: 'books',
  key: 'id_book',
});

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(parseInt(id))) {
    throw new NotFound('Invalid book ID');
  }

  const book = await bookCrud.getById(id);

  if (!book) {
    throw new NotFound('Book not found');
  }

  return ok(book, { message: 'Book retrieved successfully' });
});

export const PATCH = handleApi(async ({ req, params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid book ID');
  }

  const data = await req.json();

  const exist = await bookCrud.existsById(id);
  if (!exist) {
    throw new NotFound('Book not found');
  }

  await bookCrud.updateById(id, {
    title: data.title,
    author: data.author,
    publisher: data.publisher,
    category_id: data.category_id,
    stock: data.stock,
  });

  const updated = await bookCrud.getById(id);

  return ok(updated, { message: 'Book updated successfully' });
});

export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid book ID');
  }

  const exist = await bookCrud.getById(id);
  if (!exist) {
    throw new NotFound('Book not found');
  }

  await bookCrud.destroyById(id);

  return ok(null, { message: 'Book deleted successfully' });
});
