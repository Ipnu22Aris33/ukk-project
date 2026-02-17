import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { crudHelper } from '@/lib/db/crudHelper';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { createMemberSchema, createMemberType } from '@/lib/schemas/member.schema';
import crypto from 'crypto';
import { userRepo, memberRepo } from '@/config/dbRepo';
import { withTransaction } from '@/lib/db/withTransaction';
import { mapDb } from '@/config/dbMappings';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await memberRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    searchable: ['m.full_name', 'm.phone', 'm.class', 'u.email'],
    select: ['m.id_member', 'm.full_name', 'm.phone', 'm.class', 'm.user_id', 'u.email'],
    joins: [{ type: 'INNER', table: 'users u', on: 'u.id_user = m.user_id' }],
  });
  return ok(data, { message: 'Members Succes fetch', meta });
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const parsedData = createMemberSchema.parse(data);

  const result = await withTransaction(async () => {
    // cek email
    if (await userRepo.exists({ 'u.email': parsedData.email })) {
      throw new Conflict('Email already registered');
    }

    // generate password & member code
    const password = crypto.randomBytes(6).toString('base64').slice(0, 10);
    const passwordHash = await hashPassword(password);
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // insert user
    const newUser = await userRepo.insertOne(
      mapDb('users', {
        email: parsedData.email,
        password: passwordHash,
        role: 'member',
      })
    );

    // insert member
    const newMember = await memberRepo.insertOne(
      mapDb('members', {
        fullName: parsedData.full_name,
        memberCode,
        phone: parsedData.phone,
        class: parsedData.class,
        // major: parsedData.major,
        status: 'active',
        userId: newUser.id_user,
      })
    );

    return {
      full_name: newMember.full_name,
      member_code: memberCode,
      email: parsedData.email,
      password,
    };
  });

  return ok(result, { message: 'Member registered successfully' });
});
