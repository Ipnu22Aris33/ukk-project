import { z } from 'zod';
import { userResponseSchema } from './user';
import { memberResponseSchema } from './member';

// Schema untuk validasi logika di backend (Aktivasi)
export const activateSchema = z.object({
  // NIS digunakan untuk mencari data Member yang sudah diinput Admin
  nis: z.string().min(1, 'NIS wajib diisi'),
  // Data akun baru yang akan dibuat
  username: z.string().min(3, 'Username minimal 3 karakter').max(50),
  email: z.string().email('Email tidak valid').max(255),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

// Schema untuk Form di Frontend (biasanya ada konfirmasi password)
export const activateFormSchema = activateSchema.extend({
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  // Identifier bisa berupa username atau email
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// Response saat Login
export const loginResponseSchema = z.object({
  user: userResponseSchema,
  member: memberResponseSchema.nullable(),
  token: z.string(),
});

// Response saat Aktivasi Berhasil
export const activateResponseSchema = z.object({
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

// Types
export type ActivateInput = z.infer<typeof activateSchema>;
export type ActivateFormInput = z.infer<typeof activateFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type ActivateResponse = z.infer<typeof activateResponseSchema>;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;