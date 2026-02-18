import { dbMappings } from './dbMappings';
import { RepoBuilder } from './repoBuilder';

export const bookRepo = new RepoBuilder(dbMappings.books.repo);
export const categoryRepo = new RepoBuilder(dbMappings.categories.repo);
export const userRepo = new RepoBuilder(dbMappings.users.repo);
export const memberRepo = new RepoBuilder(dbMappings.members.repo);
export const loanRepo = new RepoBuilder(dbMappings.loans.repo);
export const returnRepo = new RepoBuilder(dbMappings.returns.repo);
export const reservationRepo = new RepoBuilder(dbMappings.reservations.repo);
