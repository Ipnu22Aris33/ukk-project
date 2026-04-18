import { handleApi } from '@/lib/utils/handleApi';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { members } from '@/lib/db/schema';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest } from '@/lib/utils/httpErrors';
import { memberResponseSchema } from '@/lib/schema/member';

export const GET = handleApi(async ({ params }) => {
  const { nis } = params;

  if (!nis) {
    throw new BadRequest('NIS wajib diisi');
  }

  const member = await db.query.members.findFirst({
    where: eq(members.nis, nis),
  });

  if (!member) {
    throw new NotFound('NIS tidak ditemukan');
  }

  // kalau sudah aktif
  if (member.isActive) {
    return ok(member, { message: 'Akun sudah aktif' });
  }

  // kalau belum aktif (boleh lanjut aktivasi)
  return ok(member, { message: 'Member ditemukan, silakan aktivasi' });
});
