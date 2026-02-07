import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { handleApi } from '@/lib/handleApi';
import { parseQuery } from '@/lib/query';
import { slugify } from '@/lib/slugify';

const categoryRepo = crudHelper({ table: 'categories', key: 'id_category' });

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir } = parseQuery(url);
  const { data, meta } = await categoryRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
  });
  return ok(data, { meta });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  const result = await categoryRepo.create({
    name: body.name,
    slug: slugify(body.name),
    description: body.description,
  });

  const newCategory = await categoryRepo.getById(result.insertId);
  console.log(newCategory);

  return ok(newCategory, {
    message: 'Book created successfully',
  });
});
