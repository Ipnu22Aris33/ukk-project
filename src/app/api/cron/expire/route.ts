import { handleApi } from '@/lib/utils/handleApi';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

type ExpiredRow = {
  book_id: number;
  quantity: number;
};

export const GET = handleApi(async ({ req }) => {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return {
      success: false,
      message: 'Unauthorized',
      status: 401,
    };
  }

  const result = await db.transaction(async (trx) => {
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

  return {
    success: true,
    message:
      result.total === 0
        ? 'No expired reservations'
        : 'Expired reservations processed',
    data: result,
  };
});