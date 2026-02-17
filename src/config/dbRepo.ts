import { dbMappings } from './dbMappings';
import { RepoBuilder } from '../lib/db/repoBuilder';

export const bookRepo = new RepoBuilder(dbMappings.books.repo);
export const categoryRepo = new RepoBuilder(dbMappings.categories.repo);
export const userRepo = new RepoBuilder(dbMappings.users.repo);
export const memberRepo = new RepoBuilder(dbMappings.members.repo);
