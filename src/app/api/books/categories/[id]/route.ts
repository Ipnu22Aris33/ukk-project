import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { crudHelper } from '@/lib/db/crudHelper';

const categoryCrud = crudHelper({
  table: 'categories',
  key: 'id_category',
});

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new NotFound('Invalid category ID');
  }

  const category = await categoryCrud.getById(id);

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

  const exist = await categoryCrud.existsById(id);
  if (!exist) {
    throw new NotFound('Category not found');
  }

  await categoryCrud.updateById(id, {
    name: data.name,
    description: data.description,
  });

  const updated = await categoryCrud.getById(id);

  return ok(updated, { message: 'Category updated successfully' });
});

export const DELETE = handleApi(async ({ params }) => {
  const id = params?.id;

  if (!id || isNaN(Number(id))) {
    throw new BadRequest('Invalid category ID');
  }

  const exist = await categoryCrud.getById(id);
  if (!exist) {
    throw new NotFound('Category not found');
  }

  await categoryCrud.destroyById(id);

  return ok(null, { message: 'Category deleted successfully' });
});
