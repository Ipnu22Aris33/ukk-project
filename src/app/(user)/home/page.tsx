'use client';

import { Box, Container, Flex, Grid, Separator } from '@radix-ui/themes';
import { GreetingSection } from './_components/GreetingSection';
import { StatsSection } from './_components/StatsSection';
import { ActiveLoans } from './_components/ActiveLoans';
import { ActiveReservations } from './_components/ActiveReservations';

export default function HomePage() {
  return (
    <Box className='min-h-screen bg-gray-2'>
      <Container size='4' py='6'>
        <Flex direction='column' gap='6'>
          {/* HEADER */}
          <GreetingSection />

          {/* STATS */}
          <StatsSection />

          {/* SEPARATOR BIAR ADA PEMISAH VISUAL */}
          <Separator size='4' />

          {/* MAIN CONTENT */}
          <Grid columns={{ initial: '1', md: '2' }} gap='5' align='start'>
            <Box className='space-y-4'>
              <ActiveLoans />
            </Box>

            <Box className='space-y-4'>
              <ActiveReservations />
            </Box>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
}
