import { db } from '@/lib/db';
import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { members, loans, books } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET = handleApi(async ({ params }) => {
  const code = String(params?.code);

  const member = await db.query.members.findFirst({
    where: (members, { eq }) => eq(members.memberCode, code),
  });

  if (!member) {
    return ok([], { message: 'Member not found' });
  }

  const result = await db.query.loans.findMany({
    where: (loans, { eq }) => eq(loans.memberId, member.id),
    with: {
      book: true,
    },
  });

  return ok(result, { message: `Loans for member code: ${code}` });
});
