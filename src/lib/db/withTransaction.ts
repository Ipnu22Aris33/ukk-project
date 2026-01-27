import { mysqlPool } from '@/lib/db/mysql';

export async function withTransaction<T>(fn: (conn: any) => Promise<T>): Promise<T> {
  const conn = await mysqlPool.getConnection();

  try {
    await conn.beginTransaction();
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
