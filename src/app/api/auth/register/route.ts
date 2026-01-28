import { ok } from '@/lib/apiResponse';
import { hashPassword } from '@/lib/auth';
import { crudHelper } from '@/lib/db/crudHelper';
import { handleApi } from '@/lib/handleApi';
import { Conflict } from '@/lib/httpErrors';
import { NextRequest } from 'next/server';

const userCrud = crudHelper({
  table: 'users',
  key: 'id_user',
  alias: 'u',
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const result = await userCrud.transaction(async ({ current, createRepo }) => {
    const memberRepo = createRepo({
      table: 'members',
      key: 'id_member',
      alias: 'm',
    });

    const userExist = await current.exists({ email: data.email });
    if (userExist) {
      throw new Conflict('Email already registered');
    }

    const hashPw = await hashPassword(data.password);
    const newUser = await current.create({
      email: data.email,
      password: hashPw,
      role: 'member',
    });

    await memberRepo.create({
      user_id: newUser.id_user,
      name: data.name,
      class: data.class,
      major: data.major,
      phone: data.phone,
    });

    return current.getById(newUser.id_user, {
      select: `
          u.id_user,
          u.email,
          u.role,
          u.status,
          m.id_member,
          m.name,
          m.class,
          m.major,
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
    message: 'User registered successfully',
  });
});
