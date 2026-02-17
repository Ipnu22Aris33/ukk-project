import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email atau username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export const registerSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter').max(100),

  email: z.email('Format email tidak valid').min(1, 'Email wajib diisi'),

  password: z.string().min(6, 'Password minimal 6 karakter'),

  full_name: z.string().min(1, 'Nama wajib diisi').max(150),

  member_class: z.string().max(100).optional(),

  major: z.string().max(100).optional(),

  phone: z.string().max(50).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const validateLogin = (data: unknown) => {
  return loginSchema.parse(data);
};

export const validateRegister = (data: unknown) => {
  return registerSchema.parse(data);
};
