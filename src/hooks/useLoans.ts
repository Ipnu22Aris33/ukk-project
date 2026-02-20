import { createCRUD } from '@/hooks/useCRUD';
import { Loan, CreateLoanInput } from '@/lib/schema/loan';

export const useLoans = createCRUD<CreateLoanInput, Loan[], Loan>('/api/loans', {
  resourceName: 'loans',
  messages: {
    create: 'Loan berhasil ditambahkan!',
    update: 'Loan berhasil diperbarui!',
    delete: 'Loan berhasil dihapus!',
  },
});
