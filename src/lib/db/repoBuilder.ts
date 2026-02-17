import { Pool } from 'pg';
import { pgPool } from './pg';

export type JoinOption = {
  type?: 'INNER' | 'LEFT' | 'RIGHT';
  table: string;
  alias?: string;
  on: string;
};

export type PaginateOption = {
  page?: number;
  limit?: number;
  select?: string | string[];
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  where?: Record<string, any>;
  joins?: JoinOption[];
  search?: string;
  searchable?: string[];
  sortable?: string[];
};

export type PaginateResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    search: string | null;
    orderBy: string;
    orderDir: string;
  };
};

export class RepoBuilder<T = any> {
  private table: string;
  private alias?: string;
  private pk: string;
  private pool: Pool;

  constructor(opts: { table: string; pk: string; alias?: string }, pool: Pool = pgPool) {
    this.table = opts.table;
    this.pk = opts.pk;
    this.alias = opts.alias;
    this.pool = pool;
  }

  private get tableWithAlias() {
    return this.alias ? `${this.table} AS ${this.alias}` : this.table;
  }

  // ===========================
  // SELECT
  // ===========================
  async findOne(where: Record<string, any>, select: string | string[] = '*', joins?: JoinOption[]) {
    const { sql, values } = this.buildWhere(where);
    const selectClause = Array.isArray(select) ? select.join(', ') : select;
    const joinClause = this.buildJoinClause(joins);
    const query = `SELECT ${selectClause} FROM ${this.tableWithAlias} ${joinClause} ${sql} LIMIT 1`;
    const result = await this.pool.query(query, values);
    return result.rows[0] ?? null;
  }

  async findById(id: number | string, select: string | string[] = '*', joins?: JoinOption[]) {
    return this.findOne({ [`${this.alias ?? this.table}.${this.pk}`]: id }, select, joins);
  }

