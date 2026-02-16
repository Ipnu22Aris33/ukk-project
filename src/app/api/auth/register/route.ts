import { ok } from '@/lib/apiResponse';
import { hashPassword } from '@/lib/auth';
import { handleApi } from '@/lib/handleApi';
import { Conflict, BadRequest } from '@/lib/httpErrors';
import { PgRepo } from '@/lib/pgRepo';

const userRepo = new PgRepo({
  table: 'users',
  key: 'id_user',
  alias: 'u',
  hasCreatedAt: true,
  hasUpdatedAt: true,
  hasDeletedAt: true,
  softDelete: true,
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { username, email, password, nis, full_name, class: className, address, phone } = data;

  if (!username || !email || !password || !nis || !full_name) {
    throw new BadRequest('Required fields are missing');
  }

  const result = await userRepo.transaction(async ({ current, createRepo }) => {
    const memberRepo = createRepo({
      table: 'members',
      key: 'id_member',
      alias: 'm',
      hasDeletedAt: true,
      softDelete: true,
    });

    // 🔎 Cek username
    if (await current.exists({ username })) {
      throw new Conflict('Username already registered');
    }

    // 🔎 Cek email
    if (await current.exists({ email })) {
      throw new Conflict('Email already registered');
    }

    const hashPw = await hashPassword(password);

    const newUser = await current.create({
      username, // ← WAJIB
      email,
      password: hashPw,
      role: 'member',
      status: 'active',
    });

    await memberRepo.create({
      user_id: newUser.id_user,
      nis,
      full_name,
      class: className,
      address,
      phone,
    });

    return current.getById(newUser.id_user, {
      select: `
        u.id_user,
        u.username,
        u.email,
        u.role,
        u.status,
        m.id_member,
        m.nis,
        m.full_name,
        m.class,
        m.phone
      `,
      joins: [
        {
          table: 'members m',
          on: 'u.id_user = m.user_id',
          type: 'LEFT',
        },
      ],
    });
  });

  return ok(result, {
    message: 'Member registered successfully',
  });
});
