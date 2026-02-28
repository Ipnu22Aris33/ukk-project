import { email, z } from 'zod';
import { createUserInputSchema, userResponseSchema } from './user';
import { createMemberSchema, memberResponseSchema } from './member';

export const registerSchema = createUserInputSchema.omit({ role: true }).extend({
  fullName: createMemberSchema.shape.fullName,
  nis: createMemberSchema.shape.nis,
  username: createUserInputSchema.shape.username,
  email: createUserInputSchema.shape.email,
  password: createUserInputSchema.shape.password,
  memberClass: createMemberSchema.shape.memberClass,
  major: createMemberSchema.shape.major,
  phone: createMemberSchema.shape.phone,
  address: createMemberSchema.shape.address,
});

// lib/schema/auth.ts
export const registerFormSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.email('Email tidak valid'),
  nis: z.string().min(1, 'NIS wajib diisi'),
  address: z.string().min(1, 'Alamat wajib diisi'), // ← required di form
  password: z.string().min(8, 'Password minimal 8 karakter'),
  memberClass: z.string().min(1, 'Kelas wajib diisi'),
  major: z.string().min(1, 'Jurusan wajib diisi'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

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
