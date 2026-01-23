'use client';

import { Icon } from '@iconify/react';
import { Flex, Heading, Button, Badge, DropdownMenu } from '@radix-ui/themes';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  return (
    <Flex
      align='center'
      justify='between'
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--gray-5)',
        backgroundColor: 'var(--gray-1)',
        flexShrink: 0,
      }}
    >
      <Flex align='center' gap='3'>
        <Button variant='ghost' onClick={onToggleSidebar}>
          <Icon icon='radix-icons:hamburger-menu' width='20' height='20' />
        </Button>
        <Heading size='4'>Dashboard</Heading>
      </Flex>

      <Flex align='center' gap='3'>
        <Button variant='ghost'>
          <Icon icon='radix-icons:magnifying-glass' width='18' height='18' />
        </Button>
        <ThemeToggle />
        <Button variant='ghost' style={{ position: 'relative' }}>
          <Icon icon='radix-icons:bell' width='18' height='18' />
          <Badge
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              minWidth: '16px',
              height: '16px',
              padding: '0 4px',
            }}
            color='red'
            size='1'
          >
            3
          </Badge>
        </Button>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Button variant='ghost'>
              <Icon icon='radix-icons:gear' width='18' height='18' />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item>Settings</DropdownMenu.Item>
            <DropdownMenu.Item>Profile</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color='red'>Logout</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
};
