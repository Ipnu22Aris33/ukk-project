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
import { createMemberSchema, memberResponseSchema } from '@/lib/schema/member';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';

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

  return ok(safeParseResponse(memberResponseSchema, result.data).data, { message: 'Members fetched successfully', meta: result.meta });
});

export const POST = handleApi(async ({ req }) => {
  const data = await req.json();
  
  // 1. Validasi input (Sesuikan createMemberSchema agar tidak minta email/password)
  const { fullName, memberClass, phone, major, nis, address } = validateSchema(createMemberSchema, data);

  const result = await db.transaction(async (tx) => {
    // 2. Cek apakah NIS sudah terdaftar di tabel members
    const existingMember = await tx.query.members.findFirst({ 
      where: eq(members.nis, nis) 
    });
    
    if (existingMember) {
      throw new Conflict('NIS sudah terdaftar sebagai member');
    }

    // 3. Generate Member Code
    const memberCode = 'MBR-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    // 4. Insert ke tabel members saja
    const [newMember] = await tx
      .insert(members)
      .values({
        fullName,
        memberCode,
        phone,
        memberClass,
        major,
        nis,
        address,
        isActive: false, // Default belum aktif
        // userId: null  <-- Otomatis null karena tidak kita isi
      })
      .returning();

    return {
      id_member: newMember.id,
      full_name: newMember.fullName,
      member_code: newMember.memberCode,
      nis: newMember.nis,
      status: 'Pending Activation'
    };
  });

  return ok(result, { message: 'Data member berhasil dibuat, silakan lakukan aktivasi.' });
});