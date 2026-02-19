import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors';
import { verifyPassword, createToken } from '@/lib/utils/auth';
import { validateLogin } from '@/lib/models/auth';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, or, and, isNull } from 'drizzle-orm';

export const POST = handleApi(async ({ req, res }) => {
  const data = await req.json();
  const { password, identifier } = validateLogin(data);

  const user = await db.query.users.findFirst({
    where: and(
      isNull(users.deletedAt), // ⬅️ support soft delete
      or(eq(users.email, identifier), eq(users.username, identifier))
    ),
  });

  if (!user) {
    throw new NotFound('User not found');
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new UnprocessableEntity('Invalid credentials');
  }

  const token = createToken({
    sub: user.id,
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
      id: user.id,
      email: user.email,
      role: user.role,
      token,
    },
    { message: 'Login successful' }
  );
});
