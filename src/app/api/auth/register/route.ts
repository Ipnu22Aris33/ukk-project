import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict, BadRequest } from '@/lib/utils/httpErrors';
import { userRepo, memberRepo, col } from '@/lib/db';
import { withTransaction } from '@/lib/db/withTransaction';
import { mapDb } from '@/lib/db';
import crypto from 'crypto';
import { validateRegister } from '@/lib/models/auth';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { username, email, password, nis, full_name, member_class, address, phone, major } = validateRegister(data);

  if (!username || !email || !password || !nis || !full_name) {
    throw new BadRequest('Required fields are missing');
  }

  const result = await withTransaction(async () => {
    // cek duplikat
    if (
      await userRepo.exists({
        AND: [
          { column: col('users', 'username'), value: username },
          { column: col('users', 'email'), value: email },
        ],
      })
    ) {
      throw new Conflict('Username already registered');
    }
    if (await memberRepo.exists({ column: col('members', 'nis'), value: nis })) {
      throw new Conflict('Nis already exist');
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

    return userRepo.findOne(
      { column: col('users', 'id'), value: newUser.id_user },
      {
        select: [
          col('users', 'id'),
          col('users', 'username'),
          col('users', 'email'),
          col('users', 'role'),
          col('members', 'id'),
          col('members', 'nis'),
          col('members', 'fullName'),
          col('members', 'memberClass'),
          col('members', 'phone'),
        ],
        joins: [
          {
            table: 'members',
            alias: 'm',
            type: 'LEFT',
            on: {
              left: col('users', 'id'),
              right: col('members', 'userId'),
              operator: '=',
            },
          },
        ],
      }
    );
  });

  return ok(result, { message: 'Member registered successfully' });
});
