import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Format email tidak valid').min(1, 'Email wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  class: z.string(),
  major: z.string(),
  phone: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
