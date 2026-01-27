import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';

const bookCrud = crudHelper({
  table: 'books',
  key: 'id_book',
});

export async function GET(req: Request) {
  return handleApi(async () => {
    const page = await bookCrud.paginate({
      page: Number(new URL(req.url).searchParams.get('page') || 1),
      limit: Number(new URL(req.url).searchParams.get('limit') || 10),
      orderBy: 'id_book DESC',
      search: new URL(req.url).searchParams.get('q') || undefined,
      searchable: ['title', 'author'],
    });

    return ok(page.data, {
      message: 'Books retrieved successfully',
      meta: page.meta,
    });
  });
}

export async function POST(req: Request) {
  return handleApi(async () => {
    const body = await req.json();
    const result = await bookCrud.create({
      title: body.title,
      author: body.author,
      publisher: body.publisher,
      category: body.category,
      stock: body.stock,
    });

    const newBook = await bookCrud.getById(result.insertId);  

    return ok(newBook, {
      message: 'Book created successfully',
    });
  });
}
