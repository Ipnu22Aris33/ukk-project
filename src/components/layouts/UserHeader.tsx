'use client';

import { useState } from 'react';
import { Box, Flex, Container, Text, IconButton, Avatar, DropdownMenu, Badge } from '@radix-ui/themes';
import { BellIcon, ArchiveIcon, PersonIcon, GearIcon, ExitIcon, HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { ThemeToggle } from '../ui/ThemeToggle';
import { getInitials } from '@/lib/utils/getInitials';

import { DesktopSubNav } from './DesktopSubNav';
import { MobileDrawer } from './MobileDrawer';
import { SearchBox } from './SearchBox';

interface UserHeaderProps {
  schoolName: string;
  userName: string;
}

export const UserHeader = ({ schoolName, userName }: UserHeaderProps) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const { logout, session } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const menus = [
    { label: 'Home', href: '/home' },
    { label: 'Koleksi Buku', href: '/books' },
    { label: 'Peminjaman', href: '/loans' },
    { label: 'Riwayat', href: '/history' },
  ];

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--color-panel-solid)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* ── Main row ── */}
      <Box style={{ borderBottom: '1px solid var(--gray-a4)' }}>
        <Container size='4' px={{ initial: '4', md: '0' }}>
          <Flex align='center' py='3' gap='3'>
            {/* ── Logo ── */}
            <Flex align='center' gap='3' style={{ flexShrink: 0 }}>
              <Box
                style={{
                  background: 'linear-gradient(135deg, var(--indigo-9), var(--violet-9))',
                  padding: '8px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px var(--indigo-a4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ArchiveIcon width='18' height='18' color='white' />
              </Box>

              {!isMobile && (
                <Box>
                  <Text weight='bold' size='3' style={{ display: 'block', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                    Perpustakaan Digital
                  </Text>
                  <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.25 }}>
                    {schoolName}
                  </Text>
                </Box>
              )}
            </Flex>

            {/* ── Right actions ── */}
            <Flex align='center' gap='2' style={{ flex: 1, justifyContent: 'flex-end' }}>
              {/* Desktop search */}
              {!isMobile && (
                <Box style={{ width: 260 }}>
                  <SearchBox />
                </Box>
              )}

              {isMobile && (
                <IconButton
                  size='2'
                  variant={mobileSearchOpen ? 'solid' : 'soft'}
                  color={mobileSearchOpen ? 'indigo' : undefined}
                  onClick={() => setMobileSearchOpen((prev) => !prev)}
                  style={{ cursor: 'pointer' }}
                >
                  <MagnifyingGlassIcon />
                </IconButton>
              )}

              <ThemeToggle variant='soft' />

              {/* Notification */}
              <Box style={{ position: 'relative', flexShrink: 0 }}>
                <IconButton size='2' variant='soft' style={{ cursor: 'pointer' }}>
                  <BellIcon />
                </IconButton>
                <Badge
                  color='red'
                  radius='full'
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    pointerEvents: 'none',
                  }}
                >
                  3
                </Badge>
              </Box>

              {/* Mobile: search toggle */}

              {/* Mobile hamburger */}
              {isMobile && (
                <IconButton size='2' variant='soft' onClick={() => setMenuOpen(true)} style={{ cursor: 'pointer' }}>
                  <HamburgerMenuIcon />
                </IconButton>
              )}

              {/* User dropdown — desktop & mobile */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Box
                    style={{
                      cursor: 'pointer',
                      borderRadius: 999,
                      padding: 2,
                      background: 'linear-gradient(135deg, var(--indigo-8), var(--violet-8))',
                      display: 'inline-flex',
                      flexShrink: 0,
                    }}
                  >
                    <Avatar
                      size='2'
                      fallback={getInitials(session?.name)}
                      style={{
                        border: '2px solid var(--color-panel-solid)',
                        borderRadius: 999,
                        display: 'block',
                      }}
                    />
                  </Box>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content align='end' style={{ minWidth: 200 }} sideOffset={8}>
                  {/* User info */}
                  <Box px='3' py='3' style={{ borderBottom: '1px solid var(--gray-a4)' }}>
                    <Flex align='center' gap='3'>
                      <Avatar size='3' fallback={getInitials(session?.name)} style={{ borderRadius: 999, flexShrink: 0 }} />
                      <Box>
                        <Text size='2' weight='bold' style={{ display: 'block', lineHeight: 1.4 }}>
                          {userName}
                        </Text>
                        {session?.email && (
                          <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.4 }}>
                            {session.email}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  </Box>

                  <Box py='1'>
                    <DropdownMenu.Item>
                      <PersonIcon /> Profil Saya
                    </DropdownMenu.Item>
                    <DropdownMenu.Item>
                      <GearIcon /> Pengaturan
                    </DropdownMenu.Item>
                  </Box>

                  <DropdownMenu.Separator />

                  <DropdownMenu.Item color='red' onClick={handleLogout}>
                    <ExitIcon /> Keluar
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* ── Mobile search bar — slide down ── */}
      <AnimatePresence initial={false}>
        {isMobile && mobileSearchOpen && (
          <motion.div
            key='mobile-search-bar'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <Box
              style={{
                borderBottom: '1px solid var(--gray-a4)',
                backgroundColor: 'var(--color-panel-solid)',
              }}
            >
              <Container size='4' px={{ initial: '4', md: '0' }}>
                <Box py='3'>
                  <SearchBox onClose={() => setMobileSearchOpen(false)} autoFocus />
                </Box>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sub nav */}
      {!isMobile && <DesktopSubNav menus={menus} />}

      {/* Mobile drawer */}
      {isMobile && <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} menus={menus} />}
    </Box>
  );
};
