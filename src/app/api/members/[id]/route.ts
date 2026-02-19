import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  if (!id || Number.isNaN(id)) {
    throw new NotFound('Invalid member ID');
  }

  const member = await db.query.members.findFirst({
    where: eq(members.id, id),
  });

  if (!member) {
    throw new NotFound('Member not found');
  }

  return ok(member, { message: 'Member retrieved successfully' });
});
