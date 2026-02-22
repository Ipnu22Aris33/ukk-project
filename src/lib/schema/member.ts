import { z } from 'zod';
import { userResponseSchema } from './user';

export const memberSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  memberCode: z.string().min(3).max(50),
  fullName: z.string().min(1).max(150),
  memberClass: z.string().max(100),
  address: z.string(),
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
});

export const memberResponseSchema = memberSchema.omit({ deletedAt: true }).extend({
  user: userResponseSchema,
});

export const createMemberSchema = memberInputSchema;
export const updateMemberSchema = memberInputSchema.partial();

export type Member = z.infer<typeof memberSchema>;
export type MemberResponse = z.infer<typeof memberResponseSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
