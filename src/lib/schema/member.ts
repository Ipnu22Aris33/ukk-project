import { z } from 'zod';
import { userResponseSchema } from './user';

// 1. BASE SCHEMA (Sesuai Struktur Database)
export const memberSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive().nullable(),
  memberCode: z.string().min(3).max(100),
  fullName: z.string().min(1, 'Nama lengkap wajib diisi').max(255),
  memberClass: z.string().max(100).nullable().optional(),
  address: z.string().nullable().optional(),
  nis: z.string().min(1, 'NIS wajib diisi').max(100),
  phone: z.string().max(50).nullable().optional(),
  major: z.string().max(150).nullable().optional(),
  isActive: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

// 2. FORM SCHEMA (Digunakan Admin untuk Create & Update)
// Kita hapus email dari sini karena Admin tidak mendaftarkan email
export const memberFormSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi').max(150),
  memberClass: z.string().min(1, 'Kelas wajib diisi').max(100),
  address: z.string().min(1, 'Alamat wajib diisi'),
  nis: z.string().min(1, 'NIS wajib diisi').max(50),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').max(50),
  major: z.string().min(1, 'Jurusan wajib diisi').max(100),
});

// 3. INPUT SCHEMAS (Untuk API Payload)
export const createMemberSchema = memberFormSchema; // Admin input data dasar
export const updateMemberSchema = memberFormSchema.partial(); // Admin edit data dasar

// 4. RESPONSE SCHEMA
export const memberResponseSchema = memberSchema.omit({ deletedAt: true }).extend({
  user: userResponseSchema.nullable().optional(),
});

// TYPES
export type Member = z.infer<typeof memberSchema>;
export type MemberFormInput = z.infer<typeof memberFormSchema>;
export type MemberResponse = z.infer<typeof memberResponseSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;