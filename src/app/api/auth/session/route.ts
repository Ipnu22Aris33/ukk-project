import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';

export const GET = handleApi(async ({ req, user }) => {
  return ok(user, { message: 'Session retrieved successfully' });
});
