import { z } from 'zod';
import { userResponseSchema } from './user.res';
import { memberResponseSchema } from './member.res';
import { RegisterInput, LoginInput } from '@/lib/schema/auth';
import { ApiSingleResponse } from './api.res';

// Re-export input types dari schema
export type { RegisterInput, LoginInput };

/* ======================
   LOGIN RESPONSE
====================== */
export const loginResponseSchema = z.object({
  user: userResponseSchema,
  member: memberResponseSchema.nullable(),
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type LoginApiResponse = ApiSingleResponse<LoginResponse>;

/* ======================
   REGISTER RESPONSE
====================== */
export const registerResponseSchema = z.object({
  user: userResponseSchema,
  member: memberResponseSchema,
  token: z.string(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export type RegisterApiResponse = ApiSingleResponse<RegisterResponse>;

/* ======================
   LOGOUT RESPONSE
====================== */
export const logoutResponseSchema = z.object({
  message: z.string(),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;
export type LogoutApiResponse = ApiSingleResponse<LogoutResponse>;

/* ======================
   REFRESH TOKEN RESPONSE
====================== */
export const refreshTokenResponseSchema = z.object({
  token: z.string(),
});

export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type RefreshTokenApiResponse = ApiSingleResponse<RefreshTokenResponse>;
