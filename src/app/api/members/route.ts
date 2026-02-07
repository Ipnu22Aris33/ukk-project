import { ok } from '@/lib/apiResponse';
import { hashPassword } from '@/lib/auth';
import { crudHelper } from '@/lib/db/crudHelper';
import { handleApi } from '@/lib/handleApi';
import { Conflict } from '@/lib/httpErrors';
import { parseQuery } from '@/lib/query';
import { createMemberSchema, createMemberType } from '@/lib/schemas/member.schema';
import crypto from 'crypto';

const memeberRepo = crudHelper({
  table: 'members',
  key: 'id_member',
  alias: 'm',
});

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await memeberRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: ['m.name', 'm.phone', 'm.class', 'u.email'],
    select: `
        m.id_member,
        m.name,
        m.phone,
        m.class,
        m.major,
        m.user_id,
        u.email
    `,
    joins: [{ type: 'INNER', table: 'users u', on: 'u.id_user = m.user_id' }],
  });
  return ok(data, { message: 'Members Succes fetch', meta });
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const parsedData = createMemberSchema.parse(data);

  const result = await memeberRepo.transaction(async ({ current, createRepo }) => {
    const user = createRepo({
      table: 'users',
      key: 'id_user',
      alias: 'u',
    });

    const userExist = await user.exists({ email: parsedData.email });
    if (userExist) {
      throw new Conflict('Email already registered');
    }

    const member_code = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const password = crypto.randomBytes(6).toString('base64').slice(0, 10);
    const password_hash = await hashPassword(password);

    const userCreated = (await user.create({
      email: parsedData.email,
      password: password_hash,
      role: 'member',
    })) as any;

    const memberCreated = await current.create({
      name: parsedData.name,
      member_code,
      phone: parsedData.phone,
      class: parsedData.class,
      major: parsedData.major,
      status: 'active',
      user_id: userCreated.id_user,
    });

    return {
      name: memberCreated.name,
      member_code,
      password,
      email: parsedData.email,
    };
  });

  return ok(result);
});
