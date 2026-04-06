import { db } from '@/lib/db';
import { members, users } from '@/lib/db/schema'; // Sesuaikan path schema kamu
import { activateSchema } from '@/lib/schema/auth';
import { hashPassword } from '@/lib/utils/auth';
import { Conflict, NotFound, UnprocessableEntity } from '@/lib/utils/httpErrors'; // Helper error kamu
import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { validateSchema } from '@/lib/utils/validate';
import { eq, and } from 'drizzle-orm';
import { createToken } from '@/lib/utils/auth';

export const POST = handleApi(async ({ req }) => {
  const body = await req.json();
  
  // 1. Validasi input menggunakan schema yang sudah kita buat
  const { nis, username, email, password } = validateSchema(activateSchema, body);

  const result = await db.transaction(async (tx) => {
    // 2. Cari member berdasarkan NIS
    const existingMember = await tx.query.members.findFirst({
      where: eq(members.nis, nis),
    });

    if (!existingMember) {
      throw new NotFound('NIS tidak terdaftar di database perpustakaan.');
    }

    // 3. Cek apakah member sudah aktivasi (punya userId atau isActive true)
    if (existingMember.isActive || existingMember.userId) {
      throw new Conflict('Akun dengan NIS ini sudah diaktivasi sebelumnya.');
    }

    // 4. Ceth apakah username atau email sudah diambil orang lain di tabel users
    const duplicateUser = await tx.query.users.findFirst({
      where: (users, { or, eq }) => or(
        eq(users.username, username),
        eq(users.email, email)
      ),
    });

    if (duplicateUser) {
      throw new Conflict('Username atau Email sudah digunakan.');
    }

    // 5. Hash password & Insert ke tabel users
    const hashedPassword = await hashPassword(password);
    const [newUser] = await tx
      .insert(users)
      .values({
        username,
        email,
        password: hashedPassword,
        role: 'member', // Default role untuk aktivasi mandiri
      })
      .returning();

    // 6. Update tabel members: hubungkan ke user baru dan set aktif
    const [updatedMember] = await tx
      .update(members)
      .set({
        userId: newUser.id,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(members.id, existingMember.id))
      .returning();

    const token = createToken({ 
      sub: newUser.id, 
      role: newUser.role,
      email: newUser.email
    });

    return {
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
      member: updatedMember,
      token,
    };
  });

  return ok(result, { message: 'Aktivasi akun berhasil! Selamat datang di perpustakaan.' });
});