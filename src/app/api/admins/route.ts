import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict, BadRequest } from '@/lib/utils/httpErrors';
import { userRepo, memberRepo, col } from '@/lib/db';
import { withTransaction } from '@/lib/db/withTransaction';
import { mapDb } from '@/lib/db';
import crypto from 'crypto';
import { validateRegister } from '@/lib/models/auth';
import { validateCreateUser } from '@/lib/models/user';

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();

  const { username, email, password } = validateCreateUser(data);

  if (
    await userRepo.exists({
      AND: [
        { column: col('users', 'username'), value: username },
        { column: col('users', 'email'), value: email },
      ],
    })
  ) {
    throw new Conflict('data already exist');
  }
  const hashPw = await hashPassword(password);

  const result = await userRepo.insertOne(
    mapDb('users', {
      email,
      username,
      password: hashPw,
      role: 'admin',
    })
  );

  return ok(result, { message: 'Member registered successfully' });
});
