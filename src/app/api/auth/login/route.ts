import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { verifyPassword, createToken } from '@/lib/utils/auth';
import { col, userRepo } from '@/lib/db';
import { validateLogin } from '@/lib/models/auth';

export const POST = handleApi(async ({ req, res }) => {
  const data = await req.json();
  const { password, identifier } = validateLogin(data);

  const user = await userRepo.findOne({
    OR: [
      { column: col('users', 'email'), value: identifier },
      { column: col('users', 'username'), value: identifier },
    ],
  });

  if (!user) {
    throw new NotFound('User not found');
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new UnprocessableEntity('Invalid credentials');
  }

  const token = createToken({
    sub: user.id_user,
    email: user.email,
    role: user.role,
  });

  res.cookies.set({
    name: 'access_token',
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return ok(
    {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
      token,
    },
    { message: 'Login successful' }
  );
});
