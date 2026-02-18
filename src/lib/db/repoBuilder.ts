import { Pool } from 'pg';
import { pgPool } from './pg';
import { JoinOption, JoinOnOption, PaginateOption, PaginateResult, WhereOption, BulkInsertOption, CountOptions, QueryOptions } from './types';

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
  /**
   *
   * @param where
   * @param select
   * @param joins
   * @returns
   */
  async findOne(where: WhereOption, options?: QueryOptions) {
    const { sql, values } = this.buildWhere(where);
    const selectClause = Array.isArray(options?.select) ? options!.select.join(', ') : (options?.select ?? '*');

    const joinClause = this.buildJoinClause(options?.joins);

    const orderClause = options?.orderBy ? `ORDER BY ${options.orderBy}` : '';
    const limitClause = 'LIMIT 1';

    const query = `
    SELECT ${selectClause}
    FROM ${this.tableWithAlias}
    ${joinClause}
    ${sql}
    ${orderClause}
    ${limitClause}
  `;
    const result = await this.pool.query(query, values);
    return result.rows[0] ?? null;
  }

  async findByPk(pk: number | string, options?: QueryOptions) {
    return this.findOne(this.pkWhere(pk), options);
  }

  async findMany(where?: WhereOption, options?: QueryOptions) {
    const { sql, values } = this.buildWhere(where);
    const selectClause = Array.isArray(options?.select) ? options!.select.join(', ') : (options?.select ?? '*');

    const joinClause = this.buildJoinClause(options?.joins);

    const orderClause = options?.orderBy ? `ORDER BY ${options.orderBy}` : '';
    const limitClause = options?.limit ? `LIMIT ${options.limit}` : '';
    const offsetClause = options?.offset ? `OFFSET ${options.offset}` : '';

    const query = `
    SELECT ${selectClause}
    FROM ${this.tableWithAlias}
    ${joinClause}
    ${sql}
    ${orderClause}
    ${limitClause}
    ${offsetClause}
  `;

    const result = await this.pool.query(query, values);
    return result.rows;
  }

  /**
   *
   * @param data
   * @returns
   */
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

  async bulkInsert(items: Partial<T>[], options?: BulkInsertOption): Promise<T[]> {
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

  /**
   *
   * @param pk
   * @param data
   * @returns
   */
  async updateOne(where: WhereOption, data: Partial<T>) {
    const { setClause, values: setValues } = this.buildSetClause(data);
    const { sql: whereSql, values: whereValues } = this.buildWhere(where, setValues.length + 1);
    const query = `UPDATE ${this.table} SET ${setClause} ${whereSql} RETURNING *`;
    const result = await this.pool.query(query, [...setValues, ...whereValues]);
    return result.rows[0] ?? null;
  }

  async updateByPk(pk: number | string, data: Partial<T>) {
    return this.updateOne(this.pkWhere(pk), data);
  }

  async updateMany(where: WhereOption, data: Partial<T>) {
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

  /**
   *
   * @param where
   * @returns
   */
  async deleteOne(where: WhereOption) {
    const { sql, values } = this.buildWhere(where);
    const query = `UPDATE ${this.table} SET deleted_at=NOW() ${sql} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async deleteByPk(pk: number | string) {
    return this.deleteOne(this.pkWhere(pk));
  }

  async deleteMany(where: WhereOption) {
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

  /**
   *
   * @param where
   * @returns
   */
  async destroyOne(where: WhereOption) {
    const { sql, values } = this.buildWhere(where);
    const query = `DELETE FROM ${this.table} ${sql} RETURNING *`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async destroyByPk(pk: number | string) {
    return this.destroyOne(this.pkWhere(pk));
  }

  async destroyMany(where: WhereOption) {
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

  /**
   *
   * @param opts
   * @returns
   */
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

  /**
   *
   * @param where
   * @returns
   */
  async increment(where: WhereOption, column: string, amount: number = 1) {
    const col = this.escapeIdentifier(column);
    const { sql: whereSql, values: whereValues } = this.buildWhere(where, 2);

    const query = `UPDATE ${this.table} SET ${col} = ${col} + $1 ${whereSql} RETURNING *`;
    const result = await this.pool.query(query, [amount, ...whereValues]);
    return result.rows[0] ?? null;
  }

  async decrement(where: WhereOption, column: string, amount: number = 1) {
    return this.increment(where, column, -amount);
  }

  async count(where?: WhereOption, options?: CountOptions): Promise<number> {
    const joinClause = this.buildJoinClause(options?.joins);
    const { sql, values } = this.buildWhere(where);

    const query = `
    SELECT COUNT(*)::int AS total
    FROM ${this.tableWithAlias}
    ${joinClause}
    ${sql}
  `;

    const result = await this.pool.query(query, values);
    return result.rows[0]?.total ?? 0;
  }

  async countByPk(pk: string | number) {
    return this.count(this.pkWhere(pk));
  }

  async exists(where: WhereOption): Promise<boolean> {
    const { sql, values } = this.buildWhere(where);
    const query = `SELECT EXISTS(SELECT 1 FROM ${this.tableWithAlias} ${sql}) AS "exists"`;
    const result = await this.pool.query(query, values);
    return result.rows[0]?.exists ?? false;
  }

  async existsByPk(pk: string | number) {
    return this.exists(this.pkWhere(pk));
  }

  async lock(where: WhereOption): Promise<T[]> {
    const { sql, values } = this.buildWhere(where);
    const query = `SELECT * FROM ${this.tableWithAlias} ${sql} FOR UPDATE`;
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async lockByPk(pk: string | number): Promise<T[]> {
    return this.lock(this.pkWhere(pk));
  }

  /**
   * Private method
   * @returns
   */
  private get tableWithAlias() {
    return this.alias ? `${this.table} AS ${this.alias}` : this.table;
  }

  private pkWhere(pk: number | string): WhereOption {
    return { column: `${this.alias ?? this.table}.${this.pk}`, value: pk };
  }

  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }

    // Support schema.table or table.column
    return identifier
      .split('.')
      .map((part) => `"${part}"`)
      .join('.');
  }

  private buildJoinClause(joins?: JoinOption[]) {
    if (!joins?.length) return '';

    const allowedJoinTypes = ['INNER', 'LEFT', 'RIGHT'] as const;

    return joins
      .map((j) => {
        const type = j.type ?? 'LEFT';

        if (!allowedJoinTypes.includes(type)) {
          throw new Error(`Invalid join type: ${type}`);
        }

        const table = this.escapeIdentifier(j.table);
        const aliasPart = j.alias ? ` AS ${this.escapeIdentifier(j.alias)}` : '';

        const onClause = this.buildJoinOnClause(j.on);

        return `${type} JOIN ${table}${aliasPart} ON ${onClause}`;
      })
      .join(' ');
  }

  private buildJoinOnClause(on: JoinOnOption): string {
    const process = (node: JoinOnOption): string => {
      if ('AND' in node) {
        return node.AND.map((child) => `(${process(child)})`).join(' AND ');
      }

      if ('OR' in node) {
        return node.OR.map((child) => `(${process(child)})`).join(' OR ');
      }

      const operator = node.operator ?? '=';

      const left = this.escapeIdentifier(node.left);
      const right = this.escapeIdentifier(node.right);

      return `${left} ${operator} ${right}`;
    };

    return process(on);
  }

  private buildWhere(where?: WhereOption, startIdx = 1): { sql: string; values: any[] } {
    if (!where) return { sql: '', values: [] };

    const process = (node: WhereOption, index: number): { clause: string; values: any[]; nextIndex: number } => {
      // ===== AND =====
      if ('AND' in node) {
        return node.AND.reduce(
          (acc, child) => {
            const res = process(child, acc.nextIndex);

            return {
              clause: acc.clause ? `${acc.clause} AND (${res.clause})` : `(${res.clause})`,
              values: [...acc.values, ...res.values],
              nextIndex: res.nextIndex,
            };
          },
          { clause: '', values: [] as any[], nextIndex: index }
        );
      }

      // ===== OR =====
      if ('OR' in node) {
        return node.OR.reduce(
          (acc, child) => {
            const res = process(child, acc.nextIndex);

            return {
              clause: acc.clause ? `${acc.clause} OR (${res.clause})` : `(${res.clause})`,
              values: [...acc.values, ...res.values],
              nextIndex: res.nextIndex,
            };
          },
          { clause: '', values: [] as any[], nextIndex: index }
        );
      }

      // ===== SIMPLE CONDITION =====
      const { column, operator = '=', value, isNull, isNotNull } = node;

      const col = this.escapeIdentifier(column);

      if (isNull) {
        return { clause: `${col} IS NULL`, values: [], nextIndex: index };
      }

      if (isNotNull) {
        return { clause: `${col} IS NOT NULL`, values: [], nextIndex: index };
      }

      return {
        clause: `${col} ${operator} $${index}`,
        values: [value],
        nextIndex: index + 1,
      };
    };

    const { clause, values } = process(where, startIdx);

    return {
      sql: clause ? `WHERE ${clause}` : '',
      values,
    };
  }

  private buildSetClause(data: Partial<T>) {
    const keys = Object.keys(data);

    if (!keys.length) {
      throw new Error('No data provided');
    }

    const setClause = keys.map((k, i) => `${this.escapeIdentifier(k)}=$${i + 1}`).join(', ');

    const values = Object.values(data);

    return { setClause, values };
  }
}
