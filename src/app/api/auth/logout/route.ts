import { ok } from '@/lib/apiResponse';
import { handleApi } from '@/lib/handleApi';

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
