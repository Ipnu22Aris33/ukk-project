import { ok } from '@/lib/utils/apiResponse';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict } from '@/lib/utils/httpErrors';
import { hashPassword } from '@/lib/utils/auth';
import { validateCreateUser } from '@/lib/models/user';
import { parseQuery } from '@/lib/utils/parseQuery';
import { paginate } from '@/lib/db/paginate';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';

import { eq, and, isNull, or } from 'drizzle-orm';

// =========================
// GET - List Users
// =========================
export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy = 'createdAt', orderDir = 'desc' } = parseQuery(url);

  const result = await paginate({
    db,
    table: users,
    page,
    limit,
    search,
    orderBy,
    orderDir,
    where: isNull(users.deletedAt),
    searchable: [users.username, users.email],
    select: {
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    },
  });

  return ok(result.data, { meta: result.meta });
});

// =========================
// POST - Create User
// =========================
export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  const { username, email, password } = validateCreateUser(body);

  // cek apakah username atau email sudah ada
  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(and(isNull(users.deletedAt), or(eq(users.username, username), eq(users.email, email))))
    .limit(1);

  if (existing.length > 0) {
    throw new Conflict('User already exists');
  }

  const hashPw = await hashPassword(password);

  const [inserted] = await db
    .insert(users)
    .values({
      username,
      email,
      password: hashPw,
      role: 'admin',
    })
    .returning({
      id: users.id,
      username: users.username,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
    });

  return ok(inserted, {
    message: 'User registered successfully',
  });
});
