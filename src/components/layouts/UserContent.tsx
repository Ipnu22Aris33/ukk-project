'use client';

import { ReactNode } from 'react';
import { Box, Container } from '@radix-ui/themes';

interface UserContentProps {
  children: ReactNode;
  className?: string;
}

export function UserContent({ children, className }: UserContentProps) {
  return (
    <Box className={className} style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
      <Container size='4'>{children}</Container>
    </Box>
  );
}
