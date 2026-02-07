import { z } from 'zod';

export const createMemberSchema = z.object({
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  class: z.string(),
  major: z.string(),
});

export type createMemberType = z.infer<typeof createMemberSchema>