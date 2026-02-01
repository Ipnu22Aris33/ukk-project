'use client';

import { Icon } from '@iconify/react';
import { Flex, Text, Heading, Avatar, Button, Separator, Box, DropdownMenu, Badge, Popover } from '@radix-ui/themes';
import * as Collapsible from '@radix-ui/react-collapsible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useSession } from '@/hooks/useSession';
import { useAuth } from '@/hooks/useAuth';
import { Fragment } from 'react/jsx-runtime';

interface SidebarProps {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  onCloseMobile?: () => void;
}

type MenuItems =
  | {
      id: string;
      label: string;
      icon: string;
      href: string;
      children?: never;
    }
  | {
      id: string;
      label: string;
      icon: string;
      children: {
        id: string;
        label: string;
        icon?: string;
        href: string;
      }[];
      href?: never;
    };

const menuItems: MenuItems[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'radix-icons:dashboard', href: '/admin' },
  { id: 'users', label: 'Users', icon: 'radix-icons:person', href: '/users' },
  { id: 'orders', label: 'Orders', icon: 'mdi:cart-variant', href: '/orders' },
  {
    id: 'members',
    label: 'Members',
    icon: 'radix-icons:people',
    children: [
      { id: 'students', label: 'Students', href: '/admin/members/students' },
      { id: 'loan-create', label: 'New Loan', href: '/loans/new' },
    ],
  },
  {
    id: 'loans',
    label: 'Loans',
    icon: 'mdi:book-clock',
    children: [
      { id: 'loan-list', label: 'Loan List', href: '/loans' },
      { id: 'loan-create', label: 'New Loan', href: '/loans/new' },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, sidebarCollapsed, onCloseMobile }) => {
  const pathame = usePathname();
  const { logout, session } = useAuth();

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
      <Flex
        py='4'
        direction='column'
        gap='3'
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          minHeight: 0,
        }}
      >
        {menuItems.map((item) => {
          const pathname = usePathname();
          const isActive = pathname === item.href || item.children?.some((c) => pathname.startsWith(c.href));
          if (!item.children) {
            return (
              <Link key={item.id} href={item.href} style={{ textDecoration: 'none', display: 'block' }} onClick={onCloseMobile}>
                <Button
                  variant={isActive ? 'solid' : 'soft'}
                  style={{
                    justifyContent: 'flex-start',
                    padding: '10px',
                    width: '100%',
                    height: '50px',
                    overflow: 'hidden',
                  }}
                  title={sidebarCollapsed ? item.label : undefined}
                >
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
          }

          return (
            <Collapsible.Root key={item.id} defaultOpen={isActive}>
              {/* ===== TRIGGER (BUTTON UTAMA) ===== */}
              {sidebarCollapsed ? (
                // POPOVER MODE (ketika sidebar collapsed)
                <Popover.Root>
                  <Popover.Trigger>
                    <Button
                      variant={isActive ? 'solid' : 'soft'}
                      style={{
                        justifyContent: 'center',
                        padding: '10px',
                        width: '100%',
                        height: '50px',
                      }}
                      title={item.label}
                    >
                      <Icon icon={item.icon} width='18' height='18' />
                    </Button>
                  </Popover.Trigger>

                  <Popover.Content
                    side='right'
                    align='start'
                    sideOffset={8}
                    style={{
                      width: '160px',
                      padding: '6px',
                    }}
                  >
                    <Flex direction='column' gap='1'>
                      {/* Header */}
                      <Flex align='center' gap='2' px='2' py='1'>
                        <Icon icon={item.icon} width='14' height='14' style={{ flexShrink: 0 }} />
                        <Text
                          size='1'
                          weight='bold'
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </Text>
                      </Flex>

                      <Separator size='4' my='1' />

                      {/* Sub menu items */}
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;

                        return (
                          <Link key={child.id} href={child.href} onClick={onCloseMobile} style={{ textDecoration: 'none' }}>
                            <Button
                              variant={isChildActive ? 'solid' : 'soft'}
                              style={{
                                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                                padding: sidebarCollapsed ? '10px' : '10px 12px',
                                width: '100%',
                                overflow: 'hidden',
                              }}
                            >
                              <Text style={{ marginLeft: '10px' }}>{child.label}</Text>
                            </Button>
                          </Link>
                        );
                      })}
                    </Flex>
                  </Popover.Content>
                </Popover.Root>
              ) : (
                // COLLAPSIBLE MODE (ketika sidebar expanded)
                <>
                  <Collapsible.Trigger asChild>
                    <Button
                      variant={isActive ? 'solid' : 'soft'}
                      style={{
                        justifyContent: 'flex-start',
                        width: '100%',
                        height: '50px',
                      }}
                    >
                      <Flex align='center' gap='2' style={{ flex: 1, minWidth: 0 }}>
                        <Icon icon={item.icon} width='18' height='18' style={{ flexShrink: 0 }} />
                        <Text
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.label}
                        </Text>
                        <Icon icon='radix-icons:chevron-down' width='14' height='14' style={{ marginLeft: 'auto', flexShrink: 0 }} />
                      </Flex>
                    </Button>
                  </Collapsible.Trigger>

                  {/* ===== SUB MENU ===== */}
                  <Collapsible.Content>
                    <Flex direction='column' gap='2' mt='2' pl='4'>
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;

                        return (
                          <Button
                            key={child.id} // ✅ KEY DI SINI
                            asChild
                            variant={isChildActive ? 'solid' : 'soft'}
                            style={{
                              width: '100%',
                              textAlign: 'left',
                            }}
                          >
                            <Link href={child.href} onClick={onCloseMobile} style={{ textDecoration: 'none', width: '100%' }}>
                              <Text
                                size='2'
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  width: '100%',
                                  display: 'block',
                                }}
                              >
                                {child.label}
                              </Text>
                            </Link>
                          </Button>
                        );
                      })}
                    </Flex>
                  </Collapsible.Content>
                </>
              )}
            </Collapsible.Root>
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
                        {session?.email.split('@')[0]}
                      </Text>
                      <Badge color='green' size='1' style={{ padding: '0 4px' }}>
                        Admin
                      </Badge>
                    </Flex>
                    <Text size='1' color='gray' style={{ lineHeight: '1.2' }}>
                      {session?.email}
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
            <DropdownMenu.Item color='red' onClick={() => logout()}>
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
