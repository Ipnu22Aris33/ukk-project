'use client';

import { Icon } from '@iconify/react';
import { Flex, Heading, Button, Badge, DropdownMenu, IconButton } from '@radix-ui/themes';
import { ThemeToggle } from '../ui/ThemeToggle';
import { AppIcon } from '../ui/AppIcon';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean; // Tambahkan prop ini
  isMobile?: boolean; // Tambahkan prop ini
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed = false, isMobile = false }) => {
  // Tentukan icon berdasarkan state
  const getToggleIcon = () => {
    if (isMobile) {
      // Mobile: selalu hamburger menu
      return 'RiArrowRightDoubleLine';
    } else {
      // Desktop: arrow kiri/kanan berdasarkan collapsed state
      return sidebarCollapsed ? 'RiArrowLeftDoubleLine' : 'RiArrowRightDoubleLine';
    }
  };

  const getToggleTitle = () => {
    if (isMobile) {
      return sidebarCollapsed ? 'Open menu' : 'Close menu';
    } else {
      return sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
  };

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
        <IconButton
          variant='ghost'
          onClick={onToggleSidebar}
          title={getToggleTitle()}
          style={{
            transition: 'transform 0.2s ease',
          }}
        >
          <AppIcon name={getToggleIcon()} size={32} />
        </IconButton>
      </Flex>

      <Flex align='center' gap='3'>
        <ThemeToggle />
      </Flex>
    </Flex>
  );
};
