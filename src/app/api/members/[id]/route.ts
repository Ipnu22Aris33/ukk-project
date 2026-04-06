// app/api/members/[id]/route.ts
import { eq, and, isNull } from 'drizzle-orm';
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound, BadRequest, Conflict } from '@/lib/utils/httpErrors';
import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema';
import { safeParseResponse, validateSchema } from '@/lib/utils/validate';
import { memberResponseSchema, updateMemberSchema } from '@/lib/schema/member';

/* ======================================================
   GET /api/members/[id]
====================================================== */
export const GET = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  if (!id || isNaN(id)) {
    throw new NotFound('Invalid member ID');
  }

  const member = await db.query.members.findFirst({
    where: and(eq(members.id, id), isNull(members.deletedAt)),
    with: {
      user: true,
    },
  });

  if (!member) {
    throw new NotFound('Member not found');
  }

  return ok(safeParseResponse(memberResponseSchema, member).data, { message: 'Member retrieved successfully' });
});

/* ======================================================
   PATCH /api/members/[id]
====================================================== */
export const PATCH = handleApi(async ({ req, params }) => {
  const id = Number(params?.id);

  if (!id || isNaN(id)) {
    throw new BadRequest('Invalid member ID');
  }

  const body = await req.json();
  const { fullName, memberClass, address, nis, phone, major } = validateSchema(updateMemberSchema, body);

  // Cek member exists dan belum di-delete
  const existingMember = await db.query.members.findFirst({
    where: and(eq(members.id, id), isNull(members.deletedAt)),
    with: {
      user: true,
    },
  });

  if (!existingMember) {
    throw new NotFound('Member not found');
  }

  // Update dalam transaction
  const result = await db.transaction(async (tx) => {
    // Update user jika email berubah

    // Update member
    const [updated] = await tx
      .update(members)
      .set({
        fullName,
        memberClass,
        address,
        nis,
        phone,
        major,
        updatedAt: new Date(),
      })
      .where(eq(members.id, id))
      .returning();

    return updated;
  });

  return ok(safeParseResponse(memberResponseSchema, result).data, { message: 'Member updated successfully' });
});

/* ======================================================
   DELETE /api/members/[id]
====================================================== */
export const DELETE = handleApi(async ({ params }) => {
  const id = Number(params?.id);

  if (!id || isNaN(id)) {
    throw new BadRequest('Invalid member ID');
  }

  // Soft delete member dan user terkait
  const result = await db.transaction(async (tx) => {
    // Soft delete member
    const [deletedMember] = await tx
      .update(members)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(members.id, id), isNull(members.deletedAt)))
      .returning();

    if (!deletedMember) {
      throw new NotFound('Member not found');
    }

    // Soft delete user terkait
    await tx
      .update(users)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(users.id, deletedMember.userId), isNull(users.deletedAt)));

    return deletedMember;
  });

  return ok(null, { message: 'Member deleted successfully (soft delete)' });
});