import { createCRUD } from '@/hooks/useCRUD';
import { ReturnResponse, CreateReturnInput } from '@/lib/schema/return';

export const useReturns = createCRUD<CreateReturnInput, ReturnResponse[], ReturnResponse>('/api/returns', {
  resourceName: 'returns',
  messages: {
    create: 'Return berhasil ditambahkan!',
    update: 'Return berhasil diperbarui!',
    delete: 'Return berhasil dihapus!',
  },
});
