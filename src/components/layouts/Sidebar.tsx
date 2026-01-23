'use client';

import { Icon } from '@iconify/react';
import { Flex, Text, Heading, Avatar, Button, Separator, Box } from '@radix-ui/themes';
import Link from 'next/link';

interface SidebarProps {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  onCloseMobile?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'radix-icons:dashboard', href: '/' },
  { id: 'analytics', label: 'Analytics', icon: 'radix-icons:bar-chart', href: '/analytics' },
  { id: 'users', label: 'Users', icon: 'radix-icons:person', href: '/users' },
  { id: 'orders', label: 'Orders', icon: 'mdi:cart-variant', href: '/orders' },
  { id: 'messages', label: 'Messages', icon: 'radix-icons:chat-bubble', href: '/messages' },
  { id: 'calendar', label: 'Calendar', icon: 'radix-icons:calendar', href: '/calendar' },
  { id: 'settings', label: 'Settings', icon: 'radix-icons:gear', href: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, sidebarCollapsed, onCloseMobile }) => {
  return (
    <Flex
      direction='column'
      style={{
        height: '100%',
        padding: isMobile ? '20px' : '20px',
        width: isMobile ? '250px' : sidebarCollapsed ? '70px' : '250px',
        transition: 'width 0.3s ease',
      }}
    >
      {/* Logo Section */}
      <Flex
        align='center'
        gap='3'
        style={{
          marginBottom: '30px',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          height: '32px',
        }}
      >
        <Icon icon='radix-icons:cube' width='24' height='24' />
        <Box
          style={{
            opacity: sidebarCollapsed ? 0 : 1,
            width: sidebarCollapsed ? '0' : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Heading size='4' style={{ marginLeft: '12px' }}>
            Dashboard
          </Heading>
        </Box>
      </Flex>

      {/* Menu Items */}
      <Flex direction='column' gap='3' style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <Link 
            key={item.id} 
            href={item.href} 
            style={{ 
              textDecoration: 'none',
              display: 'block',
            }}
            onClick={onCloseMobile}
          >
            <Button
              variant='ghost'
              style={{
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                padding: '10px 12px',
                height: '36px',
                width: '100%',
                overflow: 'hidden',
              }}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon icon={item.icon} width='18' height='18' />
              <Box
                style={{
                  opacity: sidebarCollapsed ? 0 : 1,
                  width: sidebarCollapsed ? '0' : 'auto',
                  overflow: 'hidden',
                  transition: 'opacity 0.3s ease, width 0.3s ease',
                  whiteSpace: 'nowrap',
                  marginLeft: '10px',
                }}
              >
                <Text>{item.label}</Text>
              </Box>
            </Button>
          </Link>
        ))}
      </Flex>

      {/* User Profile */}
      <Flex direction='column' gap='2' style={{ marginTop: 'auto' }}>
        <Separator size='4' />
        <Flex
          align='center'
          gap='3'
          style={{
            justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
            padding: '8px 0',
            height: '40px',
            overflow: 'hidden',
          }}
        >
          <Avatar
            size='2'
            src='https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
            fallback='A'
          />
          <Box
            style={{
              opacity: sidebarCollapsed ? 0 : 1,
              width: sidebarCollapsed ? '0' : 'auto',
              overflow: 'hidden',
              transition: 'opacity 0.3s ease, width 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <Text size='2' weight='bold'>
              Admin User
            </Text>
            <Text size='1' color='gray'>
              admin@example.com
            </Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};