import { createResourceHook } from "./createResourceHook";

export const useCategory = createResourceHook('categories', '/api/books/categories')