  async findMany(where?: Record<string, any>, select: string | string[] = '*', joins?: JoinOption[]) {
    const { sql, values } = this.buildWhere(where);
    const selectClause = Array.isArray(select) ? select.join(', ') : select;
    const joinClause = this.buildJoinClause(joins);
    const query = `SELECT ${selectClause} FROM ${this.tableWithAlias} ${joinClause} ${sql}`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  // ===========================
  // INSERT
  // ===========================
  async insertOne(data: Partial<T>) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO ${this.table} (${columns.join(',')}) VALUES (${placeholders}) RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async insertMany(items: Partial<T>[]) {
    if (!items.length) return [];
    const columns = Object.keys(items[0]);
    const placeholders = items.map((_, i) => `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`).join(', ');
    const values = items.flatMap((item) => columns.map((c) => item[c as keyof T]));
    const query = `INSERT INTO ${this.table} (${columns.join(',')}) VALUES ${placeholders} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async bulkInsert(
    items: Partial<T>[],
    options?: {
      chunkSize?: number;
      conflictColumn?: string;
      ignoreDuplicates?: boolean;
    }
  ): Promise<T[]> {
    if (!items.length) return [];

    const chunkSize = options?.chunkSize ?? 1000;

    const chunks = Array.from({ length: Math.ceil(items.length / chunkSize) }, (_, i) => items.slice(i * chunkSize, (i + 1) * chunkSize));

    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const columns = Object.keys(chunk[0]);

        const placeholders = chunk
          .map((_, rowIndex) => `(${columns.map((_, colIndex) => `$${rowIndex * columns.length + colIndex + 1}`).join(', ')})`)
          .join(', ');

        const values = chunk.flatMap((item) => columns.map((c) => item[c as keyof T]));

        const conflictClause = options?.conflictColumn && options.ignoreDuplicates ? `ON CONFLICT (${options.conflictColumn}) DO NOTHING` : '';

        const query = `
        INSERT INTO ${this.table} (${columns.join(', ')})
        VALUES ${placeholders}
        ${conflictClause}
        RETURNING *
      `;

        const result = await this.pool.query(query, values);
        return result.rows;
      })
    );

    return results.flat();
  }

  // ===========================
  // UPDATE
  // ===========================
  async updateOne(where: Record<string, any>, data: Partial<T>) {
    const { setClause, values: setValues } = this.buildSetClause(data);
    const { sql: whereSql, values: whereValues } = this.buildWhere(where, setValues.length + 1);
    const query = `UPDATE ${this.table} SET ${setClause} ${whereSql} RETURNING *`;
    const result = await this.pool.query(query, [...setValues, ...whereValues]);
    return result.rows[0] ?? null;
  }

  async updateById(id: number | string, data: Partial<T>) {
    return this.updateOne({ [this.pk]: id }, data);
  }

  async updateMany(where: Record<string, any>, data: Partial<T>) {
    const { setClause, values: setValues } = this.buildSetClause(data);
    const { sql: whereSql, values: whereValues } = this.buildWhere(where, setValues.length + 1);
    const query = `UPDATE ${this.table} SET ${setClause} ${whereSql} RETURNING *`;
    const result = await this.pool.query(query, [...setValues, ...whereValues]);
    return result.rows;
  }

  async bulkUpdate(items: (Partial<T> & { [key: string]: any })[]): Promise<T[]> {
    if (!items.length) return [];

    const columns = Object.keys(items[0]).filter((c) => c !== this.pk);

    if (!columns.length) {
      throw new Error('bulkUpdate: no columns to update');
    }

    const ids = items.map((item) => item[this.pk]);

    // Hitung total parameter sebelum WHERE
    const totalCaseParams = columns.length * items.length * 2;

    const values = columns.flatMap((col) => items.flatMap((item) => [item[this.pk], item[col as keyof T]]));

    const setClause = columns
      .map((col, colIndex) => {
        const cases = items
          .map((_, rowIndex) => {
            const baseIndex = colIndex * items.length * 2 + rowIndex * 2;

            const pkParam = `$${baseIndex + 1}`;
            const valueParam = `$${baseIndex + 2}`;

            return `WHEN ${pkParam} THEN ${valueParam}`;
          })
          .join(' ');

        return `${col} = CASE ${this.pk} ${cases} ELSE ${col} END`;
      })
      .join(', ');

    const query = `
    UPDATE ${this.table}
    SET ${setClause}
    WHERE ${this.pk} = ANY($${totalCaseParams + 1}::int[])
    RETURNING *
  `;

    const result = await this.pool.query(query, [...values, ids]);

    return result.rows;
  }

  // ===========================
  // DELETE / DESTROY
  // ===========================
  async delete(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);
    const query = `UPDATE ${this.table} SET deleted_at=NOW() ${sql} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async destroy(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);
    const query = `DELETE FROM ${this.table} ${sql} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async deleteById(id: number | string) {
    return this.delete({ [this.pk]: id });
  }

  async destroyById(id: number | string) {
    return this.destroy({ [this.pk]: id });
  }

  async deleteMany(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);

    const query = `
    UPDATE ${this.table}
    SET deleted_at = NOW()
    ${sql}
    RETURNING *
  `;

    const result = await this.pool.query(query, values);
    return result.rows;
  }
  async bulkDelete(ids: (number | string)[]) {
    if (!ids.length) return [];

    const query = `
    UPDATE ${this.table}
    SET deleted_at = NOW()
    WHERE ${this.pk} = ANY($1)
    RETURNING *
  `;

    const result = await this.pool.query(query, [ids]);
    return result.rows;
  }

  async destroyMany(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);

    const query = `
    DELETE FROM ${this.table}
    ${sql}
    RETURNING *
  `;

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async bulkDestroy(ids: (number | string)[]) {
    if (!ids.length) return [];

    const query = `
    DELETE FROM ${this.table}
    WHERE ${this.pk} = ANY($1)
    RETURNING *
  `;

    const result = await this.pool.query(query, [ids]);
    return result.rows;
  }

  // ===========================
  // PAGINATE
  // ===========================
  async paginate(opts: PaginateOption): Promise<PaginateResult<T>> {
    const page = opts.page ?? 1;
    const limit = opts.limit ?? 10;
    const offset = (page - 1) * limit;

    const selectClause = Array.isArray(opts.select) ? opts.select.join(', ') : (opts.select ?? '*');

    const joinClause = this.buildJoinClause(opts.joins);

    const { sql: whereSql, values: whereValues } = this.buildWhere(opts.where);

    // ===== SEARCH FIX (NO PARAM CONFLICT) =====
    const searchStartIndex = whereValues.length;

    const searchClause =
      opts.search && opts.searchable?.length
        ? `(${opts.searchable.map((field, i) => `${field} ILIKE $${searchStartIndex + i + 1}`).join(' OR ')})`
        : '';

    const searchValues = opts.search && opts.searchable?.length ? opts.searchable.map(() => `%${opts.search}%`) : [];

    const finalWhere = whereSql ? (searchClause ? `${whereSql} AND ${searchClause}` : whereSql) : searchClause ? `WHERE ${searchClause}` : '';

    const finalValues = [...whereValues, ...searchValues];

    // ===== ORDER FIX =====
    const defaultOrder = `${this.alias ?? this.table}.${this.pk}`;

    const orderBy =
      opts.orderBy && opts.sortable?.length
        ? (opts.sortable.find((s) => s === opts.orderBy || s.endsWith(`.${opts.orderBy}`)) ?? defaultOrder)
        : defaultOrder;

    const orderDir = opts.orderDir?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    // ===== COUNT QUERY =====
    const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM ${this.tableWithAlias}
    ${joinClause}
    ${finalWhere}
  `;

    const countResult = await this.pool.query(countQuery, finalValues);

    const total = countResult.rows[0]?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    // ===== DATA QUERY =====
    const dataQuery = `
    SELECT ${selectClause}
    FROM ${this.tableWithAlias}
    ${joinClause}
    ${finalWhere}
    ORDER BY ${orderBy} ${orderDir}
    LIMIT $${finalValues.length + 1}
    OFFSET $${finalValues.length + 2}
  `;

    const dataResult = await this.pool.query(dataQuery, [...finalValues, limit, offset]);

    return {
      data: dataResult.rows,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        search: opts.search ?? null,
        orderBy,
        orderDir,
      },
    };
  }

