import { createCRUD } from '@/hooks/useCRUD';
import { Book, CreateBookInput } from '@/lib/models/book';

export const useBooks = createCRUD<CreateBookInput, Book[], Book>('/api/books', {
  resourceName: 'books',
  messages: {
    create: 'Buku berhasil ditambahkan!',
    update: 'Buku berhasil diperbarui!',
    delete: 'Buku berhasil dihapus!',
  },
});
