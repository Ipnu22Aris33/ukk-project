import { createCRUD } from '@/hooks/useCRUD';
import { Book, BookResponse, CreateBookInput } from '@/lib/models/book';

export const useBooks = createCRUD<CreateBookInput, BookResponse[], Book>('/api/books', {
  resourceName: 'books',
  messages: {
    create: 'Buku berhasil ditambahkan!',
    update: 'Buku berhasil diperbarui!',
    delete: 'Buku berhasil dihapus!',
  },
});
