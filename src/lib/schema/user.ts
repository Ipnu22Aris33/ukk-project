import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().max(100),
  email: z.string().max(255),
  password: z.string().max(255),
  role: z.enum(['admin', 'staff', 'member']),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type User = z.infer<typeof userSchema>;

/* ======================
   RESPONSE
====================== */
export const userResponseSchema = userSchema.omit({
  password: true,
});

export type UserResponse = z.infer<typeof userResponseSchema>;

/* ======================
   CREATE
====================== */
export const createUserInputSchema = userSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  })
  .extend({
    password: z.string().min(6, 'Password minimal 6 karakter'),
  });

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export const validateCreateUser = (data: unknown): CreateUserInput => createUserInputSchema.parse(data);

/* ======================
   UPDATE
====================== */
export const updateUserInputSchema = createUserInputSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

export const validateUpdateUser = (data: unknown): UpdateUserInput => updateUserInputSchema.parse(data);
