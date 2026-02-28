'use client';

import { Box, Container, Flex, Grid } from '@radix-ui/themes';
import { GreetingSection } from './GreetingSection';
import { StatsSection } from './StatsSection';
import { ActiveLoans } from './ActiveLoans';
import { QuickActions } from './QuickActions';
import { RecommendedBooks } from './RecommendedBooks';

export default function HomePage() {
  return (
    <Box className='min-h-screen bg-grayA-1 w-full'>
      <Container size='4' px={{ initial: '4', md: '0' }} py='6'>
        <Flex direction='column' gap='6' className='w-full'>
          <GreetingSection />

          <StatsSection />

          <Grid columns={{ initial: '1', md: '2', lg: '2fr 1fr' }} gap='6' width='100%' align='start'>
            <ActiveLoans />

            <Flex direction='column' gap='5' className='min-w-0'>
              <QuickActions />
              <RecommendedBooks />
            </Flex>
          </Grid>
        </Flex>
      </Container>
    </Box>
  );
}
