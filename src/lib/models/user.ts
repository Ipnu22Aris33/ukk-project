import { z } from 'zod';

export const userSchema = z.object({
  id_user: z.number().int().positive(),

  username: z.string().min(3).max(100),
  email: z.email(),
  password: z.string().min(6),

  role: z.enum(['admin', 'member']),

  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

/* CREATE */
export const createUserSchema = userSchema
  .omit({
    id_user: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .extend({ role: z.enum(['admin', 'member']).optional() });

/* UPDATE */
export const updateUserSchema = createUserSchema.partial();

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const validateCreateUser = (data: unknown): CreateUserInput => createUserSchema.parse(data);

export const validateUpdateUser = (data: unknown): UpdateUserInput => updateUserSchema.parse(data);
