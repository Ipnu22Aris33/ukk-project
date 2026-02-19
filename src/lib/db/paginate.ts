import { and, or, ilike, asc, desc, sql, SQL, AnyColumn } from 'drizzle-orm';

type PaginateOptions<TTable> = {
  db: any;
  table: TTable;
  query: any;

  page?: number;
  limit?: number;

  search?: string;
  searchable?: (AnyColumn | SQL)[];

  sortable?: Record<string, AnyColumn | SQL>;
  orderBy?: keyof PaginateOptions<TTable>['sortable'] | string;
  orderDir?: 'asc' | 'desc';

  where?: SQL | SQL[];
  with?: any;

  select?: any; // <--- tambahkan select di sini
};

export async function paginate<TTable>({
  db,
  table,
  query,
  page = 1,
  limit = 10,
  search,
  searchable = [],
  sortable = {},
  orderBy,
  orderDir = 'desc',
  where,
  with: relations,
  select, // <--- destructure select
}: PaginateOptions<TTable>) {
  /* ===============================
     SAFE PAGINATION
  =============================== */

  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const offset = (safePage - 1) * safeLimit;

  /* ===============================
     SEARCH CONDITION
  =============================== */

  const searchCondition = search && searchable.length
    ? or(...searchable.map((col) => ilike(col as any, `%${search}%`)))
    : undefined;

  /* ===============================
     WHERE MERGE (SAFER)
  =============================== */

  const conditions: SQL[] = [];

  if (Array.isArray(where)) {
    conditions.push(...where);
  } else if (where) {
    conditions.push(where);
  }

  if (searchCondition) {
    conditions.push(searchCondition);
  }

  const finalWhere = conditions.length > 0 ? and(...conditions) : undefined;

  /* ===============================
     SAFE SORTING
  =============================== */

  const sortKeys = Object.keys(sortable);
  const orderColumn = orderBy && sortable[orderBy]
    ? sortable[orderBy]
    : sortKeys.length > 0
      ? sortable[sortKeys[0]]
      : undefined;

  const order = orderColumn && (orderDir === 'asc' ? asc(orderColumn) : desc(orderColumn));

  /* ===============================
     DATA QUERY
  =============================== */

  const data = await query.findMany({
    where: finalWhere,
    with: relations,
    limit: safeLimit,
    offset,
    orderBy: order ? [order] : undefined,
    select, // <--- pass select ke query
  });

  /* ===============================
     COUNT QUERY (CONSISTENT)
  =============================== */

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(table);
  const countResult = finalWhere ? await countQuery.where(finalWhere) : await countQuery;
  const total = Number(countResult[0]?.count ?? 0);

  /* ===============================
     RETURN
  =============================== */

  return {
    data,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    },
  };
}
