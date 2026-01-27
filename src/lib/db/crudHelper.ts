import { mysqlPool } from '@/lib/db/mysql';
import { RowDataPacket, ResultSetHeader, Pool, PoolConnection, QueryResult } from 'mysql2/promise';

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
    async create(data: Partial<T>): Promise<ResultSetHeader> {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data)
        .map(() => '?')
        .join(', ');
      const values = Object.values(data);

      const [result] = await db.query<ResultSetHeader>(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);

      return result;
    },
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
    async delete(id: any): Promise<ResultSetHeader> {
      const [res] = await db.query<ResultSetHeader>(`UPDATE ${table} SET deleted_at = NOW() WHERE ${key} = ?`, [id]);
      return res;
    },

    /**
     * DESTROY - hard delete
     * @param id
     * @returns
     */
    async destroy(id: any): Promise<ResultSetHeader> {
      const [res] = await db.query<ResultSetHeader>(`DELETE FROM ${table} WHERE ${key} = ?`, [id]);
      return res;
    },

    async existsById(id: number | string): Promise<boolean> {
      const [[row]]: any = await db.query(`SELECT 1 FROM ${fromTable} WHERE ${keyColumn} = ? LIMIT 1`, [id]);

      return !!row;
    },

    async exists(where: Record<string, any>): Promise<boolean> {
      const keys = Object.keys(where);
      if (!keys.length) return false;

      const whereClause = keys.map((k) => `${k} = ?`).join(' AND ');
      const values = keys.map((k) => where[k]);

      const [[row]]: any = await db.query(`SELECT 1 FROM ${fromTable} WHERE ${whereClause} LIMIT 1`, values);

      return !!row;
    },

    /**
     * PAGINATE - with search and joins
     * @param options
     * @returns
     */
    async paginate(options: {
      page?: number;
      limit?: number;
      select?: string;
      orderBy?: string;
      where?: Record<string, any>;
      joins?: JoinOption[];

      search?: string;
      searchable?: string[];
    }): Promise<{
      data: T[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        search: string | null;
      };
    }> {
      const page = options.page ?? 1;
      const limit = options.limit ?? 10;
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

      const orderClause = `ORDER BY ${options.orderBy ?? keyColumn}`;

      const [[{ total }]]: any = await db.query(`SELECT COUNT(*) AS total FROM ${fromTable} ${joinClause} ${whereClause} ${searchClause}`, [
        ...whereParams,
        ...searchParams,
      ]);

      const [rows] = await db.query<RowDataPacket[]>(
        `SELECT ${selectClause} FROM ${fromTable} ${joinClause} ${whereClause} ${searchClause} ${orderClause} LIMIT ? OFFSET ?`,
        [...whereParams, ...searchParams, limit, offset]
      );

      return {
        data: rows as unknown as T[],
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          search: options.search ?? null,
        },
      };
    },
  };
}
