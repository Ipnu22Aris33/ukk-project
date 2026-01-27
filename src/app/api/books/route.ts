import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { queryWithPagination } from '@/lib/db';

export async function GET(req: Request) {
  return handleApi(async () => {
    const { data, meta } = await queryWithPagination({
      req,
      base: {
        table: 'books',
      },
      searchable: ['title', 'author'],
      orderBy: 'id_book DESC',
    });

    return ok(data, {
      message: 'Books retrieved successfully',
      meta,
    });
  });
}
