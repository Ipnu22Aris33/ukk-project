'use client';

import { Icon } from '@iconify/react';
import { Flex, Text, Heading, Avatar, Button, Separator, Box, DropdownMenu, Badge } from '@radix-ui/themes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  onCloseMobile?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'radix-icons:dashboard', href: '/admin' },
  { id: 'analytics', label: 'Analytics', icon: 'radix-icons:bar-chart', href: '/analytics' },
  { id: 'users', label: 'Users', icon: 'radix-icons:person', href: '/users' },
  { id: 'orders', label: 'Orders', icon: 'mdi:cart-variant', href: '/orders' },
  { id: 'messages', label: 'Messages', icon: 'radix-icons:chat-bubble', href: '/messages' },
  { id: 'calendar', label: 'Calendar', icon: 'radix-icons:calendar', href: '/calendar' },
  { id: 'settings', label: 'Settings', icon: 'radix-icons:gear', href: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, sidebarCollapsed, onCloseMobile }) => {
  const pathame = usePathname();
  return (
    <Flex
      direction='column'
      style={{
        height: '100%',
        padding: isMobile ? '10px' : '10px',
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
          position: 'relative',
          width: '100%',
        }}
      >
        <Icon icon='radix-icons:cube' width='24' height='24' />

        {/* Heading dengan absolute positioning saat expanded */}
        <Box
          style={{
            position: sidebarCollapsed ? 'absolute' : 'relative',
            left: sidebarCollapsed ? '100%' : '0',
            opacity: sidebarCollapsed ? 0 : 1,
            width: sidebarCollapsed ? '0' : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease, left 0.3s ease',
            whiteSpace: 'nowrap',
            marginLeft: '12px',
          }}
        >
          <Heading size='4'>Dashboard</Heading>
        </Box>
      </Flex>

      {/* Menu Items */}
      <Flex direction='column' gap='3' style={{ flex: 1 }}>
        {menuItems.map((item) => {
          const pathname = usePathname();
          const isActive = pathname === item.href;
          return (
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
                variant= {isActive ? 'solid' : 'soft'}
                style={{
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '10px' : '10px 12px',
                  width: '100%',
                  height: '50px',
                  overflow: 'hidden',
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {/* Icon Container - untuk alignment yang lebih baik */}
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    width: sidebarCollapsed ? '100%' : 'auto',
                  }}
                >
                  <Icon icon={item.icon} width='18' height='18' />
                  {!sidebarCollapsed && <Text style={{ marginLeft: '10px' }}>{item.label}</Text>}
                </Box>
              </Button>
            </Link>
          );
        })}
      </Flex>

      {/* User Profile - tetap seperti sebelumnya */}
      <Flex direction='column' gap='2' style={{ marginTop: 'auto' }}>
        <Separator size='4' />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Flex
              align='center'
              style={{
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                width: '100%',
                minHeight: '40px',
              }}
            >
              <Box
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  width: sidebarCollapsed ? '100%' : 'auto',
                }}
              >
                <Avatar
                  size='2'
                  src='https://api.dicebear.com/7.x/avataaars/svg'
                  fallback='A'
                  style={{
                    transition: 'transform 0.3s ease',
                  }}
                />
                <Box
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: sidebarCollapsed ? 'calc(50% - 18px)' : '0',
                    width: '8px',
                    height: '8px',
                    backgroundColor: 'var(--green-9)',
                    borderRadius: '50%',
                    border: '2px solid var(--gray-1)',
                    transition: 'right 0.3s ease',
                  }}
                />
              </Box>

              {/* User Info - hanya muncul saat expanded */}
              {!sidebarCollapsed && (
                <Box
                  style={{
                    opacity: 1,
                    width: '140px',
                    overflow: 'hidden',
                    transition: 'opacity 0.3s ease, width 0.3s ease',
                    whiteSpace: 'nowrap',
                    marginLeft: '12px',
                  }}
                >
                  <Flex direction='column' gap='1'>
                    <Flex align='center' gap='1'>
                      <Text size='2' weight='bold' style={{ lineHeight: '1.2' }}>
                        Admin User
                      </Text>
                      <Badge color='green' size='1' style={{ padding: '0 4px' }}>
                        Admin
                      </Badge>
                    </Flex>
                    <Text size='1' color='gray' style={{ lineHeight: '1.2' }}>
                      admin@example.com
                    </Text>
                  </Flex>
                </Box>
              )}

              {/* Chevron Icon - hanya muncul saat expanded */}
              {!sidebarCollapsed && (
                <Icon
                  icon='radix-icons:chevron-down'
                  width='14'
                  height='14'
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--gray-10)',
                  }}
                />
              )}
            </Flex>
          </DropdownMenu.Trigger>

          {/* Dropdown Content */}
          <DropdownMenu.Content
            sideOffset={5}
            align='center'
            style={{
              minWidth: '200px',
            }}
          >
            <DropdownMenu.Item>
              <Flex align='center' gap='2'>
                <Icon icon='radix-icons:person' width='14' height='14' />
                <Text size='2'>My Profile</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex align='center' gap='2'>
                <Icon icon='radix-icons:gear' width='14' height='14' />
                <Text size='2'>Settings</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Flex align='center' gap='2'>
                <Icon icon='radix-icons:question-mark' width='14' height='14' />
                <Text size='2'>Help & Support</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item color='red' onClick={() => console.log('Logout')}>
              <Flex align='center' gap='2'>
                <Icon icon='radix-icons:exit' width='14' height='14' />
                <Text size='2'>Logout</Text>
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
};
