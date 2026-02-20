import { z } from 'zod';
import { createUserInputSchema, userResponseSchema } from './user';
import { createMemberSchema, memberResponseSchema } from './member';

/* ======================
   REGISTER (gabungan user + member)
====================== */
export const registerSchema = createUserInputSchema
  .omit({
    role: true, // role diisi otomatis 'member' di backend
  })
  .extend({
    // data member
    full_name: createMemberSchema.shape.fullName,
    nis: createMemberSchema.shape.nis,
    member_class: createMemberSchema.shape.memberClass,
    major: createMemberSchema.shape.major,
    phone: createMemberSchema.shape.phone,
    address: createMemberSchema.shape.address,
  });

/* ======================
   LOGIN
====================== */
export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

/* ======================
   RESPONSE
====================== */

export const loginResponseSchema = z.object({
  user: userResponseSchema,
  member: memberResponseSchema.nullable(),
  token: z.string(),
});

export const registerResponseSchema = z.object({
  user: userResponseSchema,
  member: memberResponseSchema,
  token: z.string(),
});

export const logoutResponseSchema = z.object({
  message: z.string(),
});

export const refreshTokenResponseSchema = z.object({
  token: z.string(),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
