'use client';

import { useState } from 'react';
import { Box, Flex, Container, Text, IconButton, Avatar, DropdownMenu, Badge, Dialog, Button } from '@radix-ui/themes';
import { BellIcon, ArchiveIcon, PersonIcon, GearIcon, ExitIcon, HamburgerMenuIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react'; // Import Library QR

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { ThemeToggle } from '../ui/ThemeToggle';
import { getInitials } from '@/lib/utils/getInitials';

import { DesktopSubNav } from './DesktopSubNav';
import { MobileDrawer } from './MobileDrawer';
import { SearchBox } from './SearchBox';
import { useMembers } from '@/hooks/useMembers';

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

  // Nilai QR Code (Misal: ID Member atau URL profil)
  const member = useMembers();

  const { data } = member.getOne(session?.member?.id || '');
  const memberCode = data?.data.memberCode || 'No-Code';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  const menus = [
    { label: 'Home', href: '/home' },
    { label: 'Koleksi Buku', href: '/catalog' },
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
      <Box style={{ borderBottom: '1px solid var(--gray-a4)' }}>
        <Container size='4' px={{ initial: '4', md: '0' }}>
          <Flex align='center' py='3' gap='3'>
            {/* ── Logo / Hamburger ── */}
            <Flex align='center' gap='3' style={{ flexShrink: 0 }}>
              {isMobile ? (
                <IconButton size='2' variant='soft' onClick={() => setMenuOpen(true)} style={{ cursor: 'pointer' }}>
                  <HamburgerMenuIcon />
                </IconButton>
              ) : (
                <>
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

                  <Box>
                    <Text weight='bold' size='3' style={{ display: 'block', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                      Perpustakaan Digital
                    </Text>
                    <Text size='1' color='gray' style={{ display: 'block', lineHeight: 1.25 }}>
                      {schoolName}
                    </Text>
                  </Box>
                </>
              )}
            </Flex>

            {/* ── Right actions ── */}
            <Flex align='center' gap='2' style={{ flex: 1, justifyContent: 'flex-end' }}>
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

              {/* ── QR CODE MODAL ── */}
              <Dialog.Root>
                <Dialog.Trigger>
                  <IconButton size='2' variant='soft' color='indigo' style={{ cursor: 'pointer' }}>
                    {/* Menggunakan Icon QR (asumsi dari react-icons atau radix) */}
                    <Box style={{ transform: 'scale(1.2)' }}>
                      <svg width='15' height='15' viewBox='0 0 15 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M1 1H6V6H1V1ZM2 2V5H5V2H2ZM1 9H6V14H1V9ZM2 10V13H5V10H2ZM9 1H14V6H9V1ZM10 2V5H13V2H10ZM9 9H11V11H9V9ZM12 9H14V11H12V9ZM9 12H11V14H9V12ZM12 12H14V14H12V12ZM11 11H12V12H11V11Z'
                          fill='currentColor'
                          fillRule='evenodd'
                          clipRule='evenodd'
                        ></path>
                      </svg>
                    </Box>
                  </IconButton>
                </Dialog.Trigger>

                <Dialog.Content style={{ maxWidth: 350, textAlign: 'center' }}>
                  <Dialog.Title size='4'>Kartu Anggota Digital</Dialog.Title>
                  <Dialog.Description size='2' mb='4'>
                    Tunjukkan QR Code ini ke petugas perpustakaan.
                  </Dialog.Description>

                  <Flex direction='column' align='center' justify='center' gap='4' py='4'>
                    <Box
                      style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    >
                      <QRCodeSVG value={memberCode} size={200} level='H' />
                    </Box>

                    <Box>
                      <Text as='div' weight='bold' size='3'>
                        {userName}
                      </Text>
                      <Text as='div' color='gray' size='2'>
                        {memberCode}
                      </Text>
                    </Box>
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Tutup
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>

              {/* User dropdown */}
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
                      fallback={getInitials(session?.member?.fullName || userName)}
                      style={{
                        border: '2px solid var(--color-panel-solid)',
                        borderRadius: 999,
                        display: 'block',
                      }}
                    />
                  </Box>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content align='end' style={{ minWidth: 200 }} sideOffset={8}>
                  <Box px='3' py='3' style={{ borderBottom: '1px solid var(--gray-a4)' }}>
                    <Flex align='center' gap='3'>
                      <Avatar size='3' fallback={getInitials(session?.member?.fullName || userName)} style={{ borderRadius: 999, flexShrink: 0 }} />
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

      {/* Mobile search bar & Nav (tetap sama) */}
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

      {!isMobile && <DesktopSubNav menus={menus} />}
      {isMobile && <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} menus={menus} />}
    </Box>
  );
};
