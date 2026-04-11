import { db } from '@/lib/db';
import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';

export const GET = handleApi(async ({ params }) => {
  const code = String(params?.code);

  const member = await db.query.members.findFirst({
    where: (members, { eq }) => eq(members.memberCode, code),
  });

  if (!member) {
    return ok([], { message: 'Member not found' });
  }

  const result = await db.query.reservations.findMany({
    where: (reservations, { eq }) => eq(reservations.memberId, member.id),
    with: {
      book: true,
    },
  });

  return ok(result, { message: `Reservations for member code: ${code}` });
});
