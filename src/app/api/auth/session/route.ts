import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { Unauthorized, NotFound } from '@/lib/utils/httpErrors';
import { verifyToken } from '@/lib/utils/auth';
import { userRepo, col } from '@/lib/db';
import { JoinOption } from '@/lib/db/types';

export const GET = handleApi(async ({ req }) => {
  const token = req.cookies.get('access_token')?.value;
  if (!token) throw new Unauthorized('Not authenticated');

  const payload = verifyToken(token);
  if (!payload) throw new Unauthorized('Invalid token');

  const joins: JoinOption[] =
    payload.role === 'member'
      ? [
          {
            table: 'members',
            alias: 'm', // harus sama dengan dbMappings members alias
            type: 'LEFT',
            on: {
              left: col('users', 'id'), // u.id_user
              right: col('members', 'userId'), // m.user_id
              operator: '=',
            },
          },
        ]
      : [];

  const select = [
    col('users', 'id'),
    col('users', 'email'),
    col('users', 'username'),
    col('users', 'role'),
    ...(payload.role === 'member'
      ? [col('members', 'fullName'), col('members', 'phone'), col('members', 'address'), col('members', 'nis'), col('members', 'memberClass')]
      : []),
  ];

  const user = await userRepo.findByPk(payload.sub, select, joins);

  if (!user) throw new NotFound('User not found');

  return ok(user, { message: 'Session retrieved successfully' });
});
