import { handleApi } from '@/lib/handleApi';
import { ok } from '@/lib/apiResponse';
import { Unauthorized, NotFound } from '@/lib/httpErrors';
import { verifyToken } from '@/lib/auth';
import { crudHelper } from '@/lib/db/crudHelper';

const userCrud = crudHelper({
  table: 'users',
  key: 'id_user',
});

export const GET = handleApi(async ({ req }) => {
  const token = req.cookies.get('access_token')?.value;

  if (!token) throw new Unauthorized('Not authenticated');

  const payload = verifyToken(token);
  if (!payload) {
    throw new Unauthorized('Invalid token');
  }

  const user = await userCrud.getById(payload.sub);

  if (!user) {
    throw new NotFound('User not found');
  }

  return ok(
    {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    },
    { message: 'Session retrieved successfully' }
  );
});
