import { Box, Card, Text, Tabs, Heading } from '@radix-ui/themes';
import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';
import { MemberCard } from './_components/MemberCard';
import { MemberLoans } from './_components/MemberLoans';
import { MemberReservations } from './_components/MemberReservations';

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return (
    <AdminContentWrapper columns={{ initial: '1', md: '1fr 2fr' }}>
      {/* LEFT */}
      <AdminContent>
        <MemberCard code={code} />
      </AdminContent>

      {/* RIGHT */}
      <AdminContent>
        <Tabs.Root defaultValue='reservation'>
          <Tabs.List>
            <Tabs.Trigger value='reservation'>Reservations</Tabs.Trigger>
            <Tabs.Trigger value='loan'>Loans</Tabs.Trigger>
          </Tabs.List>

          <Box pt='3'>
            <Tabs.Content value='reservation'>
              <MemberReservations code={code} />
            </Tabs.Content>

            <Tabs.Content value='loan'>
              <MemberLoans code={code} />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </AdminContent>
    </AdminContentWrapper>
  );
}
