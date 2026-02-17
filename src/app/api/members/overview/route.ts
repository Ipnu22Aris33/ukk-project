import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { PgRepo } from '@/lib/pgRepo';

const userRepo = new PgRepo<any>({
  table: 'users',
  key: 'id_user',
  alias: 'u',
});

export const POST = handleApi(async () => {
  const result = await userRepo.create({ username: 'Billah1', email: 'bilah1@gmail.com', password: '123', role: 'member' });
  return ok(result);
});
