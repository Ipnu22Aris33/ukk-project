import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { Unauthorized, NotFound } from '@/lib/utils/httpErrors';
import { verifyToken } from '@/lib/utils/auth';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';

export const GET = handleApi(async ({ req }) => {
  const token = req.cookies.get('access_token')?.value;
  if (!token) throw new Unauthorized('Not authenticated');

  const payload = verifyToken(token);
  if (!payload) throw new Unauthorized('Invalid token');

  const user = await db.query.users.findFirst({
    where: (u, { and }) =>
      and(
        eq(u.id, Number(payload.sub)),
        isNull(u.deletedAt)
      ),
    with: {
      member: true,
    },
    columns: {
      id: true,
      email: true,
      username: true,
      role: true,
    },
  });

  if (!user) throw new NotFound('User not found');

  return ok(user, { message: 'Session retrieved successfully' });
});
