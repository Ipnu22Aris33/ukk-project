import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict, BadRequest } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { users, members } from '@/lib/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import crypto from 'crypto';
import { validateSchema } from '@/lib/utils/validate';
import { registerSchema } from '@/lib/schema/auth';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { username, email, password, nis, full_name, member_class, address, phone, major } = validateSchema(registerSchema,data);

  if (!username || !email || !password || !nis || !full_name) {
    throw new BadRequest('Required fields are missing');
  }

  const result = await db.transaction(async (tx) => {
    /* =========================
       CHECK DUPLICATE USER
    ========================= */

    const existingUser = await tx.query.users.findFirst({
      where: and(isNull(users.deletedAt), eq(users.username, username)),
    });

    if (existingUser) {
      throw new Conflict('Username already registered');
    }

    const existingEmail = await tx.query.users.findFirst({
      where: and(isNull(users.deletedAt), eq(users.email, email)),
    });

    if (existingEmail) {
      throw new Conflict('Email already registered');
    }

    const existingNis = await tx.query.members.findFirst({
      where: eq(members.nis, nis),
    });

    if (existingNis) {
      throw new Conflict('NIS already exists');
    }

    /* =========================
       CREATE USER
    ========================= */

    const hashPw = await hashPassword(password);
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const [newUser] = await tx
      .insert(users)
      .values({
        username,
        email,
        password: hashPw,
        role: 'member',
      })
      .returning();

    /* =========================
       CREATE MEMBER
    ========================= */

    await tx.insert(members).values({
      userId: newUser.id,
      fullName: full_name,
      memberCode,
      memberClass: member_class,
      address,
      phone,
      major,
      nis,
    });

    /* =========================
       RETURN JOINED DATA
    ========================= */

    const created = await tx.query.users.findFirst({
      where: eq(users.id, newUser.id),
      with: {
        member: true, // pastikan relasi sudah didefinisikan di schema
      },
    });

    return created;
  });

  return ok(result, {
    message: 'Member registered successfully',
  });
});
