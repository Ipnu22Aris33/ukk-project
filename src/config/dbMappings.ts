export const dbMappings = {
  books: {
    repo: {
      table: 'books',
      pk: 'id_book',
      alias: 'b',
    },
    columns: {
      id: 'id_book',
      title: 'title',
      author: 'author',
      categoryId: 'category_id',
      publisher: 'publisher',
      stock: 'stock',
      slug: 'slug',
      isbn: 'isbn',
      year: 'year',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  categories: {
    repo: {
      table: 'categories',
      pk: 'id_category',
      alias: 'c',
    },
    columns: {
      id: 'id_category',
      name: 'name',
      slug: 'slug',
      description: 'description',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },

  users: {
    repo: {
      table: 'users',
      pk: 'id_user',
      alias: 'u',
    },
    columns: {
      id: 'id_user',
      username: 'username',
      email: 'email',
      password: 'password',
      role: 'role',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  members: {
    repo: {
      table: 'members',
      pk: 'id_member',
      alias: 'm',
    },
    columns: {
      id: 'id_member',
      userId: 'user_id',
      memberCode: 'member_code',
      fullName: 'full_name',
      memberClass: 'member_class',
      address: 'address',
      nis: 'nis',
      phone: 'phone',
      major: 'major',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  loans: {
    repo: {
      table: 'loans',
      pk: 'id_loan',
      alias: 'l',
    },
    columns: {
      id: 'id_loan',
      memberId: 'member_id',
      bookId: 'book_id',
      reservationId: 'reservation_id',
      loanDate: 'loan_date',
      dueDate: 'due_date',
      quantity: 'quantity',
      status: 'status',
      notes: 'notes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  returns: {
    repo: {
      table: 'returns',
      pk: 'id_return',
      alias: 'r',
    },
    columns: {
      id: 'id_return',
      loanId: 'loan_id',
      returnedAt: 'returned_at',
      extendedDueDate: 'extended_due_date',
      fineAmount: 'fine_amount',
      status: 'status',
      notes: 'notes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  reservations: {
    repo: {
      table: 'reservations',
      pk: 'id_reservation',
      alias: 'rn',
    },
    columns: {
      id: 'id_reservation',
      reservationCode: 'reservation_code',
      memberId: 'member_id',
      bookId: 'book_id',
      status: 'status',
      reservedAt: 'reserved_at',
      approvedAt: 'approved_at',
      approvedBy: 'approved_by',
      exporesAt: 'expires_at',
      notes: 'notes',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
};

export function mapDb<T extends keyof typeof dbMappings>(table: T, data: Partial<Record<keyof (typeof dbMappings)[T]['columns'], any>>) {
  const { columns } = dbMappings[table];

  return Object.fromEntries(
    Object.entries(data)
      .filter(([key]) => key in columns)
      .map(([key, value]) => [columns[key as keyof typeof columns], value])
  );
}

export function col<T extends keyof typeof dbMappings>(table: T, key: keyof (typeof dbMappings)[T]['columns']) {
  const map = dbMappings[table];
  const alias = map.repo.alias ?? map.repo.table;
  return `${alias}.${map.columns[key as keyof typeof map.columns]}`;
}
