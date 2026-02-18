import { handleApi } from '@/lib/utils/handleApi';
import { ok } from '@/lib/utils/apiResponse';
import { NotFound } from '@/lib/utils/httpErrors';
import { memberRepo, loanRepo, returnRepo, reservationRepo, col } from '@/lib/db';
import { WhereOption } from '@/lib/db/types';

export const GET = handleApi(async ({ params }) => {
  const id = params?.id;
  const memberId = Number(id);

  if (!memberId || Number.isNaN(memberId)) {
    throw new NotFound('Invalid member ID');
  }

  const member = await memberRepo.findByPk(memberId);

  if (!member) {
    throw new NotFound('Member not found');
  }

  // =====================
  // 🔹 LOANS SUMMARY
  // =====================
  const totalLoans = await loanRepo.count({
    AND: [
      { column: col('loans', 'memberId'), value: memberId },
      { column: col('loans', 'deletedAt'), isNull: true },
    ],
  });

  const activeLoans = await loanRepo.count({
    AND: [
      { column: col('loans', 'memberId'), value: memberId },
      { column: col('loans', 'deletedAt'), isNull: true },
      { column: col('loans', 'status'), value: 'borrowed' },
    ],
  });

  const returnedLoans = await loanRepo.count({
    AND: [
      { column: col('loans', 'memberId'), value: memberId },
      { column: col('loans', 'deletedAt'), isNull: true },
      { column: col('loans', 'status'), value: 'returned' },
    ],
  });

  const lateLoans = await loanRepo.count({
    AND: [
      { column: col('loans', 'memberId'), value: memberId },
      { column: col('loans', 'deletedAt'), isNull: true },
      { column: col('loans', 'status'), value: 'late' },
    ],
  });

  // =====================
  // 🔹 RETURNS (JOIN LOANS)
  // =====================
  const totalReturns = await returnRepo.count(
    {
      AND: [
        { column: col('loans', 'memberId'), value: memberId },
        { column: col('returns', 'deletedAt'), isNull: true },
        { column: col('loans', 'deletedAt'), isNull: true },
      ],
    },
    {
      joins: [
        {
          table: 'loans',
          alias: 'l',
          on: {
            left: col('returns', 'loanId'),
            right: col('loans', 'id'),
            operator: '=',
          },
        },
      ],
    }
  );

  // =====================
  // 🔹 RESERVATIONS
  // =====================
  const totalReservations = await reservationRepo.count({
    AND: [
      { column: col('reservations', 'memberId'), value: memberId },
      { column: col('reservations', 'deletedAt'), isNull: true },
    ],
  });

  return ok(
    {
      member,
      loans: {
        total: totalLoans,
        active: activeLoans,
        returned: returnedLoans,
        late: lateLoans,
      },
      returns: {
        total: totalReturns,
      },
      reservations: {
        total: totalReservations,
      },
    },
    { message: 'Member overview fetched successfully' }
  );
});