  // ===========================
  // UTILITY
  // ===========================
  async count(where?: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);
    const query = `SELECT COUNT(*)::int AS total FROM ${this.tableWithAlias} ${sql}`;
    const result = await this.pool.query(query, values);
    return result.rows[0]?.total ?? 0;
  }

  async exists(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);
    const query = `SELECT 1 FROM ${this.tableWithAlias} ${sql} LIMIT 1`;
    const result = await this.pool.query(query, values);
    return result.rows.length > 0;
  }

  async lock(where: Record<string, any>) {
    const { sql, values } = this.buildWhere(where);
    const query = `SELECT * FROM ${this.tableWithAlias} ${sql} FOR UPDATE`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  // ===========================
  // PRIVATE
  // ===========================
  private buildJoinClause(joins?: JoinOption[]) {
    if (!joins?.length) return '';
    return joins
      .map((j) => {
        const aliasPart = j.alias ? ` AS ${j.alias}` : '';
        return `${j.type ?? 'LEFT'} JOIN ${j.table}${aliasPart} ON ${j.on}`;
      })
      .join(' ');
  }

  private buildWhere(where?: Record<string, any>, startIdx = 1): { sql: string; values: any[] } {
    if (!where || !Object.keys(where).length) {
      return { sql: '', values: [] };
    }

    const process = (conditions: Record<string, any>, index: number): { clause: string; values: any[]; nextIndex: number } => {
      return Object.entries(conditions).reduce(
        (acc, [key, value]) => {
          // ===== OR SUPPORT =====
          if (key === 'OR' && Array.isArray(value)) {
            const orResult = value.reduce(
              (orAcc, cond) => {
                const res = process(cond, orAcc.nextIndex);

                return {
                  clauses: [...orAcc.clauses, `(${res.clause})`],
                  values: [...orAcc.values, ...res.values],
                  nextIndex: res.nextIndex,
                };
              },
              { clauses: [] as string[], values: [] as any[], nextIndex: acc.nextIndex }
            );

            const clause = `(${orResult.clauses.join(' OR ')})`;

            return {
              clause: acc.clause ? `${acc.clause} AND ${clause}` : clause,
              values: [...acc.values, ...orResult.values],
              nextIndex: orResult.nextIndex,
            };
          }

          // ===== NULL SUPPORT =====
          if (value === null) {
            const clause = `${key} IS NULL`;

            return {
              clause: acc.clause ? `${acc.clause} AND ${clause}` : clause,
              values: acc.values,
              nextIndex: acc.nextIndex,
            };
          }

          // ===== NOT NULL SUPPORT =====
          if (value === '__NOT_NULL__') {
            const clause = `${key} IS NOT NULL`;

            return {
              clause: acc.clause ? `${acc.clause} AND ${clause}` : clause,
              values: acc.values,
              nextIndex: acc.nextIndex,
            };
          }

          const paramIndex = acc.nextIndex;

          // ===== ARRAY (IN) SUPPORT =====
          if (Array.isArray(value)) {
            const clause = `${key} = ANY($${paramIndex})`;

            return {
              clause: acc.clause ? `${acc.clause} AND ${clause}` : clause,
              values: [...acc.values, value],
              nextIndex: acc.nextIndex + 1,
            };
          }

          // ===== DEFAULT "=" =====
          const clause = `${key} = $${paramIndex}`;

          return {
            clause: acc.clause ? `${acc.clause} AND ${clause}` : clause,
            values: [...acc.values, value],
            nextIndex: acc.nextIndex + 1,
          };
        },
        { clause: '', values: [] as any[], nextIndex: index }
      );
    };

    const { clause, values } = process(where, startIdx);

    return {
      sql: clause ? `WHERE ${clause}` : '',
      values,
    };
  }

  private buildSetClause(data: Partial<T>) {
    const keys = Object.keys(data);
    const setClause = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
    const values = Object.values(data);
    return { setClause, values };
  }
}
