import { NextRequest } from 'next/server';
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { BadRequest } from '@/lib/utils/httpErrors';
import { bookRepo, mapDb } from '@/lib/db';
import { validateUpdateBook } from '@/lib/models/book';

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(parseInt(id))) {
    throw new NotFound('Invalid book ID');
  }

  const book = await bookRepo.findByPk(id);

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
  const { title, author, category_id, publisher, stock, isbn, year } = validateUpdateBook(data);

  const exist = await bookRepo.existsByPk(id);
  if (!exist) {
    throw new NotFound('Book not found');
  }

  const updated = await bookRepo.updateByPk(
    id,
    mapDb('books', {
      title,
      author,
      categoryId: category_id,
      publisher,
      stock,
      isbn,
      year,
    })
  );

  return ok(updated, { message: 'Book updated successfully' });
});

export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid book ID');
  }

  const exist = await bookRepo.existsByPk(id);
  if (!exist) {
    throw new NotFound('Book not found');
  }

  await bookRepo.deleteByPk(id);

  return ok(null, { message: 'Book deleted successfully' });
});
