import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { PgRepo } from '@/lib/pgRepo';
import { parseQuery } from '@/lib/utils/parseQuery';
import { slugify } from '@/lib/utils/slugify';

const categoryRepo = new PgRepo({
  table: 'categories',
  key: 'id_category',
  alias: 'c',
  hasCreatedAt: true,
  hasUpdatedAt: true,
  hasDeletedAt: true,
  softDelete: true, // penting kalau ada deleted_at
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await categoryRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: ['c.name', 'c.slug'],
    sortable: ['c.id_category', 'c.name', 'c.created_at'],
    select: `
      c.id_category,
      c.name,
      c.slug,
      c.description,
      c.created_at,
      c.updated_at
    `,
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

  return ok(result, {
    message: 'Category created successfully',
  });
});
