import { createResourceHook } from './createResourceHook';

export const useMembers = createResourceHook('members', '/api/members');
