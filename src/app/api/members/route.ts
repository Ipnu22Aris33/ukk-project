import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import { createMemberSchema } from '@/lib/schemas/member.schema';
import crypto from 'crypto';
import { userRepo, memberRepo } from '@/lib/db/dbRepo';
import { withTransaction } from '@/lib/db/withTransaction';
import { mapDb, col } from '@/lib/db/dbMappings';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const { data, meta } = await memberRepo.paginate({
    page,
    limit,
    search,
    orderBy,
    orderDir,
    where: { column: col('members', 'deletedAt'), isNull: true },
    sortable: [col('members', 'createdAt'), col('members', 'fullName'), col('members', 'userId')],
    searchable: [
      col('members', 'fullName'),
      col('members', 'memberCode'),
      col('members', 'memberClass'),
      col('users', 'username'),
      col('users', 'email'),
    ],
    select: [
      col('members', 'id'),
      col('members', 'userId'),
      col('members', 'nis'),
      col('members', 'memberCode'),
      col('members', 'fullName'),
      col('users', 'username'),
      col('users', 'email'),
      col('members', 'phone'),
      col('members', 'memberClass'),
      col('members', 'major'),
      col('members', 'address'),
      col('members', 'createdAt'),
      col('members', 'updatedAt'),
    ],
    joins: [{ type: 'INNER', table: 'users', alias: 'u', on: { left: col('users', 'id'), operator: '=', right: col('members', 'userId') } }],
  });
  return ok(data, { message: 'Members Succes fetch', meta });
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const parsedData = createMemberSchema.parse(data);

  const result = await withTransaction(async () => {
    // cek email
    if (await userRepo.exists({ column: col('users', 'email'), value: data.email })) {
      throw new Conflict('Email already registered');
    }

    // generate password & member code
    const password = crypto.randomBytes(6).toString('base64').slice(0, 10);
    const passwordHash = await hashPassword(password);
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // insert user
    const newUser = await userRepo.insertOne(
      mapDb('users', {
        username: parsedData.username,
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
        memberClass: parsedData.member_class,
        major: parsedData.major,
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
