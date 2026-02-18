import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { categoryRepo } from '@/lib/db/dbRepo';
import { col, mapDb } from '@/lib/db/dbMappings';
import { validateUpdateCategory } from '@/lib/models/category';
import { slugify } from '@/lib/utils/slugify';

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new NotFound('Invalid category ID');
  }

  const category = await categoryRepo.findOne({
    AND: [
      { column: col('categories', 'id'), value: id },
      { column: col('categories', 'deletedAt'), isNull: true },
    ],
  });

  if (!category) {
    throw new NotFound('Category not found');
  }

  return ok(category, { message: 'Category retrieved successfully' });
});

export const PATCH = handleApi(async ({ req, params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const data = await req.json();
  const { name, description } = validateUpdateCategory(data);

  const exist = await categoryRepo.existsByPk(id);
  if (!exist) {
    throw new NotFound('Category not found');
  }

  const updated = await categoryRepo.updateByPk(
    id,
    mapDb('categories', {
      name,
      description,
      slug: slugify(name),
    })
  );

  return ok(updated, { message: 'Category updated successfully' });
});

export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const exist = await categoryRepo.existsByPk(id);
  if (!exist) {
    throw new NotFound('Category not found');
  }

  await categoryRepo.deleteByPk(id);

  return ok(null, { message: 'Category deleted successfully' });
});
