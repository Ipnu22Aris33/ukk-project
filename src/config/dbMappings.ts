import { pgRepo, PgRepo } from '@/lib/pgRepo';

export const dbMappings = {
  books: {
    repo: {
      table: 'books',
      key: 'id_book',
      alias: 'b',
      hasCreatedAt: true,
      hasUpdatedAt: true,
      hasDeletedAt: true,
    },

    searchable: ['b.title', 'b.author', 'b.publisher', 'b.isbn'],
    sortable: ['b.created_at', 'b.title', 'b.author', 'b.year', 'b.stock'],

    joins: {
      category: {
        type: 'LEFT',
        table: 'categories c',
        on: 'c.id_category = b.category_id',
      },
    },

    select: {
      default: `
        b.*,
        c.id_category,
        c.name as category_name,
        c.slug as category_slug
      `,
    },
  },

  categories: {
    repo: {
      table: 'categories',
      key: 'id_category',
      alias: 'c',
      hasCreatedAt: true,
      hasUpdatedAt: false,
      hasDeletedAt: true,
    },

    searchable: ['c.name'],
    sortable: ['c.created_at', 'c.name'],

    select: {
      default: 'c.*',
    },
  },

  users: {
    repo: {
      table: 'users',
      key: 'id_user',
      alias: 'u',
      hasCreatedAt: true,
      hasUpdatedAt: true,
      hasDeletedAt: true,
    },

    searchable: ['u.name', 'u.email', 'u.username'],
    sortable: ['u.created_at', 'u.name', 'u.email'],

    select: {
      default: 'u.*',
      profile: 'u.id_user, u.name, u.email, u.avatar',
    },
  },

  // 👇 MEMBERS
  members: {
    repo: {
      table: 'members',
      key: 'id_member',
      alias: 'm',
      hasCreatedAt: true,
      hasUpdatedAt: true,
      hasDeletedAt: true,
    },

    searchable: ['m.name', 'm.email', 'm.phone', 'm.member_number'],
    sortable: ['m.created_at', 'm.name', 'm.member_number'],

    select: {
      default: 'm.*',
    },
  },

  // 👇 LOANS (peminjaman)
  loans: {
    repo: {
      table: 'loans',
      key: 'id_loan',
      alias: 'l',
      hasCreatedAt: true,
      hasUpdatedAt: true,
      hasDeletedAt: false, // Loans biasanya hard delete atau status aja
    },

    searchable: ['l.loan_code', 'm.name', 'b.title'],
    sortable: ['l.created_at', 'l.due_date', 'l.status'],

    joins: {
      member: {
        type: 'LEFT',
        table: 'members m',
        on: 'm.id_member = l.member_id',
      },
      book: {
        type: 'LEFT',
        table: 'books b',
        on: 'b.id_book = l.book_id',
      },
    },

    select: {
      default: `
        l.*,
        m.name as member_name,
        m.member_number,
        b.title as book_title,
        b.author as book_author
      `,
    },
  },

  // 👇 RETURNS (pengembalian)
  returns: {
    repo: {
      table: 'returns',
      key: 'id_return',
      alias: 'r',
      hasCreatedAt: true,
      hasUpdatedAt: true,
      hasDeletedAt: false,
    },

    searchable: ['r.return_code', 'l.loan_code', 'm.name'],
    sortable: ['r.created_at', 'r.return_date'],

    joins: {
      loan: {
        type: 'LEFT',
        table: 'loans l',
        on: 'l.id_loan = r.loan_id',
      },
      member: {
        type: 'LEFT',
        table: 'members m',
        on: 'm.id_member = l.member_id',
      },
      book: {
        type: 'LEFT',
        table: 'books b',
        on: 'b.id_book = l.book_id',
      },
    },

    select: {
      default: `
        r.*,
        l.loan_code,
        m.name as member_name,
        b.title as book_title,
        b.author as book_author,
        l.due_date
      `,
    },
  },
} as const;

export const bookRepo = new PgRepo(dbMappings.books.repo);
export const categoryRepo = new PgRepo(dbMappings.categories.repo);
export const userRepo = new PgRepo(dbMappings.users.repo);
export const memberRepo = new PgRepo(dbMappings.members.repo);
export const loanRepo = new PgRepo(dbMappings.loans.repo);
export const returnRepo = new PgRepo(dbMappings.returns.repo);
