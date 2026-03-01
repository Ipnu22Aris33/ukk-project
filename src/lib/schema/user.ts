import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().max(100),
  email: z.string().max(255),
  password: z.string().max(255),
  avatarUrl: z.url().nullable(),
  avatarPublicId: z.string().nullable(),
  role: z.enum(['admin', 'staff', 'member']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

const userInputSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export const userResponseSchema = userSchema.omit({
  deletedAt: true,
  password: true,
});

export const createUserInputSchema = userInputSchema.extend({
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const updateUserInputSchema = userInputSchema.partial();

export type User = z.infer<typeof userSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>;
export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
