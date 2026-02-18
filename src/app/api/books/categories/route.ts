import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { parseQuery } from '@/lib/utils/parseQuery';
import { slugify } from '@/lib/utils/slugify';
import { categoryRepo } from '@/lib/db/dbRepo';
import { col, mapDb } from '@/lib/db/dbMappings';
import { validateCreateCategory } from '@/lib/models/category';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await categoryRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    where: { column: col('categories', 'deletedAt'), isNull: true },
    searchable: [col('categories', 'name'), col('categories', 'slug')],
    sortable: [col('categories', 'id'), col('categories', 'name'), col('categories', 'createdAt')],
    select: [
      col('categories', 'id'),
      col('categories', 'name'),
      col('categories', 'slug'),
      col('categories', 'description'),
      col('categories', 'createdAt'),
      col('categories', 'updatedAt'),
    ],
  });

  return ok(data, { meta });
});

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  const { name, description } = validateCreateCategory(body);
  const result = await categoryRepo.insertOne(mapDb('categories', { name, description, slug: slugify(name) }));

  return ok(result, {
    message: 'Category created successfully',
  });
});
