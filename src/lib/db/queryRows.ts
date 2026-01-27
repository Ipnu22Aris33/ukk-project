import { mysqlPool } from '@/lib/db/mysql';
import { RowDataPacket } from 'mysql2/promise';

type JoinType = 'INNER' | 'LEFT' | 'RIGHT';

type JoinOption = {
  type?: JoinType;
  table: string;
  on: string;
};

export async function queryRows<T extends RowDataPacket = any>(options: {
  base: { table: string; select?: string };
  joins?: JoinOption[];
  where?: Record<string, any>;
  orderBy?: string;
  single?: boolean;
}): Promise<T | T[]> {
  const { base, joins = [], where = {}, orderBy, single = false } = options;

  const joinClause = joins.map((j) => `${j.type ?? 'INNER'} JOIN ${j.table} ON ${j.on}`).join(' ');

  const whereKeys = Object.keys(where);
  const whereClause = whereKeys.length ? 'WHERE ' + whereKeys.map((k) => `${k} = ?`).join(' AND ') : '';
  const params = whereKeys.map((k) => where[k]);

  const orderClause = orderBy ? `ORDER BY ${orderBy}` : '';
  const limitClause = single ? 'LIMIT 1' : '';

  const [rows]: any = await mysqlPool.query<T[]>(
    `SELECT ${base.select ?? '*'} FROM ${base.table} ${joinClause} ${whereClause} ${orderClause} ${limitClause}`,
    params
  );

  return single ? (rows[0] ?? null) : rows;
}
