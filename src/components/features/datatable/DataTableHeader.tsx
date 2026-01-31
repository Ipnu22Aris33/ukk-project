'use client';

import React from 'react';
import { Heading, Text, Flex, Box, DropdownMenu, IconButton, Button } from '@radix-ui/themes';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

interface DataTableHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function DataTableHeader({ title, description, actions }: DataTableHeaderProps) {
  return (
    <Box mb='6'>
      <Flex direction='row' justify='between' align='center' gap='4'>
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

        {/* Kanan: Actions - selalu di pojok kanan */}
        {actions && (
          <>
            {/* Desktop Actions - tampil horizontal */}
            <Flex gap='3' align='center' display={{ initial: 'none', sm: 'flex' }}>
              {actions}
            </Flex>

            {/* Mobile Actions - dropdown vertikal */}
            <Box display={{ initial: 'block', sm: 'none' }}>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <IconButton variant='soft' size='2'>
        <DotsHorizontalIcon />
      </IconButton>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
      <Flex direction="column" gap="2">
        {React.Children.toArray(actions).map((action, index) => (
          <React.Fragment key={index}>
            {action}
          </React.Fragment>
        ))}
      </Flex>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Box>
          </>
        )}
      </Flex>
    </Box>
  );
}
