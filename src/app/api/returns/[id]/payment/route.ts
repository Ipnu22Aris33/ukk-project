import { db } from '@/lib/db';
import { returns } from '@/lib/db/schema';
import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { eq } from 'drizzle-orm';

export const POST = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  await db.update(returns).set({ fineStatus: 'paid' }).where(eq(returns.id, id));

  return ok(null, { message: 'Pembayaran sudah selesai' });
});
