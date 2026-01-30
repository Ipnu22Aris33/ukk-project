'use client';

import { ReactNode } from 'react';
import { Box } from '@radix-ui/themes';

interface AdminContentProps {
  children: ReactNode;
  padding?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export function AdminContent({ children, padding = '16px', className = '', style }: AdminContentProps) {
  return (
    <Box
      className={className}
      style={{
        padding,
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'var(--gray-3)',
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
