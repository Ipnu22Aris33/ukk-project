import { Pool } from 'pg';
import { pgPool } from './pg';

export async function withTransaction<T>(callback: () => Promise<T>, pool: Pool = pgPool): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback();
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
