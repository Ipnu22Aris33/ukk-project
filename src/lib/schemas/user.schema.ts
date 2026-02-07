import { z } from 'zod';

export const userSchema = z.object({
  email: z.email(),
  password: z.string(),
  role: z.enum(['member', 'admin']).default('member'),
});

export type userType = z.infer<typeof userSchema>;
