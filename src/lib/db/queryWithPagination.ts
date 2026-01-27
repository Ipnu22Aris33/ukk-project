import { mysqlPool } from '@/lib/mysql';

type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

type JoinOption = {
  type?: JoinType;
  table: string;
  on: string;
};

type QueryBase = {
  table: string;
  select?: string;
};

type QueryWithPaginationOptions = {
  req: Request;
  base: QueryBase;
  joins?: JoinOption[];
  searchable?: string[];
  orderBy?: string;
  pageParam?: string;
  limitParam?: string;
  searchParam?: string;
  maxLimit?: number;
};

export async function queryWithPagination<T = any>({
  req,
  base,
  joins = [],
  searchable = [],
  orderBy = 'id DESC',
  pageParam = 'page',
  limitParam = 'limit',
  searchParam = 'q',
  maxLimit = 100,
}: QueryWithPaginationOptions) {
  const { searchParams } = new URL(req.url);

  const page = Math.max(Number(searchParams.get(pageParam)) || 1, 1);
  const limit = Math.min(Number(searchParams.get(limitParam)) || 10, maxLimit);
  const offset = (page - 1) * limit;
  const keyword = searchParams.get(searchParam)?.trim();
  const hasSearch = keyword && searchable.length > 0;
  const whereClause = hasSearch ? `WHERE ${searchable.map((f) => `${f} LIKE ?`).join(' OR ')}` : '';
  const whereParams = hasSearch ? searchable.map(() => `%${keyword}%`) : [];
  const joinClause = joins.map((j) => `${j.type ?? 'INNER'} JOIN ${j.table} ON ${j.on}`).join(' ');
  const selectClause = base.select ?? '*';

  const [[{ total }]]: any = await mysqlPool.query(
    `
    SELECT COUNT(*) as total
    FROM ${base.table}
    ${joinClause}
    ${whereClause}
    `,
    whereParams
  );

  const [rows]: any = await mysqlPool.query(
    `
    SELECT ${selectClause}
    FROM ${base.table}
    ${joinClause}
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
    `,
    [...whereParams, limit, offset]
  );

  return {
    data: rows as T[],
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      keyword: keyword ?? null,
    },
  };
}
