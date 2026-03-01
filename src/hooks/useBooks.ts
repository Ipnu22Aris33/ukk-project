import { createCRUD } from '@/hooks/useCRUD';
import { Book, BookResponse, CreateBookInput } from '@/lib/schema/book';

export const useBooks = createCRUD<CreateBookInput, BookResponse[], BookResponse>('/api/books', {
  resourceName: 'books',
  messages: {
    create: 'Buku berhasil ditambahkan!',
    update: 'Buku berhasil diperbarui!',
    delete: 'Buku berhasil dihapus!',
  },
});
