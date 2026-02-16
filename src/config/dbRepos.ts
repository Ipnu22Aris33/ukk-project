import { PgRepo } from '@/lib/pgRepo';
import { dbMappings } from '@/config/dbMappings';

export function createRepo<T extends keyof typeof dbMappings>(name: T) {
  const config = dbMappings[name];
  return new PgRepo(config.repo);
}

export const bookRepo = createRepo('books');
export const categoryRepo = createRepo('categories');
export const userRepo = createRepo('users');
