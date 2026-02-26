import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { db } from '@/lib/db';

export const GET = handleApi(async ({ user }) => {
  if (!user) return ok(null, { message: 'No active session' });

  const member = user.role === 'member' ? await db.query.members.findFirst({ where: (m, { eq }) => eq(m.userId, user.id) }) : null;

  return ok(
    {
      ...user,
      ...(member && { member }),
    },
    { message: 'Session retrieved successfully' }
  );
});
