import { z } from 'zod';
import { userSchema, CreateUserInput, UpdateUserInput } from '@/lib/schema/user';
import { ApiListResponse, ApiSingleResponse } from './api.res';

export const userResponseSchema = userSchema.omit({
  password: true,
});

export type UserResponse = z.infer<typeof userResponseSchema>;
export type UserListResponse = ApiListResponse<UserResponse>;
export type UserDetailResponse = ApiSingleResponse<UserResponse>;
export type { CreateUserInput, UpdateUserInput };
