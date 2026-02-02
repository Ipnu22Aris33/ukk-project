import { createResourceHook } from './createResourceHook';

export const useLoans = createResourceHook('loans', '/api/loans');
