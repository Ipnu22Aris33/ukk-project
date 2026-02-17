import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';

export const POST = handleApi(async ({ res }) => {
  res.cookies.set({
    name: 'access_token',
    value: '',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });
  return ok({ message: 'Logout successful' });
});
