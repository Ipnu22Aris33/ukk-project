import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { AppIcon } from '@/components/ui/AppIcon';
import { PaymentTable } from './Table';
import { ScrollArea } from '@radix-ui/themes';

export default function AdminPage() {
  return (
    <AdminContentWrapper>
      <AdminContent>
        <PaymentTable />
      </AdminContent>
    </AdminContentWrapper>
  );
}
