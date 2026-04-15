import { handleApi } from '@/lib/utils/handleApi';
import { processExpiredReservations } from '@/lib/jobs/processExpiredReservations';

export const GET = handleApi(async ({ req }) => {
  const authHeader = req.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return {
      success: false,
      message: 'Unauthorized',
      status: 401,
    };
  }

  const result = await processExpiredReservations();

  return {
    success: true,
    message:
      result.total === 0
        ? 'No expired reservations'
        : 'Expired reservations processed',
    data: result,
  };
});