import { Pool, PoolClient } from 'pg';
import { pgPool } from './pg';
import { dbMappings } from '@/config/dbMappings';
// Type untuk semua repositori
type AllRepos = {
  [K in keyof typeof dbMappings]: PgRepo<any>;
};
type DB = Pool | PoolClient;

type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

type JoinOption = {
  type?: JoinType;
  table: string;
  on: string;
};

type PaginateOption = {
  page?: number;
  limit?: number;
  select?: string;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
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

type CrudConfig = {
  table: string;
  key: string;
  alias?: string;
  hasUpdatedAt?: boolean;
  hasDeletedAt?: boolean;
  hasCreatedAt?: boolean;
  softDelete?: boolean;
};

type TransactionRepos<T> = {
  current: PgRepo<T>;
  createRepo<U>(config: CrudConfig): PgRepo<U>;
};

export class PgRepo<T = any> {
  private table: string;
  private key: string;
  private alias?: string;
  private fromTable: string;
  private keyColumn: string;
  private db: DB;
  private hasUpdatedAt: boolean;
  private hasDeletedAt: boolean;
  private hasCreatedAt: boolean;
  private softDelete: boolean;

  constructor(config: CrudConfig, db: DB = pgPool) {
    const { table, key, alias } = config;

    this.table = table;
    this.key = key;
    this.alias = alias;
    this.db = db;
    this.hasUpdatedAt = config.hasUpdatedAt ?? true;
    this.hasDeletedAt = config.hasDeletedAt ?? false;
    this.hasCreatedAt = config.hasCreatedAt ?? true;
    this.softDelete = config.softDelete ?? false;

    this.fromTable = this.alias ? `${this.table} ${this.alias}` : this.table;
    this.keyColumn = this.alias ? `${this.alias}.${this.key}` : this.key;
  }

  // ============================================================================
  // CREATE OPERATIONS
  // ============================================================================

  /**
   * Create a single record
   * @param data - Partial data to insert
   * @returns The created record
   */
  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `
      INSERT INTO ${this.table} (${columns.join(', ')})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await this.db.query(sql, values);
    return result.rows[0];
  }

  /**
   * Create multiple records in bulk
   * @param items - Array of partial data to insert
   * @returns Array of created records
   * @throws Error if items empty or columns inconsistent
   */
  async createMany(items: Partial<T>[]): Promise<T[]> {
    if (items.length === 0) {
      throw new Error('createMany: items is empty');
    }

    const columns = Object.keys(items[0]);

    if (columns.length === 0) {
      throw new Error('createMany: no columns provided');
    }

    // Validate all items have same columns
    items.forEach((item, index) => {
      const keys = Object.keys(item);
      if (keys.length !== columns.length) {
        throw new Error(`createMany: inconsistent columns at index ${index}`);
      }
      columns.forEach((col) => {
        if (!keys.includes(col)) {
          throw new Error(`createMany: missing column "${col}" at index ${index}`);
        }
      });
    });

    // Build bulk insert query
    const placeholders = items
      .map((_, i) => {
        const start = i * columns.length + 1;
        return `(${columns.map((_, j) => `$${start + j}`).join(', ')})`;
      })
      .join(', ');

    const values = items.flatMap((item) => columns.map((col) => item[col as keyof T]));

    const sql = `
      INSERT INTO ${this.table} (${columns.join(', ')})
      VALUES ${placeholders}
      RETURNING *
    `;

    const result = await this.db.query(sql, values);
    return result.rows;
  }

  // ============================================================================
  // READ OPERATIONS
  // ============================================================================

  /**
   * Get a record by its primary key
   * @param id - Primary key value
   * @param options - Query options (select, joins)
   * @returns The record or null if not found
   */
  async getById(
    id: number | string,
    options?: {
      select?: string;
      joins?: JoinOption[];
    }
  ): Promise<T | null> {
    const selectClause = options?.select ?? '*';
    const joinClause = this.buildJoinClause(options?.joins);

    const baseCondition = `${this.keyColumn} = $1`;
    const { clause: whereClause, params } = this.buildGetWhereClause(baseCondition, [id]);

    const sql = `
      SELECT ${selectClause}
      FROM ${this.fromTable}
      ${joinClause}
      ${whereClause}
      LIMIT 1
    `;

    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Get a single record matching the where condition
   * @param where - Where conditions as key-value pairs
   * @param options - Query options (select, joins)
   * @returns The first matching record or null
   */
  async getBy(
    where: Record<string, any>,
    options?: {
      select?: string;
      joins?: JoinOption[];
    }
  ): Promise<T | null> {
    const whereKeys = Object.keys(where);
    if (whereKeys.length === 0) {
      return null;
    }

    const selectClause = options?.select ?? '*';
    const joinClause = this.buildJoinClause(options?.joins);

    const { clause: baseClause, params } = this.buildWhereClause(where);
    const { clause: whereClause } = this.buildGetWhereClause(baseClause.replace('WHERE ', ''), params);

    const sql = `
      SELECT ${selectClause}
      FROM ${this.fromTable}
      ${joinClause}
      ${whereClause}
      LIMIT 1
    `;

    const result = await this.db.query(sql, params);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Get all records with optional filtering
   * @param options - Query options (select, joins, where, orderBy, limit)
   * @returns Array of records
   */
  async getAll(options?: {
    select?: string;
    joins?: JoinOption[];
    where?: Record<string, any>;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    limit?: number;
  }): Promise<T[]> {
    const selectClause = options?.select ?? '*';
    const joinClause = this.buildJoinClause(options?.joins);

    const { clause: whereClause, params } = this.buildWhereWithSoftDelete(options?.where);

    const orderClause = (() => {
      if (!options?.orderBy) {
        return '';
      }
      const orderDir = options.orderDir === 'desc' ? 'DESC' : 'ASC';
      return `ORDER BY ${options.orderBy} ${orderDir}`;
    })();

    const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';

    const sql = `
      SELECT ${selectClause}
      FROM ${this.fromTable}
      ${joinClause}
      ${whereClause}
      ${orderClause}
      ${limitClause}
    `;

    const result = await this.db.query(sql, params);
    return result.rows;
  }

  /**
   * Lock a record for update (SELECT ... FOR UPDATE)
   * @param id - Primary key value
   * @returns The locked record or null
   */
  async lockById(id: number | string): Promise<T | null> {
    const sql = `
      SELECT * FROM ${this.fromTable}
      WHERE ${this.keyColumn} = $1
      FOR UPDATE
    `;

    const result = await this.db.query(sql, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Count records with optional where condition
   * @param where - Optional where conditions
   * @returns Total count
   */
  async count(where?: Record<string, any>): Promise<number> {
    const { clause: whereClause, params } = this.buildWhereWithSoftDelete(where);

    const sql = `SELECT COUNT(*)::int AS total FROM ${this.fromTable} ${whereClause}`;
    const result = await this.db.query(sql, params);

    return result.rows[0].total;
  }

  /**
   * Check if a record exists by primary key
   * @param id - Primary key value
   * @returns True if record exists
   */
  async existsById(id: number | string): Promise<boolean> {
    const whereClause = (() => {
      const base = `${this.keyColumn} = $1`;
      if (this.softDelete && this.hasDeletedAt) {
        return `${base} AND deleted_at IS NULL`;
      }
      return base;
    })();

    const sql = `
      SELECT 1 FROM ${this.fromTable}
      WHERE ${whereClause}
      LIMIT 1
    `;

    const result = await this.db.query(sql, [id]);
    return result.rows.length > 0;
  }

  /**
   * Check if a record exists matching where condition
   * @param where - Where conditions
   * @returns True if record exists
   */
  async exists(where: Record<string, any>): Promise<boolean> {
    const keys = Object.keys(where);
    if (keys.length === 0) {
      return false;
    }

    const { clause: baseClause, params } = this.buildWhereClause(where);
    const whereClause = (() => {
      if (this.softDelete && this.hasDeletedAt) {
        return `${baseClause} AND deleted_at IS NULL`;
      }
      return baseClause;
    })();

    const sql = `
      SELECT 1 FROM ${this.fromTable}
      ${whereClause}
      LIMIT 1
    `;

    const result = await this.db.query(sql, params);
    return result.rows.length > 0;
  }

  /**
   * Paginate through records with search and joins
   * @param options - Pagination options
   * @returns Paginated result with metadata
   */
  async paginate(options: PaginateOption): Promise<PaginateResult<T>> {
    const page = Math.max(1, options.page ?? 1);
    const limit = Math.max(1, options.limit ?? 10);
    const offset = (page - 1) * limit;

    const selectClause = options.select ?? '*';
    const joinClause = this.buildJoinClause(options.joins);

    // Build WHERE conditions
    const whereResult = this.buildWhereClause(options.where);
    const baseParams = [...whereResult.params];

    // Build SEARCH conditions
    const searchResult = (() => {
      if (!options.search || !options.searchable || options.searchable.length === 0) {
        return { clause: '', params: [] };
      }

      const conditions = options.searchable.map((field, i) => `${field} ILIKE $${baseParams.length + i + 1}`);
      const clause = `(${conditions.join(' OR ')})`;
      const params = options.searchable.map(() => `%${options.search}%`);

      return { clause, params };
    })();

    // Combine WHERE and SEARCH
    const finalWhereClause = (() => {
      const hasWhere = whereResult.clause !== '';
      const hasSearch = searchResult.clause !== '';

      if (hasWhere && hasSearch) {
        return `${whereResult.clause} AND ${searchResult.clause}`;
      }
      if (hasWhere) {
        return whereResult.clause;
      }
      if (hasSearch) {
        return `WHERE ${searchResult.clause}`;
      }
      return '';
    })();

    const allParams = [...baseParams, ...searchResult.params];

    // Add soft delete condition
    const finalWhereWithSoftDelete = (() => {
      if (!this.softDelete || !this.hasDeletedAt) {
        return finalWhereClause;
      }

      if (finalWhereClause === '') {
        return 'WHERE deleted_at IS NULL';
      }

      return `${finalWhereClause} AND deleted_at IS NULL`;
    })();

    // Build ORDER clause
    const sortableColumns = options.sortable ?? [this.keyColumn];
    const orderBy = options.orderBy ?? this.keyColumn;
    const safeOrderBy = sortableColumns.includes(orderBy) ? orderBy : this.keyColumn;
    const orderDir = options.orderDir === 'desc' ? 'DESC' : 'ASC';
    const orderClause = `ORDER BY ${safeOrderBy} ${orderDir}`;

    // Get total count
    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM ${this.fromTable}
      ${joinClause}
      ${finalWhereWithSoftDelete}
    `;

    const countResult = await this.db.query(countQuery, allParams);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const dataQuery = `
      SELECT ${selectClause}
      FROM ${this.fromTable}
      ${joinClause}
      ${finalWhereWithSoftDelete}
      ${orderClause}
      LIMIT $${allParams.length + 1}
      OFFSET $${allParams.length + 2}
    `;

    const dataResult = await this.db.query(dataQuery, [...allParams, limit, offset]);

    return {
      data: dataResult.rows as T[],
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
  }

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================

  /**
   * Update a record by its primary key
   * @param id - Primary key value
   * @param data - Partial data to update
   * @returns Updated record or null if not found
   */
  async updateById(id: number | string, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);

    if (keys.length === 0) {
      throw new Error('No data to update');
    }

    const setParts = keys.map((k, i) => `${k} = $${i + 1}`);
    const setClauseArray = [...setParts];

    if (this.hasUpdatedAt) {
      setClauseArray.push('updated_at = NOW()');
    }

    const setClause = setClauseArray.join(', ');

    const sql = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE ${this.key} = $${keys.length + 1}
      RETURNING *
    `;

    const result = await this.db.query(sql, [...Object.values(data), id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  /**
   * Update records matching the where condition
   * @param where - Where conditions to match
   * @param data - Partial data to update
   * @returns Array of updated records
   */
  async updateBy(where: Record<string, any>, data: Partial<T>): Promise<T[]> {
    const whereKeys = Object.keys(where);
    const dataKeys = Object.keys(data);

    if (whereKeys.length === 0 || dataKeys.length === 0) {
      throw new Error('Invalid update condition');
    }

    const setParts = dataKeys.map((k, i) => `${k} = $${i + 1}`);
    const setClauseArray = [...setParts];

    if (this.hasUpdatedAt) {
      setClauseArray.push('updated_at = NOW()');
    }

    const setClause = setClauseArray.join(', ');

    const whereClause = whereKeys.map((k, i) => `${k} = $${dataKeys.length + i + 1}`).join(' AND ');

    const sql = `
      UPDATE ${this.table}
      SET ${setClause}
      WHERE ${whereClause}
      RETURNING *
    `;

    const values = [...Object.values(data), ...Object.values(where)];
    const result = await this.db.query(sql, values);

    return result.rows;
  }

  // ============================================================================
  // DELETE OPERATIONS
  // ============================================================================

  /**
   * Soft delete a record by its primary key
   * @param id - Primary key value
   * @returns True if record was deleted
   * @throws Error if soft delete is not enabled
   */
  async deleteById(id: number | string): Promise<boolean> {
    if (!this.softDelete || !this.hasDeletedAt) {
      throw new Error('Soft delete is not enabled for this repository');
    }

    const result = await this.db.query(
      `UPDATE ${this.table}
       SET deleted_at = NOW()
       WHERE ${this.key} = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Permanently delete a record by its primary key
   * @param id - Primary key value
   * @returns True if record was deleted
   */
  async destroyById(id: number | string): Promise<boolean> {
    const result = await this.db.query(
      `DELETE FROM ${this.table}
       WHERE ${this.key} = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Restore a soft-deleted record
   * @param id - Primary key value
   * @returns True if record was restored
   * @throws Error if soft delete is not enabled
   */
  async restore(id: number | string): Promise<boolean> {
    if (!this.softDelete || !this.hasDeletedAt) {
      throw new Error('Soft delete is not enabled for this repository');
    }

    const result = await this.db.query(
      `UPDATE ${this.table}
       SET deleted_at = NULL
       WHERE ${this.key} = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }

  // ============================================================================
  // UTILITY OPERATIONS
  // ============================================================================

  /**
   * Execute a raw SQL query
   * @param sql - SQL query string
   * @param params - Query parameters
   * @returns Array of results
   */
  async rawQuery<R = any>(sql: string, params?: any[]): Promise<R[]> {
    const result = await this.db.query(sql, params || []);
    return result.rows as R[];
  }

  /**
   * Execute operations in a transaction
   * @param callback - Function containing transaction operations
   * @returns Result of the callback
   */
  async transaction<R>(callback: (repos: AllRepos) => Promise<R>): Promise<R> {
    // Helper buat create repos
    const createRepos = (db: any): AllRepos => {
      // Gunakan Record untuk bypass read-only
      const repos = {} as Record<keyof typeof dbMappings, PgRepo<any>>;

      for (const [name, config] of Object.entries(dbMappings)) {
        repos[name as keyof typeof dbMappings] = new PgRepo(
          {
            table: config.repo.table,
            key: config.repo.key,
            alias: config.repo.alias,
            hasCreatedAt: config.repo.hasCreatedAt,
            hasUpdatedAt: config.repo.hasUpdatedAt,
            hasDeletedAt: config.repo.hasDeletedAt,
          },
          db
        );
      }

      return repos as AllRepos;
    };

    // If already in a transaction, reuse the connection
    if (this.db !== pgPool) {
      return callback(createRepos(this.db));
    }

    const client = await pgPool.connect();

    try {
      await client.query('BEGIN');
      const result = await callback(createRepos(client));
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Build join clause from join options
   */
  private buildJoinClause(joins?: JoinOption[]): string {
    if (!joins || joins.length === 0) {
      return '';
    }
    return joins
      .map((j) => {
        const type = j.type ?? 'LEFT';
        return `${type} JOIN ${j.table} ON ${j.on}`;
      })
      .join(' ');
  }

  /**
   * Build where clause and parameters from where object
   */
  private buildWhereClause(where?: Record<string, any>): { clause: string; params: any[] } {
    if (!where || Object.keys(where).length === 0) {
      return { clause: '', params: [] };
    }

    // Support OR
    if ('$or' in where && Array.isArray(where.$or)) {
      const conditions = where.$or.map((condition: Record<string, any>, index: number) => {
        const key = Object.keys(condition)[0];
        return `${key} = $${index + 1}`;
      });

      const params = where.$or.map((condition: Record<string, any>) => Object.values(condition)[0]);

      return {
        clause: `WHERE (${conditions.join(' OR ')})`,
        params,
      };
    }

    const entries = Object.entries(where);

    const conditions = entries.map(([key], index) => `${key} = $${index + 1}`);

    const params = entries.map(([, value]) => value);

    return {
      clause: `WHERE ${conditions.join(' AND ')}`,
      params,
    };
  }

  /**
   * Build where clause with soft delete condition
   */
  private buildWhereWithSoftDelete(where?: Record<string, any>): { clause: string; params: any[] } {
    const { clause, params } = this.buildWhereClause(where);

    if (!this.softDelete || !this.hasDeletedAt) {
      return { clause, params };
    }

    const tableRef = this.alias ?? this.table;

    if (clause === '') {
      return {
        clause: `WHERE ${tableRef}.deleted_at IS NULL`,
        params,
      };
    }

    return {
      clause: `${clause} AND ${tableRef}.deleted_at IS NULL`,
      params,
    };
  }

  /**
   * Build where clause for GET operations that might have base condition + soft delete
   */
  private buildGetWhereClause(baseCondition: string, baseParams: any[]): { clause: string; params: any[] } {
    const tableRef = this.alias ?? this.table;
    const cleanCondition = baseCondition.replace(/^WHERE\s+/i, '');

    const hasBase = cleanCondition.trim().length > 0;

    if (!hasBase) {
      if (this.softDelete && this.hasDeletedAt) {
        return {
          clause: `WHERE ${tableRef}.deleted_at IS NULL`,
          params: baseParams,
        };
      }
      return { clause: '', params: baseParams };
    }

    const baseWhereClause = `WHERE ${cleanCondition}`;

    const whereClause = this.softDelete && this.hasDeletedAt ? `${baseWhereClause} AND ${tableRef}.deleted_at IS NULL` : baseWhereClause;

    return {
      clause: whereClause,
      params: baseParams,
    };
  }
}

/**
 * Helper function to create a new PgRepo instance
 * @param config - Repository configuration
 * @param db - Database connection (optional)
 * @returns PgRepo instance
 */
export function pgRepo<T = any>(config: CrudConfig, db: DB = pgPool) {
  return new PgRepo<T>(config, db);
}
