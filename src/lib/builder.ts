import { pgPool } from './pg'; // file kamu yang berisi pgPool
import { Pool } from 'pg';

interface FindOptions {
  select?: string[];
  where?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: string;
  search?: string;
  searchable?: string[];
}

interface UpsertOptions<T> {
  conflictKeys: (keyof T)[];
  update?: Partial<T>;
}

interface PaginateResult<T> {
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
}

export class PgRepo<T = any> {
  constructor(
    private table: string,
    private pool: Pool = pgPool, // <-- pakai default pgPool
    private alias?: string
  ) {}

  // =========================
  // PRIVATE HELPERS
  // =========================

  private buildSelect(select?: string[]) {
    return select && select.length ? select.join(', ') : '*';
  }

  private buildWhere(where?: Record<string, any>, startIndex = 1) {
    if (!where) return { sql: '', values: [], nextIndex: startIndex };

    const entries = Object.entries(where);

    const result = entries.reduce(
      (acc, [key, value]) => {
        if (key === 'OR' && Array.isArray(value)) {
          const orResult = value.reduce(
            (orAcc, condition) => {
              const built = this.buildWhere(condition, orAcc.nextIndex);
              return {
                clauses: [...orAcc.clauses, built.sql.replace(/^WHERE\s/, '')],
                values: [...orAcc.values, ...built.values],
                nextIndex: built.nextIndex,
              };
            },
            { clauses: [] as string[], values: [] as any[], nextIndex: acc.nextIndex }
          );

          return {
            clauses: [...acc.clauses, `(${orResult.clauses.join(' OR ')})`],
            values: [...acc.values, ...orResult.values],
            nextIndex: orResult.nextIndex,
          };
        }

        if (value?.in && Array.isArray(value.in)) {
          const placeholders = value.in.map((_, i) => `$${acc.nextIndex + i}`);
          return {
            clauses: [...acc.clauses, `${key} IN (${placeholders.join(', ')})`],
            values: [...acc.values, ...value.in],
            nextIndex: acc.nextIndex + value.in.length,
          };
        }

        if (value?.like) {
          return {
            clauses: [...acc.clauses, `${key} LIKE $${acc.nextIndex}`],
            values: [...acc.values, value.like],
            nextIndex: acc.nextIndex + 1,
          };
        }

        if (value === null) {
          return { clauses: [...acc.clauses, `${key} IS NULL`], values: acc.values, nextIndex: acc.nextIndex };
        }

        return {
          clauses: [...acc.clauses, `${key} = $${acc.nextIndex}`],
          values: [...acc.values, value],
          nextIndex: acc.nextIndex + 1,
        };
      },
      { clauses: [] as string[], values: [] as any[], nextIndex: startIndex }
    );

    return {
      sql: result.clauses.length ? `WHERE ${result.clauses.join(' AND ')}` : '',
      values: result.values,
      nextIndex: result.nextIndex,
    };
  }

  // =========================
  // PUBLIC METHODS
  // =========================

  async findOne(options: FindOptions) {
    const selectClause = this.buildSelect(options.select);
    const { sql: whereSql, values } = this.buildWhere(options.where);
    const query = `SELECT ${selectClause} FROM ${this.table} ${whereSql} LIMIT 1`;
    const result = await this.pool.query(query, values);
    return result.rows[0] ?? null;
  }

