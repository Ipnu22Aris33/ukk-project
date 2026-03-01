import { eq, and, isNull } from 'drizzle-orm';
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { books } from '@/lib/db/schema';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { bookResponseSchema, updateBookSchema } from '@/lib/schema/book';

export const GET = handleApi(async ({ params }) => {
  const slug = params?.slug;

  if (!slug) {
    throw new NotFound('Invalid book slug   ');
  }

  const book = await db.query.books.findFirst({
    where: and(eq(books.slug, slug), isNull(books.deletedAt)),
    with: { category: true },
  });

  if (!book) {
    throw new NotFound('Book not found');
  }

  return ok(safeParseResponse(bookResponseSchema, book).data, { message: 'Book retrieved successfully' });
});
