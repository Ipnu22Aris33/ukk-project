'use client';

import { Flex, Text, Heading, Avatar, Button, Separator, Box, DropdownMenu, Badge, Popover } from '@radix-ui/themes';
import Link from 'next/link';
import * as Collapsible from '@radix-ui/react-collapsible';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  BookX,
  Library,
  Users,
  FolderTree,
  LogOut,
  User,
  ChevronDown as ChevronDownIconLucide,
} from 'lucide-react';
import { LibraryBig } from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  sidebarCollapsed: boolean;
  onCloseMobile?: () => void;
}

interface MenuItemWithChildren {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    href: string;
  }[];
  href?: never;
}

interface MenuItemWithoutChildren {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  children?: never;
}

type MenuItems = MenuItemWithChildren | MenuItemWithoutChildren;

const menuItems: MenuItems[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
  { id: 'reservations', label: 'Reservasi', icon: <BookMarked size={20} />, href: '/admin/reservations' },
  { id: 'loans', label: 'Peminjaman', icon: <BookOpen size={20} />, href: '/admin/loans' },
  { id: 'returns', label: 'Pengembalian', icon: <BookX size={20} />, href: '/admin/returns' },
  {
    id: 'books',
    label: 'Buku',
    icon: <Library size={20} />,
    children: [
      { id: 'book-list', label: 'Daftar Buku', icon: <BookOpen size={18} />, href: '/admin/books' },
      { id: 'book-categories', label: 'Kategori', icon: <FolderTree size={18} />, href: '/admin/books/categories' },
    ],
  },
  { id: 'members', label: 'Anggota', icon: <Users size={20} />, href: '/admin/members' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isMobile, sidebarCollapsed, onCloseMobile }) => {
  const router = useRouter();
  const { logout, session } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

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
          justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
          height: '32px',
          position: 'relative',
          width: '100%',
          marginBottom: '16px',
        }}
      >
        <LibraryBig size={24}/>

        <Box
          style={{
            position: sidebarCollapsed ? 'absolute' : 'relative',
            left: sidebarCollapsed ? '100%' : '0',
            opacity: sidebarCollapsed ? 0 : 1,
            width: sidebarCollapsed ? '0' : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.3s ease, width 0.3s ease, left 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          <Heading size='4'>Dashboard</Heading>
        </Box>
      </Flex>

      <Separator
        size='4'
        style={{
          marginBottom: '16px',
          opacity: sidebarCollapsed ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

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
          const isActive =
            'href' in item
              ? pathname === item.href
              : pathname.startsWith(item.children[0]?.href) || item.children.some((c) => pathname.startsWith(c.href));

          if (!('children' in item)) {
            return (
              <Button
                asChild
                key={item.id}
                variant={isActive ? 'solid' : 'soft'}
                onClick={onCloseMobile}
                style={{
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  padding: sidebarCollapsed ? '10px 0' : '10px',
                  width: '100%',
                  height: '50px',
                  overflow: 'hidden',
                }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                    gap: sidebarCollapsed ? 0 : '10px',
                    width: '100%',
                  }}
                >
                  <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
                  {!sidebarCollapsed && <Text>{item.label}</Text>}
                </Link>
              </Button>
            );
          }

          return (
            <Collapsible.Root key={item.id} defaultOpen={isActive}>
              {sidebarCollapsed ? (
                <Popover.Root>
                  <Popover.Trigger>
                    <Button
                      variant={isActive ? 'solid' : 'soft'}
                      style={{
                        justifyContent: 'center',
                        padding: '10px 0',
                        width: '100%',
                        height: '50px',
                      }}
                      title={item.label}
                    >
                      <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
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
                      <Flex align='center' gap='2' px='2' py='1'>
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
                        <Text size='1' weight='bold' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </Text>
                      </Flex>

                      <Separator size='4' my='1' />

                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Button
                            key={child.id}
                            asChild
                            variant={isChildActive ? 'solid' : 'soft'}
                            onClick={onCloseMobile}
                            style={{
                              justifyContent: 'flex-start',
                              padding: '10px 12px',
                              width: '100%',
                              overflow: 'hidden',
                            }}
                          >
                            <Link
                              href={child.href}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                width: '100%',
                              }}
                            >
                              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{child.icon}</Box>
                              <Text
                                size='2'
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  width: '100%',
                                }}
                              >
                                {child.label}
                              </Text>
                            </Link>
                          </Button>
                        );
                      })}
                    </Flex>
                  </Popover.Content>
                </Popover.Root>
              ) : (
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
                        <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.icon}</Box>
                        <Text style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</Text>
                        <ChevronDownIcon style={{ marginLeft: 'auto' }} />
                      </Flex>
                    </Button>
                  </Collapsible.Trigger>

                  <Collapsible.Content>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <Flex direction='column' gap='1' mt='3'>
                        {item.children.map((child, index) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Box key={child.id} style={{ width: '100%' }}>
                              <Flex align='center' style={{ width: '100%' }}>
                                <ChevronRightIcon
                                  style={{
                                    transform: isChildActive ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s',
                                    marginRight: '4px',
                                  }}
                                />

                                <Button
                                  asChild
                                  variant={isChildActive ? 'solid' : 'soft'}
                                  style={{ flex: 1, textAlign: 'left' }}
                                  onClick={onCloseMobile}
                                >
                                  <Link
                                    href={child.href}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      width: '100%',
                                    }}
                                  >
                                    <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{child.icon}</Box>
                                    <Text
                                      size='2'
                                      style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        width: '100%',
                                      }}
                                    >
                                      {child.label}
                                    </Text>
                                  </Link>
                                </Button>
                              </Flex>

                              {index < item.children.length - 1 && <Separator orientation='horizontal' style={{ margin: '2px 0' }} />}
                            </Box>
                          );
                        })}
                      </Flex>
                    </motion.div>
                  </Collapsible.Content>
                </>
              )}
            </Collapsible.Root>
          );
        })}
      </Flex>

      {/* User Profile */}
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

              {!sidebarCollapsed && (
                <ChevronDownIconLucide
                  size={14}
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--gray-10)',
                  }}
                />
              )}
            </Flex>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            sideOffset={5}
            align='center'
            style={{
              minWidth: '200px',
            }}
          >
            {/* <DropdownMenu.Item>
              <Flex align='center' gap='2'>
                <User size={14} />
                <Text size='2'>My Profile</Text>
              </Flex>
            </DropdownMenu.Item>
            <DropdownMenu.Separator /> */}
            <DropdownMenu.Item color='red' onClick={() => handleLogout()}>
              <Flex align='center' gap='2'>
                <LogOut size={14} />
                <Text size='2'>Logout</Text>
              </Flex>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Flex>
    </Flex>
  );
};
