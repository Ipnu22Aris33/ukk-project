import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { CategoryTable } from './_components/CategoryTable';

export default function CategoryPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <CategoryTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
