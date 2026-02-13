'use client';

import { useState } from 'react';
import { Box, Flex, Container, Text, IconButton, TextField, Avatar, Badge, DropdownMenu } from '@radix-ui/themes';
import { MagnifyingGlassIcon, BellIcon, ArchiveIcon, ChevronLeftIcon, PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useResponsive } from '@/hooks/useResponsive';
import { ThemeToggle } from '../ui/ThemeToggle';
import { getInitials } from '@/lib/getInitials';

interface UserHeaderProps {
  schoolName: string;
  userName: string;
}

export const UserHeader = ({ schoolName, userName }: UserHeaderProps) => {
  const router = useRouter();
  const { isMobile } = useResponsive();
  const [searchOpen, setSearchOpen] = useState(false);
  const { logout, session } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backgroundColor: 'var(--color-panel-solid)',
        borderBottom: '1px solid var(--gray-6)',
      }}
    >
      <Container size='4' px={{ initial: '4', md: '0' }}>
        <Flex align='center' justify='between' py='3'>
          {/* ===== LEFT ===== */}
          <Flex align='center' gap='3'>
            <Box
              style={{
                background: 'linear-gradient(135deg, var(--indigo-9), var(--purple-9))',
                padding: '8px',
                borderRadius: '10px',
              }}
            >
              <ArchiveIcon width='20' height='20' color='white' />
            </Box>

            {!isMobile && (
              <Box>
                <Text weight='bold' size='3'>
                  Perpustakaan Digital
                </Text>
                <Text size='1' color='gray'>
                  {schoolName}
                </Text>
              </Box>
            )}
          </Flex>

          {/* ===== RIGHT ===== */}
          <Flex align='center' gap='2'>
            {/* Desktop Search */}
            {!isMobile && (
              <TextField.Root
                size='2'
                placeholder='Cari buku...'
                style={{
                  width: '300px',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
            )}

            {/* Mobile Search */}
            {isMobile && (
              <IconButton size='2' variant='soft' onClick={() => setSearchOpen(true)}>
                <MagnifyingGlassIcon />
              </IconButton>
            )}

            {/* Theme Toggle */}
            <ThemeToggle variant='soft' />

            {/* Notification */}
            <Box style={{ position: 'relative' }}>
              <IconButton size='2' variant='soft'>
                <BellIcon />
              </IconButton>

              <Badge
                size='1'
                color='red'
                radius='full'
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                }}
              >
                3
              </Badge>
            </Box>

            {/* User Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton size='2' variant='soft' style={{ cursor: 'pointer' }}>
                  <Avatar size='1' fallback={getInitials(session?.name)} />
                </IconButton>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content
                align='end'
                style={{
                  backgroundColor: 'var(--color-panel-solid)',
                }}
              >
                <DropdownMenu.Label>{userName}</DropdownMenu.Label>
                <DropdownMenu.Separator />

                <DropdownMenu.Item>
                  <PersonIcon /> Profil
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  <GearIcon /> Pengaturan
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item color='red' onClick={handleLogout}>
                  <ExitIcon /> Keluar
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </Flex>
        </Flex>
      </Container>

      {/* ===== MOBILE SEARCH OVERLAY ===== */}
      {isMobile && searchOpen && (
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 50,
            padding: '12px',
            backgroundColor: 'var(--color-panel-solid)',
            borderBottom: '1px solid var(--gray-6)',
          }}
        >
          <Flex align='center' gap='2'>
            <IconButton variant='ghost' onClick={() => setSearchOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>

            <TextField.Root
              autoFocus
              size='2'
              style={{
                flex: 1,
                backgroundColor: 'var(--color-surface)',
              }}
              placeholder='Cari buku...'
            >
              <TextField.Slot>
                <MagnifyingGlassIcon />
              </TextField.Slot>
            </TextField.Root>
          </Flex>
        </Box>
      )}
    </Box>
  );
};
