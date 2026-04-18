import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema'; // Sesuaikan path schema kamu
import { activateSchema } from '@/lib/schema/auth';
import { hashPassword } from '@/lib/utils/auth';
import { Conflict, NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors'; // Helper error kamu
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { validateSchema } from '@/lib/utils/validate';
import { eq, and } from 'drizzle-orm';
import { createToken } from '@/lib/utils/auth';

export const POST = handleApi(async ({ req, res }) => {
  const body = await req.json();

  const { nis, username, email, password } = validateSchema(activateSchema, body);

  const result = await db.transaction(async (tx) => {
    const existingMember = await tx.query.members.findFirst({
      where: eq(members.nis, nis),
    });

    if (!existingMember) {
      throw new NotFound('NIS tidak terdaftar di database perpustakaan.');
    }

    if (existingMember.isActive || existingMember.userId) {
      throw new Conflict('Akun dengan NIS ini sudah diaktivasi sebelumnya.');
    }

    const duplicateUser = await tx.query.users.findFirst({
      where: (users, { or, eq }) => or(eq(users.username, username), eq(users.email, email)),
    });

    if (duplicateUser) {
      throw new Conflict('Username atau Email sudah digunakan.');
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await tx
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: 'member',
      })
      .returning();

    const [updatedMember] = await tx
      .update(members)
      .set({
        userId: newUser.id,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(members.id, existingMember.id))
      .returning();

    const token = createToken({
      sub: newUser.id,
      role: newUser.role,
      email: newUser.email,
    });

    // 🔥 SET COOKIE DI SINI (INI KUNCI NYA)
    res.cookies.set({
      name: 'access_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      member: updatedMember,
    };
  });

  return ok(result, { message: 'Aktivasi akun berhasil! Selamat datang di perpustakaan.' });
});
