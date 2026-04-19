'use client';

import { Tabs, Box } from '@radix-ui/themes';
import { useSearchParams, useRouter, useParams } from 'next/navigation';

import { AdminContent } from '@/components/layouts/AdminContent';
import { AdminContentWrapper } from '@/components/layouts/AdminContentWrapper';

import { MemberCard } from './_components/MemberCard';
import { MemberLoans } from './_components/MemberLoans';
import { MemberReservations } from './_components/MemberReservations';
import { MemberReturns } from './_components/MemberReturns';
import { start } from 'repl';

export default function Page() {
  const { code } = useParams();

  const searchParams = useSearchParams();
  const router = useRouter();

  const validTabs = ['reservation', 'loan', 'return'];
  const tab = validTabs.includes(searchParams.get('tab') || '') ? searchParams.get('tab')! : 'reservation';

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);

    router.replace(`?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <AdminContentWrapper columns={{ initial: '1', md: '1fr 2fr' }} align="start">
      <AdminContent padding={0}>
        <MemberCard code={code as string} />
      </AdminContent>

      <AdminContent>
        <Tabs.Root value={tab} onValueChange={handleTabChange}>
          <Tabs.List>
            <Tabs.Trigger value='reservation'>Reservations</Tabs.Trigger>
            <Tabs.Trigger value='loan'>Loans</Tabs.Trigger>
            <Tabs.Trigger value='return'>Returns</Tabs.Trigger>
          </Tabs.List>

          <Box pt='3'>
            <Tabs.Content value='reservation'>
              <MemberReservations code={code as string} />
            </Tabs.Content>

            <Tabs.Content value='loan'>
              <MemberLoans code={code as string} />
            </Tabs.Content>

            <Tabs.Content value='return'>
              <MemberReturns code={code as string} />
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </AdminContent>
    </AdminContentWrapper>
  );
}
