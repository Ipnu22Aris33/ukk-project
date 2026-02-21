// types/member.response.ts
import { z } from 'zod';
import { memberSchema } from '@/lib/schema/member';
import { ApiListResponse, ApiSingleResponse } from './api.res';

export const memberResponseSchema = memberSchema;

export type MemberResponse = z.infer<typeof memberResponseSchema>;
export type MemberListResponse = ApiListResponse<MemberResponse>;
export type MemberDetailResponse = ApiSingleResponse<MemberResponse>;
