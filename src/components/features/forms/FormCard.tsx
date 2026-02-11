'use client';

import { Card, Text, Box } from '@radix-ui/themes';

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function FormCard({ title, description, children, maxWidth = '400px' }: FormCardProps) {
  return (
    <Card size='3' style={{ maxWidth, width: '100%' }} className='bg-(--accent-1)'>
      <Box className='text-center mb-6'>
        <Text as='div' size='5' weight='bold' className='text-(--accent-9)'>
          {title}
        </Text>
        {description && (
          <Text as='p' size='2' color='gray' className='mt-2'>
            {description}
          </Text>
        )}
      </Box>
      {children}
    </Card>
  );
}
