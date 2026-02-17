import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict, BadRequest } from '@/lib/utils/httpErrors';
import { userRepo, memberRepo } from '@/config/dbRepo';
import { withTransaction } from '@/lib/db/withTransaction';
import { mapDb } from '@/config/dbMappings';
import crypto from 'crypto';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { username, email, password, nis, full_name, member_class, address, phone, major } = data;

  if (!username || !email || !password || !nis || !full_name) {
    throw new BadRequest('Required fields are missing');
  }

  const result = await withTransaction(async () => {
    // cek duplikat
    if (await userRepo.exists({ username })) {
      throw new Conflict('Username already registered');
    }
    if (await userRepo.exists({ email })) {
      throw new Conflict('Email already registered');
    }
    if (await memberRepo.exists({ nis })) {
      throw new Conflict('NIS already registered');
    }

    // hash password
    const hashPw = await hashPassword(password);
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // insert user
    const newUser = await userRepo.insertOne(mapDb('users', { username, email, password: hashPw, role: 'member' }));

    // insert member
    await memberRepo.insertOne(
      mapDb('members', { userId: newUser.id_user, fullName: full_name, memberCode, memberClass: member_class, address, phone, major, nis })
    );

    // ambil data gabungan user + member
    return userRepo.findOne(
      { [`${userRepo['alias'] ?? userRepo['table']}.id_user`]: newUser.id_user },
      [
        `${userRepo['alias'] ?? userRepo['table']}.id_user`,
        `${userRepo['alias'] ?? userRepo['table']}.username`,
        `${userRepo['alias'] ?? userRepo['table']}.email`,
        `${userRepo['alias'] ?? userRepo['table']}.role`,
        'm.id_member',
        'm.nis',
        'm.full_name',
        'm.member_class',
        'm.phone',
      ],
      [
        {
          table: 'members',
          alias: 'm',
          on: `${userRepo['alias'] ?? userRepo['table']}.id_user = m.user_id`,
          type: 'LEFT',
        },
      ]
    );
  });

  return ok(result, { message: 'Member registered successfully' });
});
