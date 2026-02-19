import { z } from 'zod';

export const memberSchema = z.object({
  id_member: z.number().int().positive(),

  user_id: z.number().int().positive(),
  member_code: z.string().min(3).max(50),

  full_name: z.string().min(1).max(150),
  member_class: z.string().max(100).nullable().optional(),
  address: z.string().nullable().optional(),
  nis: z.string().max(50).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  major: z.string().max(100).nullable().optional(),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});


/* CREATE */
export const createMemberSchema = memberSchema.omit({
  id_member: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

/* UPDATE */
export const updateMemberSchema = createMemberSchema.partial();

export type Member = z.infer<typeof memberSchema>;
export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

export const validateCreateMember = (data: unknown) => {
  return createMemberSchema.parse(data);
};

export const validateUpdateMember = (data: unknown) => {
  return updateMemberSchema.parse(data);
};
