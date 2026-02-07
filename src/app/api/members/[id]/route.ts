import { crudHelper } from '@/lib/db/crudHelper';
import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { NotFound } from '@/lib/httpErrors';
const memeberRepo = crudHelper({
  table: 'members',
  key: 'id_member',
});

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(parseInt(id))) {
    throw new NotFound('Invalid book ID');
  }

  const book = await memeberRepo.getById(id);

  if (!book) {
    throw new NotFound('Book not found');
  }

  return ok(book, { message: 'Book retrieved successfully' });
});

// export const PATCH = handleApi(async ()=> {})
// export const DELETE = handleApi(async ()=> {})