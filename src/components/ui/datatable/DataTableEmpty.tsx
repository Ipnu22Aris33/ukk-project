'use client';

import React from 'react';
import { Box, Heading, Text } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface DataTableEmptyProps {
  title?: string;
  description?: string;
}

export function DataTableEmpty({ title = 'No data found', description = 'Try adjusting your search or filter' }: DataTableEmptyProps) {
  return (
    <Box py='8' style={{ textAlign: 'center' }}>
      <Box
        style={{
          margin: '0 auto',
          height: '48px',
          width: '48px',
          borderRadius: '50%',
          backgroundColor: 'var(--gray-3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
        }}
      >
        <MagnifyingGlassIcon style={{ height: '24px', width: '24px', color: 'var(--gray-10)' }} />
      </Box>
      <Heading size='4' weight='medium' mb='1'>
        {title}
      </Heading>
      <Text size='2' color='gray'>
        {description}
      </Text>
    </Box>
  );
}
