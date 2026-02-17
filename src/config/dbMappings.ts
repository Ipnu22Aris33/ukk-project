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
      class: 'class',
      addrress: 'address',
      phone: 'phone',
      major: 'major',
      memberType: 'member_type',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },

  loans: {
    repo: {
      table: ' loans',
      pk: 'id_loan',
      alias: 'l',
    },
    columns: {
      id: 'id_loan',
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
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    },
  },
};

export function mapDb<T extends keyof typeof dbMappings>(table: T, data: Partial<Record<keyof (typeof dbMappings)[T]['columns'], any>>) {
  const { columns } = dbMappings[table];
  const result: Record<string, any> = {};

  for (const key in data) {
    if (key in columns) {
      const col = columns[key as keyof typeof columns];
      result[col] = data[key as keyof typeof data];
    }
  }

  return result;
}
