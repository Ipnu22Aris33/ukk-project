import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { Unauthorized, NotFound } from '@/lib/utils/httpErrors';
import { verifyToken } from '@/lib/utils/auth';
import { userRepo, col } from '@/lib/db';

export const GET = handleApi(async ({ req }) => {
  const token = req.cookies.get('access_token')?.value;
  if (!token) throw new Unauthorized('Not authenticated');

  const payload = verifyToken(token);
  if (!payload) throw new Unauthorized('Invalid token');

  const user = await userRepo.findByPk(payload.sub, {
    select: [
      col('users', 'id'),
      col('users', 'email'),
      col('users', 'username'),
      col('users', 'role'),
      col('members', 'id'),
      col('members', 'fullName'),
      col('members', 'phone'),
      col('members', 'address'),
      col('members', 'nis'),
      col('members', 'memberClass'),
    ],
    joins: [
      {
        table: 'members',
        alias: 'm',
        type: 'LEFT',
        on: {
          left: col('users', 'id'),
          right: col('members', 'userId'),
          operator: '='
        },
      },
    ],
  });

  if (!user) throw new NotFound('User not found');

  return ok(user, { message: 'Session retrieved successfully' });
});
