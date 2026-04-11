// app/api/members/[id]/route.ts
import { eq, and, isNull } from 'drizzle-orm';
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest, Conflict } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { memberResponseSchema, updateMemberSchema } from '@/lib/schema/member';

export const GET = handleApi(async ({ params }) => {
  const code = String(params?.code);

  const member = await db.query.members.findFirst({
    where: and(eq(members.memberCode, code), isNull(members.deletedAt)),
    with: {
      user: true,
    },
  });

  if (!member) {
    throw new NotFound('Member not found');
  }

  return ok(safeParseResponse(memberResponseSchema, member).data, { message: 'Member retrieved successfully' });
});

