import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { categoryRepo } from '@/config/dbRepo';

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new NotFound('Invalid category ID');
  }

  const category = await categoryRepo.findOne({ id_category: id, deleted_at: null });

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

  const exist = await categoryRepo.exists({ id_category: id });
  if (!exist) {
    throw new NotFound('Category not found');
  }

  const updated = await categoryRepo.updateById(id, {
    name: data.name,
    description: data.description,
  });

  return ok(updated, { message: 'Category updated successfully' });
});

export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const exist = await categoryRepo.findById(id);
  if (!exist) {
    throw new NotFound('Category not found');
  }

  await categoryRepo.deleteById(id);

  return ok(null, { message: 'Category deleted successfully' });
});
