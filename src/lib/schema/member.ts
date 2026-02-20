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

export type Member = z.infer<typeof memberSchema>;

/* ======================
   RESPONSE
====================== */
export const memberResponseSchema = memberSchema
  .omit({
    deletedAt: true,
  })
  .extend({
    id: z.number().int().positive(),
    user: userResponseSchema,
  });

export type MemberResponse = z.infer<typeof memberResponseSchema>;

/* ======================
   CREATE
====================== */
export const createMemberSchema = memberSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;

export const validateCreateMember = (data: unknown) => {
  return createMemberSchema.parse(data);
};

/* ======================
   UPDATE
====================== */
export const updateMemberSchema = createMemberSchema.partial();

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const validateUpdateMember = (data: unknown) => {
  return updateMemberSchema.parse(data);
};