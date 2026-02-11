'use client';

import React from 'react';
import { Heading, Text, Box } from '@radix-ui/themes';

interface DataTableHeaderProps {
  title: string;
  description?: string;
}

export function DataTableHeader({ title, description }: DataTableHeaderProps) {
  return (
    <Box mb='6'>
      {/* Kiri: Title dan Description */}
      <Box>
        <Heading size={{ initial: '6', sm: '7' }} weight='bold'>
          {title}
        </Heading>
        {description && (
          <Text size='2' color='gray' mt='1'>
            {description}
          </Text>
        )}
      </Box>
    </Box>
  );
}