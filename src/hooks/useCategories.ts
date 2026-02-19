import { createCRUD } from '@/hooks/useCRUD';
import { Category, CreateCategoryInput } from '@/lib/models/category';

export const useCategories = createCRUD<CreateCategoryInput, Category[], Category>('/api/books/categories', {
  resourceName: 'categories',
  messages: {
    create: 'Category berhasil ditambahkan!',
    update: 'Category berhasil diperbarui!',
    delete: 'Category berhasil dihapus!',
  },
});
