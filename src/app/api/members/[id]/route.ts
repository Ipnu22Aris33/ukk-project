import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { memberRepo } from '@/lib/db';

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(parseInt(id))) {
    throw new NotFound('Invalid book ID');
  }

  const book = await memberRepo.findByPk(id);

  if (!book) {
    throw new NotFound('Book not found');
  }

  return ok(book, { message: 'Book retrieved successfully' });
});
