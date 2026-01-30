import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { AppIcon } from '@/components/ui/AppIcon';

export default function AdminPage() {
  return (
    <AdminContentWrapper direction='column' gap='16px' autoWidth>
      <AdminContent>
        <AppIcon name='SvgSpinnersBlocksShuffle3'/>
        <h2>Card 1</h2>
        <p>Konten pertama</p>
      </AdminContent>

      <AdminContent>
        <h2>Card 2</h2>
        <p>Konten kedua</p>
      </AdminContent>
    </AdminContentWrapper>
  );
}
