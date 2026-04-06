import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { AdminContent } from '@/components/layouts/AdminContent';
import { BookTable } from './_components/BookTable';

export default function BooksPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <BookTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
