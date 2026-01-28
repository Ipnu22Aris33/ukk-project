import { NextRequest } from 'next/server';
import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { NotFound } from '@/lib/httpErrors';
import { crudHelper } from '@/lib/db/crudHelper';

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
