'use client';

import { ReactNode } from 'react';
import { Grid, GridProps } from '@radix-ui/themes';

type AdminContentWrapperProps = Omit<GridProps, 'columns' | 'gap'> & {
  children: ReactNode;
  columns?: GridProps['columns'];
  gap?: GridProps['gap'];
};

export function AdminContentWrapper({ children, columns = '1', gap = '4', ...props }: AdminContentWrapperProps) {
  return (
    <Grid columns={columns} gap={gap} style={{ width: '100%' }} {...props}>
      {children}
    </Grid>
  );
}