  // Soft delete (set deleted_at)
  async delete(where: Record<string, any>) {
    if (!where || !Object.keys(where).length) throw new Error('delete: where condition required');

    const { sql: whereSql, values } = this.buildWhere(where, 1);
    const query = `
    UPDATE ${this.table}
    SET deleted_at = NOW()
    ${whereSql}
    RETURNING *
  `;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  // Hard delete (destroy)
  async destroy(where: Record<string, any>) {
    if (!where || !Object.keys(where).length) throw new Error('destroy: where condition required');

    const { sql: whereSql, values } = this.buildWhere(where, 1);
    const query = `
    DELETE FROM ${this.table}
    ${whereSql}
    RETURNING *
  `;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async lock(where: Record<string, any>) {
    if (!where || !Object.keys(where).length) throw new Error('lock: where required');
    const { sql: whereSql, values } = this.buildWhere(where);
    const query = `SELECT * FROM ${this.table} ${whereSql} FOR UPDATE`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async count(where?: Record<string, any>): Promise<number> {
    const { sql: whereSql, values } = this.buildWhere(where);
    const query = `SELECT COUNT(*)::int AS total FROM ${this.table} ${whereSql}`;
    const result = await this.pool.query(query, values);
    return result.rows[0]?.total ?? 0;
  }
  
  async exists(where: Record<string, any>): Promise<boolean> {
    if (!where || !Object.keys(where).length) return false;
    const { sql: whereSql, values } = this.buildWhere(where);
    const query = `SELECT 1 FROM ${this.table} ${whereSql} LIMIT 1`;
    const result = await this.pool.query(query, values);
    return result.rows.length > 0;
  }

  async findMany(options: FindOptions) {
    const selectClause = this.buildSelect(options.select);
    const { sql: whereSql, values } = this.buildWhere(options.where);
    const limitClause = options.limit ? `LIMIT ${options.limit}` : '';
    const offsetClause = options.offset ? `OFFSET ${options.offset}` : '';
    const orderClause = options.orderBy ? `ORDER BY ${options.orderBy}` : '';

    const query = `
      SELECT ${selectClause}
      FROM ${this.table}
      ${whereSql}
      ${orderClause}
      ${limitClause}
      ${offsetClause}
    `;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async insertOne(data: Partial<T>) {
    const columns = Object.keys(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    const values = Object.values(data);

    const query = `
      INSERT INTO ${this.table} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async insertMany(items: Partial<T>[]) {
    if (!items.length) return [];

    const columns = Object.keys(items[0]);
    const values = items.flatMap((item) => columns.map((c) => item[c]));
    const placeholders = items.map((_, i) => `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`).join(', ');

    const query = `
      INSERT INTO ${this.table} (${columns.join(', ')})
      VALUES ${placeholders}
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async updateOne(where: Record<string, any>, data: Partial<T>) {
    const { sql: whereSql, values: whereValues } = this.buildWhere(where, 1);
    const columns = Object.keys(data);
    const setClause = columns.map((c, i) => `${c} = $${i + 1}`).join(', ');
    const values = [...Object.values(data), ...whereValues];

    const query = `
      UPDATE ${this.table}
      SET ${setClause}
      ${whereSql}
      RETURNING *
    `;
    const result = await this.pool.query(query, values);
    return result.rows[0] ?? null;
  }

  async upsertOne(data: Partial<T>, options: UpsertOptions<T>) {
    const columns = Object.keys(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);
    const values = Object.values(data);

    const conflictKeys = options.conflictKeys.join(', ');
    const updateClause = options.update
      ? Object.entries(options.update)
          .map(([k], i) => `${k} = $${columns.length + i + 1}`)
          .join(', ')
      : columns.map((c, i) => `${c} = $${i + 1}`).join(', ');

    const updateValues = options.update ? Object.values(options.update) : values;

    const query = `
      INSERT INTO ${this.table} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      ON CONFLICT (${conflictKeys})
      DO UPDATE SET ${updateClause}
      RETURNING *
    `;

    const result = await this.pool.query(query, [...values, ...updateValues]);
    return result.rows[0];
  }

  async paginate(options: FindOptions & { page?: number }): Promise<PaginateResult<T>> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const offset = (page - 1) * limit;

    const selectClause = this.buildSelect(options.select);

    // WHERE + search
    const whereClauseObj = this.buildWhere(options.where);
    const baseWhereSql = whereClauseObj.sql;
    const baseValues = whereClauseObj.values;

    const searchSql =
      options.search && options.searchable && options.searchable.length
        ? `(${options.searchable.map((c, i) => `${c} ILIKE $${baseValues.length + i + 1}`).join(' OR ')})`
        : '';

    const whereSql = [baseWhereSql.replace(/^WHERE\s/, ''), searchSql].filter(Boolean).join(' AND ');
    const finalWhere = whereSql ? `WHERE ${whereSql}` : '';

    const values =
      options.search && options.searchable && options.searchable.length
        ? [...baseValues, ...options.searchable.map(() => `%${options.search}%`)]
        : baseValues;

    // total count
    const countResult = await this.pool.query(`SELECT COUNT(*)::int AS total FROM ${this.table} ${finalWhere}`, values);
    const total = countResult.rows[0].total;
    const totalPages = Math.ceil(total / limit);

    // data query
    const orderClause = options.orderBy ? `ORDER BY ${options.orderBy}` : '';
    const dataQuery = `
      SELECT ${selectClause} FROM ${this.table}
      ${finalWhere}
      ${orderClause}
      LIMIT $${values.length + 1} OFFSET $${values.length + 2}
    `;
    const dataResult = await this.pool.query(dataQuery, [...values, limit, offset]);

    return {
      data: dataResult.rows,
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
}
