import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { AdminContent } from '@/components/layouts/AdminContent';
import { CreateForm } from './CreateForm';

export default function BooksPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <CreateForm />
      </AdminContent>
    </AdminContentWrapper>
  );
}
