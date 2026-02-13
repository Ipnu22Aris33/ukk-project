import { handleApi } from '@/lib/handleApi';
import { NextRequest, NextResponse } from 'next/server';
import { ok } from '@/lib/apiResponse';
import { crudHelper } from '@/lib/db/crudHelper';
import { NotFound, UnprocessableEntity } from '@/lib/httpErrors';
import { verifyPassword, createToken } from '@/lib/auth';

const userCrud = crudHelper({
  table: 'users',
  key: 'id_user',
});

export const POST = handleApi(async ({ req, res }) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    throw new UnprocessableEntity('Email and password are required');
  }

  const user = await userCrud.getBy({ email });

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
