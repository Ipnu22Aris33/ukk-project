import { mysqlPool } from '@/lib/db/mysql';
import { RowDataPacket, ResultSetHeader, Pool, PoolConnection } from 'mysql2/promise';

type DB = Pool | PoolConnection;

type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

type JoinOption = {
  type?: JoinType;
  table: string;
  on: string;
};

type CrudConfig = {
  table: string;
  key: string;
  alias?: string;
};

type PaginateOptions = {
  page?: number;
  limit?: number;
  select?: string;
  orderBy?: string;
  orderDir?: 'desc' | 'asc';
  where?: Record<string, any>;
  joins?: JoinOption[];
  search?: string;
  searchable?: string[];
  sortable?: string[];
};

type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    search: string | null;
  };
};

type TransactionRepos<T> = {
  current: CrudHelper<T>;
  createRepo<U>(config: CrudConfig): CrudHelper<U>;
};

type CrudHelper<T> = ReturnType<typeof crudHelper<T>>;

export function crudHelper<T = any>(config: CrudConfig, db: DB = mysqlPool) {
  const { table, key, alias } = config;

  const fromTable = alias ? `${table} ${alias}` : table;
  const keyColumn = alias ? `${alias}.${key}` : key;

  return {
    /**
     * CREATE - insert new row
     * @param data
     * @returns
     */
    async create(data: Partial<T>): Promise<T> {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data)
        .map(() => '?')
        .join(', ');
      const values = Object.values(data);

      const [result] = await db.query<ResultSetHeader>(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);

      return {
        ...data,
        [key]: result.insertId,
      } as T;
    },

    /**
     * CREATE MANY - insert multiple rows
     * @param items
     * @returns
     */
    async createMany(items: Partial<T>[]): Promise<ResultSetHeader> {
      if (!items.length) {
        throw new Error('createMany: items is empty');
      }

      const columns = Object.keys(items[0]);

      if (!columns.length) {
        throw new Error('createMany: no columns provided');
      }

      for (const [index, item] of items.entries()) {
        const keys = Object.keys(item);

        if (keys.length !== columns.length) {
          throw new Error(`createMany: inconsistent columns at index ${index}`);
        }

        for (const col of columns) {
          if (!keys.includes(col)) {
            throw new Error(`createMany: missing column "${col}" at index ${index}`);
          }
        }
      }

      const columnSQL = columns.map((col) => `\`${col}\``).join(', ');

      const placeholders = items.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');

      const values = items.flatMap((item) => columns.map((col) => item[col as keyof T]));

      const [result] = await db.query<ResultSetHeader>(`INSERT INTO \`${table}\` (${columnSQL}) VALUES ${placeholders}`, values);
      return result;
    },

    /**
     * UPDATE BY ID - update row by primary key
     * @param id
     * @param data
     * @returns
     */
    async updateById(id: number | string, data: Partial<T>): Promise<ResultSetHeader> {
      const keys = Object.keys(data);
      if (!keys.length) {
        throw new Error('No data to update');
      }

      const setClause = keys.map((k) => `${k} = ?`).join(', ');
      const values = [...Object.values(data), id];

      const [res] = await db.query<ResultSetHeader>(`UPDATE ${table} SET ${setClause} WHERE ${keyColumn} = ?`, values);

      return res;
    },

    /**
     * UPDATE BY - update rows by where condition
     * @param where
     * @param data
     * @returns
     */
    async updateBy(where: Record<string, any>, data: Partial<T>): Promise<ResultSetHeader> {
      const whereKeys = Object.keys(where);
      const dataKeys = Object.keys(data);

      if (!whereKeys.length || !dataKeys.length) {
        throw new Error('Invalid update condition');
      }

      const setClause = dataKeys.map((k) => `${k} = ?`).join(', ');
      const whereClause = whereKeys.map((k) => `${k} = ?`).join(' AND ');

      const values = [...dataKeys.map((k) => (data as any)[k]), ...whereKeys.map((k) => where[k])];

      const [res] = await db.query<ResultSetHeader>(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`, values);

      return res;
    },

    /**
     * LOCK BY ID - get row by primary key with FOR UPDATE
     * @param id
     * @returns
     */
    async lockById(id: number | string): Promise<T | null> {
      const [rows] = await db.query<RowDataPacket[]>(`SELECT * FROM ${fromTable} WHERE ${keyColumn} = ? FOR UPDATE`, [id]);

      return (rows[0] as unknown as T) ?? null;
    },

    /**
     * GET BY ID - single row by primary key
     * @param id
     * @param options
     * @returns
     */
    async getById(
      id: number | string,
      options?: {
        select?: string;
        joins?: JoinOption[];
      }
    ): Promise<T | null> {
      const selectClause = options?.select ?? '*';
      const joinClause = options?.joins?.length ? options.joins.map((j) => `${j.type ?? 'LEFT'} JOIN ${j.table} ON ${j.on}`).join(' ') : '';

      const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT ${selectClause}
        FROM ${fromTable}
        ${joinClause}
        WHERE ${keyColumn} = ?
        LIMIT 1
        `,
        [id]
      );

      return (rows[0] as unknown as T) ?? null;
    },

    /**
     * GET BY - single row by where condition
     * @param where
     * @param options
     * @returns
     */
    async getBy(
      where: Record<string, any>,
      options?: {
        select?: string;
        joins?: JoinOption[];
      }
    ): Promise<T | null> {
      const selectClause = options?.select ?? '*';

      const joinClause = options?.joins?.length ? options.joins.map((j) => `${j.type ?? 'LEFT'} JOIN ${j.table} ON ${j.on}`).join(' ') : '';

      const whereKeys = Object.keys(where);
      if (!whereKeys.length) return null;

      const whereClause = 'WHERE ' + whereKeys.map((k) => `${k} = ?`).join(' AND ');
      const params = whereKeys.map((k) => where[k]);

      const [rows] = await db.query<RowDataPacket[]>(`SELECT ${selectClause} FROM ${fromTable} ${joinClause} ${whereClause} LIMIT 1`, params);

      return (rows[0] as unknown as T) ?? null;
    },

    /**
     * GET ALL - without pagination
     * @param options
     * @returns
     */
    async getAll(options?: { select?: string; joins?: JoinOption[]; where?: Record<string, any>; orderBy?: string }): Promise<T[]> {
      const selectClause = options?.select ?? '*';

      const joinClause = options?.joins?.length ? options.joins.map((j) => `${j.type ?? 'LEFT'} JOIN ${j.table} ON ${j.on}`).join(' ') : '';

      const whereKeys = options?.where ? Object.keys(options.where) : [];
      const whereClause = whereKeys.length ? 'WHERE ' + whereKeys.map((k) => `${k} = ?`).join(' AND ') : '';
      const whereParams = whereKeys.map((k) => options!.where![k]);

      const orderClause = options?.orderBy ? `ORDER BY ${options.orderBy}` : '';

      const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT ${selectClause}
        FROM ${fromTable}
        ${joinClause}
        ${whereClause}
        ${orderClause}
        `,
        whereParams
      );

      return rows as unknown as T[];
    },

    /**
     * DELETE - soft delete
     * @param id
     * @returns
     */
    async deleteById(id: any): Promise<ResultSetHeader> {
      const [res] = await db.query<ResultSetHeader>(`UPDATE ${table} SET deleted_at = NOW() WHERE ${key} = ?`, [id]);
      return res;
    },

    /**
     * DESTROY - hard delete
     * @param id
     * @returns
     */
    async destroyById(id: any): Promise<ResultSetHeader> {
      const [res] = await db.query<ResultSetHeader>(`DELETE FROM ${table} WHERE ${key} = ?`, [id]);
      return res;
    },

    /**
     * RESTORE - restore soft deleted record
     * @param id
     * @returns
     */
    async restore(id: any): Promise<ResultSetHeader> {
      const [res] = await db.query<ResultSetHeader>(`UPDATE ${table} SET deleted_at = NULL WHERE ${key} = ?`, [id]);
      return res;
    },

    /**
     * COUNT - count records with optional where condition
     * @param where
     * @returns
     */
    async count(where?: Record<string, any>): Promise<number> {
      const whereKeys = where ? Object.keys(where) : [];

      if (whereKeys.length) {
        const whereClause = 'WHERE ' + whereKeys.map((k) => `${k} = ?`).join(' AND ');
        const values = whereKeys.map((k) => where![k]);

        const [[{ count }]]: any = await db.query(`SELECT COUNT(*) as count FROM ${fromTable} ${whereClause}`, values);
        return count;
      }

      const [[{ count }]]: any = await db.query(`SELECT COUNT(*) as count FROM ${fromTable}`, []);
      return count;
    },

    /**
     * EXISTS BY ID - check if record exists by primary key
     * @param id
     * @returns
     */
    async existsById(id: number | string): Promise<boolean> {
      const [[row]]: any = await db.query(`SELECT 1 FROM ${fromTable} WHERE ${keyColumn} = ? LIMIT 1`, [id]);

      return !!row;
    },

    /**
     * EXISTS - check if record exists by where condition
     * @param where
     * @returns
     */
    async exists(where: Record<string, any>): Promise<boolean> {
      const keys = Object.keys(where);
      if (!keys.length) return false;

      const whereClause = keys.map((k) => `${k} = ?`).join(' AND ');
      const values = keys.map((k) => where[k]);

      const [[row]]: any = await db.query(`SELECT 1 FROM ${fromTable} WHERE ${whereClause} LIMIT 1`, values);

      return !!row;
    },

    /**
     * RAW QUERY - for complex queries
     * @param sql
     * @param params
     * @returns
     */
    async rawQuery<R = any>(sql: string, params?: any[]): Promise<R> {
      const [result] = await db.query(sql, params || []);
      return result as R;
    },

    /**
     * TRANSACTION - execute operations in a transaction
     * @param callback
     * @returns
     */
    async transaction<R>(callback: (repos: TransactionRepos<T>) => Promise<R>): Promise<R> {
      if (db !== mysqlPool) {
        const createRepo = <U>(repoConfig: CrudConfig) => crudHelper<U>(repoConfig, db);

        return callback({
          current: this as CrudHelper<T>,
          createRepo,
        });
      }

      const connection = await mysqlPool.getConnection();

      try {
        await connection.beginTransaction();

        const current = crudHelper<T>(config, connection);

        const createRepo = <U>(repoConfig: CrudConfig) => crudHelper<U>(repoConfig, connection);

        const result = await callback({ current, createRepo });

        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },
    /**
     * PAGINATE - with search and joins
     * @param options
     * @returns
     */
    async paginate(options: PaginateOptions): Promise<PaginateResult<T>> {
      const page = Math.max(1, options.page ?? 1);
      const limit = Math.max(1, options.limit ?? 10);
      const offset = (page - 1) * limit;

      const selectClause = options.select ?? '*';

      const joinClause = options.joins?.length ? options.joins.map((j) => `${j.type ?? 'LEFT'} JOIN ${j.table} ON ${j.on}`).join(' ') : '';

      const whereKeys = options.where ? Object.keys(options.where) : [];
      const whereClause = whereKeys.length ? 'WHERE ' + whereKeys.map((k) => `${k} = ?`).join(' AND ') : '';
      const whereParams = whereKeys.map((k) => options.where![k]);

      const hasSearch = options.search && options.searchable?.length;
      const searchClause = hasSearch
        ? (whereClause ? ' AND ' : 'WHERE ') + '(' + options.searchable!.map((f) => `${f} LIKE ?`).join(' OR ') + ')'
        : '';
      const searchParams = hasSearch ? options.searchable!.map(() => `%${options.search}%`) : [];

      const orderBy = options.orderBy;
      const orderDir = options.orderDir?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      const sortableColumns = options.sortable ?? [keyColumn];

      const safeOrderBy = sortableColumns.includes(orderBy ?? '') ? orderBy : keyColumn;

      const orderClause = `ORDER BY ${safeOrderBy} ${orderDir}`;

      const [[{ total }]]: any = await db.query(`SELECT COUNT(*) AS total FROM ${fromTable} ${joinClause} ${whereClause} ${searchClause}`, [
        ...whereParams,
        ...searchParams,
      ]);

      const totalPages = Math.ceil(total / limit);

      const [rows] = await db.query<RowDataPacket[]>(
        `
        SELECT ${selectClause}
        FROM ${fromTable}
        ${joinClause}
        ${whereClause}
        ${searchClause}
        ${orderClause}
        LIMIT ? OFFSET ?
        `,
        [...whereParams, ...searchParams, limit, offset]
      );

      return {
        data: rows as unknown as T[],
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
          search: options.search ?? null,
        },
      };
    },
  };
}
