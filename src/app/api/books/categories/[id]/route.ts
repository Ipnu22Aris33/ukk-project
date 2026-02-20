import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { updateCategorySchema } from '@/lib/schema/category';
import { slugify } from '@/lib/utils/slugify';

import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { validateSchema } from '@/lib/utils/validate';

// =========================
// GET - Detail Category
// =========================
export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new NotFound('Invalid category ID');
  }

  const category = await db.query.categories.findFirst({
    where: (c, { and }) => and(eq(c.id, Number(id)), isNull(c.deletedAt)),
  });

  if (!category) {
    throw new NotFound('Category not found');
  }

  return ok(category, { message: 'Category retrieved successfully' });
});

// =========================
// PATCH - Update Category
// =========================
export const PATCH = handleApi(async ({ req, params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const data = await req.json();
  const { name, description } = validateSchema(updateCategorySchema, data);

  const existing = await db.query.categories.findFirst({
    where: (c, { and }) => and(eq(c.id, Number(id)), isNull(c.deletedAt)),
    columns: { id: true },
  });

  if (!existing) {
    throw new NotFound('Category not found');
  }

  const [updated] = await db
    .update(categories)
    .set({
      name,
      description,
      slug: slugify(name),
      updatedAt: new Date(),
    })
    .where(eq(categories.id, Number(id)))
    .returning();

  return ok(updated, { message: 'Category updated successfully' });
});

// =========================
// DELETE - Soft Delete
// =========================
export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const existing = await db.query.categories.findFirst({
    where: (c, { and }) => and(eq(c.id, Number(id)), isNull(c.deletedAt)),
    columns: { id: true },
  });

  if (!existing) {
    throw new NotFound('Category not found');
  }

  await db
    .update(categories)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(categories.id, Number(id)));

  return ok(null, { message: 'Category deleted successfully' });
});
