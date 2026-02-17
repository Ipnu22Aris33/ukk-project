import { z } from 'zod';

export const createMemberSchema = z.object({
  full_name: z.string(),
  email: z.email(),
  username: z.string(),
  phone: z.string(),
  member_class: z.string(),
  major: z.string(),
});

export type createMemberType = z.infer<typeof createMemberSchema>