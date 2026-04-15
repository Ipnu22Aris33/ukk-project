import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

type ExpiredRow = {
  book_id: number;
  quantity: number;
};

export async function processExpiredReservations() {
  return await db.transaction(async (trx) => {
    const expired = await trx.execute(sql<ExpiredRow>`
      UPDATE reservations
      SET status = 'expired',
          updated_at = NOW()
      WHERE status = 'pending'
        AND expires_at IS NOT NULL
        AND expires_at <= NOW()
        AND deleted_at IS NULL
      RETURNING book_id, quantity
    `);

    if (expired.length === 0) {
      return { total: 0 };
    }

    await trx.execute(sql`
      UPDATE books b
      SET 
        available_stock = b.available_stock + r.total_qty,
        reserved_stock = GREATEST(b.reserved_stock - r.total_qty, 0)
      FROM (
        SELECT book_id, SUM(quantity)::int AS total_qty
        FROM reservations
        WHERE status = 'expired'
          AND updated_at >= NOW() - INTERVAL '1 minute'
        GROUP BY book_id
      ) r
      WHERE b.id_book = r.book_id
    `);

    return {
      total: expired.length,
    };
  });
}
