import { ok } from '@/lib/utils/apiResponse';
import { hashPassword } from '@/lib/utils/auth';
import { handleApi } from '@/lib/utils/handleApi';
import { Conflict } from '@/lib/utils/httpErrors';
import { parseQuery } from '@/lib/utils/parseQuery';
import crypto from 'crypto';
import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema';
import { eq, isNull, ilike } from 'drizzle-orm';
import { paginate } from '@/lib/db/paginate';
import { createMemberSchema, validateCreateMember } from '@/lib/schema/member';
import { registerSchema } from '@/lib/schema/auth';
import { validateSchema } from '@/lib/utils/validate';

export const GET = handleApi(async ({ req }) => {
  const url = new URL(req.url);
  const { page, limit, search, orderBy, orderDir = 'desc' } = parseQuery(url);

  const result = await paginate({
    db,
    table: members,
    query: db.query.members,
    page,
    limit,
    search,
    searchable: [members.fullName, members.memberCode, members.memberClass, users.username, users.email],
    sortable: { createdAt: members.createdAt, fullName: members.fullName, userId: members.userId },
    orderBy,
    orderDir,
    where: isNull(members.deletedAt),
    with: {
      user: true, // otomatis join ke tabel users
    },
  });

  return ok(result.data, { message: 'Members fetched successfully', meta: result.meta });
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  const parsedData = validateSchema(registerSchema,data)

  const result = await db.transaction(async (tx) => {
    // cek email
    const existingUser = await tx.query.users.findFirst({ where: eq(users.email, parsedData.email) });
    if (existingUser) {
      throw new Conflict('Email already registered');
    }

    // generate password & member code
    const password = crypto.randomBytes(6).toString('base64').slice(0, 10);
    const passwordHash = await hashPassword(password);
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // insert user
    const [newUser] = await tx
      .insert(users)
      .values({
        username: parsedData.username,
        email: parsedData.email,
        password: passwordHash,
        role: 'member',
      })
      .returning({ id: users.id, username: users.username, email: users.email });

    // insert member
    const [newMember] = await tx
      .insert(members)
      .values({
        fullName: parsedData.full_name,
        memberCode,
        phone: parsedData.phone,
        memberClass: parsedData.member_class,
        major: parsedData.major,
        userId: newUser.id,
      })
      .returning({ id: members.id, fullName: members.fullName, memberCode: members.memberCode });

    return {
      full_name: newMember.fullName,
      member_code: newMember.memberCode,
      email: newUser.email,
      password,
    };
  });

  return ok(result, { message: 'Member registered successfully' });
});
