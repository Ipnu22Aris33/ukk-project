import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { Unauthorized, NotFound } from '@/lib/utils/httpErrors';
import { verifyToken } from '@/lib/utils/auth';
import { crudHelper } from '@/lib/db/crudHelper';

const userCrud = crudHelper({
  table: 'users',
  key: 'id_user',
  alias: 'u',
});

export const GET = handleApi(async ({ req }) => {
  const token = req.cookies.get('access_token')?.value;

  if (!token) throw new Unauthorized('Not authenticated');

  const payload = verifyToken(token);
  if (!payload) {
    throw new Unauthorized('Invalid token');
  }

  const user = await userCrud.getById(payload.sub, {
    select: `
    u.id_user,
    u.email,
    u.role,
    m.id_member,
    m.member_code,
    m.name,
    m.phone,
    m.status
  `,
    joins: [
      {
        table: 'members m',
        type: 'LEFT',
        on: "m.user_id = u.id_user AND u.role = 'member'",
      },
    ],
  });

  if (!user) {
    throw new NotFound('User not found');
  }

  return ok(user, { message: 'Session retrieved successfully' });
});
