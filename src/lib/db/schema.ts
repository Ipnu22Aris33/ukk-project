import { pgTable, serial, varchar, text, integer, timestamp, numeric, pgEnum, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role_enum', ['admin', 'staff', 'member']);
export const loanStatusEnum = pgEnum('loan_status_enum', ['borrowed', 'returned', 'late', 'lost']);
export const reservationStatusEnum = pgEnum('reservation_status_enum', ['pending', 'approved', 'rejected', 'expired', 'completed', 'canceled']);
export const reservationTypeEnum = pgEnum('reservation_type_enum', ['onsite', 'take_home']);
export const fineStatusEnum = pgEnum('fine_status_enum', ['none', 'paid', 'unpaid']);
export const returnConditionEnum = pgEnum('return_condition_enum', ['good', 'damaged', 'lost']);

/* =========================================================
   USERS
========================================================= */

export const users = pgTable(
  'users',
  {
    id: serial('id_user').primaryKey(),
    username: varchar('username', { length: 100 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    role: userRoleEnum('role').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('users_email_unique').on(table.email),
    uniqueIndex('users_username_unique').on(table.username),
    index('users_role_idx').on(table.role),
    index('users_deleted_at_idx').on(table.deletedAt),
  ]
);

/* =========================================================
   CATEGORIES
========================================================= */

export const categories = pgTable(
  'categories',
  {
    id: serial('id_category').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('categories_slug_unique').on(table.slug),
    index('categories_name_idx').on(table.name),
    index('categories_deleted_at_idx').on(table.deletedAt),
  ]
);

/* =========================================================
   BOOKS
========================================================= */

export const books = pgTable(
  'books',
  {
    id: serial('id_book').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    author: varchar('author', { length: 255 }).notNull(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    publisher: varchar('publisher', { length: 255 }),
    stock: integer('stock').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    isbn: varchar('isbn', { length: 100 }),
    year: integer('year'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('books_slug_unique').on(table.slug),
    uniqueIndex('books_isbn_unique').on(table.isbn),
    index('books_category_idx').on(table.categoryId),
    index('books_title_idx').on(table.title),
    index('books_deleted_at_idx').on(table.deletedAt),
  ]
);

/* =========================================================
   MEMBERS
========================================================= */

export const members = pgTable(
  'members',
  {
    id: serial('id_member').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    memberCode: varchar('member_code', { length: 100 }).notNull(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    memberClass: varchar('member_class', { length: 100 }),
    address: text('address'),
    nis: varchar('nis', { length: 100 }),
    phone: varchar('phone', { length: 50 }),
    major: varchar('major', { length: 150 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('members_user_unique').on(table.userId),
    uniqueIndex('members_code_unique').on(table.memberCode),
    index('members_fullname_idx').on(table.fullName),
    index('members_deleted_at_idx').on(table.deletedAt),
  ]
);

/* =========================================================
   RESERVATIONS
========================================================= */

export const reservations = pgTable(
  'reservations',
  {
    id: serial('id_reservation').primaryKey(),
    reservationCode: varchar('reservation_code', { length: 100 }).notNull(),
    reservationType: reservationTypeEnum('reservation_type').notNull(),
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').notNull(),
    status: reservationStatusEnum('status').notNull(),
    reservedAt: timestamp('reserved_at').notNull(),
    approvedAt: timestamp('approved_at'),
    approvedBy: integer('approved_by').references(() => users.id),
    expiresAt: timestamp('expires_at'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('reservations_code_unique').on(table.reservationCode),
    index('reservations_member_idx').on(table.memberId),
    index('reservations_book_idx').on(table.bookId),
    index('reservations_status_idx').on(table.status),
    index('reservations_type_idx').on(table.reservationType),
    index('reservations_deleted_at_idx').on(table.deletedAt),
    index('reservations_member_status_idx').on(table.memberId, table.status),
  ]
);

/* =========================================================
   LOANS
========================================================= */

export const loans = pgTable(
  'loans',
  {
    id: serial('id_loan').primaryKey(),
    memberId: integer('member_id')
      .notNull()
      .references(() => members.id, { onDelete: 'cascade' }),
    bookId: integer('book_id')
      .notNull()
      .references(() => books.id, { onDelete: 'restrict' }),
    reservationId: integer('reservation_id').references(() => reservations.id),
    quantity: integer('quantity').notNull(),
    loanDate: timestamp('loan_date').notNull(),
    dueDate: timestamp('due_date').notNull(),
    extendedDueDate: timestamp('extended_due_date'),
    extensionCount: integer('extension_count').default(0),
    status: loanStatusEnum('status').notNull(),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('loans_member_idx').on(table.memberId),
    index('loans_book_idx').on(table.bookId),
    index('loans_status_idx').on(table.status),
    index('loans_due_date_idx').on(table.dueDate),
    index('loans_deleted_at_idx').on(table.deletedAt),
    index('loans_member_status_idx').on(table.memberId, table.status),
  ]
);

/* =========================================================
   RETURNS
========================================================= */

export const returns = pgTable(
  'returns',
  {
    id: serial('id_return').primaryKey(),
    loanId: integer('loan_id')
      .notNull()
      .references(() => loans.id, { onDelete: 'cascade' }),
    returnedAt: timestamp('returned_at').notNull(),
    fineAmount: numeric('fine_amount', { precision: 10, scale: 2 }),
    fineStatus: fineStatusEnum('fine_status'),
    condition: returnConditionEnum('condition'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    uniqueIndex('returns_loan_unique').on(table.loanId),
    index('returns_fine_status_idx').on(table.fineStatus),
    index('returns_condition_idx').on(table.condition),
    index('returns_deleted_at_idx').on(table.deletedAt),
  ]
);

/* =========================================================
   RELATIONS
========================================================= */

export const usersRelations = relations(users, ({ one }) => ({
  member: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));

export const membersRelations = relations(members, ({ one, many }) => ({
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
  loans: many(loans),
  reservations: many(reservations),
}));

export const booksRelations = relations(books, ({ one, many }) => ({
  category: one(categories, {
    fields: [books.categoryId],
    references: [categories.id],
  }),
  loans: many(loans),
  reservations: many(reservations),
}));

export const loansRelations = relations(loans, ({ one }) => ({
  member: one(members, {
    fields: [loans.memberId],
    references: [members.id],
  }),
  book: one(books, {
    fields: [loans.bookId],
    references: [books.id],
  }),
  reservation: one(reservations, {
    fields: [loans.reservationId],
    references: [reservations.id],
  }),
  return: one(returns, {
    fields: [loans.id],
    references: [returns.loanId],
  }),
}));
