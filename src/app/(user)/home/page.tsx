'use client';

import { Box, Container, Flex, Grid } from '@radix-ui/themes';
import { GreetingSection } from './_components/GreetingSection';
import { StatsSection } from './_components/StatsSection';
import { ActiveLoans } from './_components/ActiveLoans';
import { ActiveReservations } from './_components/ActiveReservations';

export default function HomePage() {
  return (
    <Box className='min-h-screen bg-grayA-1 w-full'>
      <Container size='4' px={{ initial: '4', md: '0' }} py='6'>
        <Flex direction='column' gap='6' className='w-full'>
          <GreetingSection />

          <StatsSection />

          <Grid columns={{ initial: '1', md: '2', lg: '1fr 1fr' }} gap='6' width='100%' align='start'>
            <ActiveLoans />

            <ActiveReservations/>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
}
