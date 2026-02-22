import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { parseQuery } from '@/lib/utils/parseQuery';
import { slugify } from '@/lib/utils/slugify';
import { categoryResponseSchema, createCategorySchema } from '@/lib/schema/category';

import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { paginate } from '@/lib/db/paginate';

import { isNull } from 'drizzle-orm';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

/* =====================================================
   GET (Paginated)
===================================================== */

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir } = parseQuery(url);

  const result = await paginate({
    db,
    table: categories,
    query: db.query.categories,

    page,
    limit,
    search,

    searchable: [categories.name, categories.slug],

    sortable: {
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
    },

    orderBy,
    orderDir,

    where: isNull(categories.deletedAt),
  });

  return ok(safeParseResponse(categoryResponseSchema, result.data).data, {
    meta: result.meta,
  });
});

/* =====================================================
   POST (Create)
===================================================== */

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();

  const { name, description } = validateSchema(createCategorySchema, body);

  const [newCategory] = await db
    .insert(categories)
    .values({
      name,
      slug: slugify(name),
      description,
    })
    .returning();

  return ok(safeParseResponse(categoryResponseSchema, newCategory).data, {
    message: 'Category created successfully',
  });
});
