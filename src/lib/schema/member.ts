import { email, z } from 'zod';
import { userResponseSchema } from './user';

export const memberSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  memberCode: z.string().min(3).max(50),
  fullName: z.string().min(1).max(150),
  memberClass: z.string().max(100),
  address: z.string().nullable().optional(),
  nis: z.string().max(50),
  phone: z.string().max(50),
  major: z.string().max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const memberInputSchema = memberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}).extend({
  userId : z.number().int().positive().optional(),
  memberCode: z.string().min(3).max(50).optional(),
  email: z.email('Email tidak valid').max(255, 'Email maksimal 255 karakter').optional(),
});

export const memberResponseSchema = memberSchema.omit({ deletedAt: true }).extend({
  user: userResponseSchema,
});

export const memberFormSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi').max(150, 'Nama lengkap maksimal 150 karakter'),
  memberClass: z.string().max(100, 'Kelas maksimal 100 karakter'),
  address: z.string(),
  nis: z.string().max(50, 'NIS maksimal 50 karakter'),
  phone: z.string().max(50, 'Nomor telepon maksimal 50 karakter'),
  major: z.string().max(100, 'Jurusan maksimal 100 karakter'),
  email: z.email('Email tidak valid').max(255, 'Email maksimal 255 karakter'),
});

export const createMemberSchema = memberInputSchema;
export const updateMemberSchema = memberInputSchema.partial();
export type MemberFormInput = z.infer<typeof memberFormSchema>;
export type Member = z.infer<typeof memberSchema>;
export type MemberResponse = z.infer<typeof memberResponseSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
