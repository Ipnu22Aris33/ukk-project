import { createResourceHook } from './createResourceHook';

export const useBooks = createResourceHook('books', '/api/books');
