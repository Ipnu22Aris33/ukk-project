import { createCRUD } from '@/hooks/useCRUD';
import { Loan, CreateLoanInput, UpdateLoanInput, LoanResponse } from '@/lib/schema/loan';

export const useLoans = createCRUD<CreateLoanInput | UpdateLoanInput, LoanResponse[], LoanResponse>('/api/loans', {
  resourceName: 'loans',
  messages: {
    create: 'Loan berhasil ditambahkan!',
    update: 'Loan berhasil diperbarui!',
    delete: 'Loan berhasil dihapus!',
  },
});
