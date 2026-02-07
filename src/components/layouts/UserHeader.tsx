'use client';

import { useState } from 'react';
import { Box, Flex, Container, Text, IconButton, TextField, Avatar, Badge, DropdownMenu } from '@radix-ui/themes';
import { MagnifyingGlassIcon, BellIcon, ArchiveIcon, ChevronLeftIcon, PersonIcon, GearIcon, ExitIcon } from '@radix-ui/react-icons';

import { useResponsive } from '@/hooks/useResponsive';

interface UserHeaderProps {
  schoolName: string;
  userName: string;
}

export const UserHeader = ({ schoolName, userName }: UserHeaderProps) => {
  const { isMobile } = useResponsive();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Box
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'white',
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
              <TextField.Root size='2' placeholder='Cari buku...' style={{ width: '300px' }}>
                <TextField.Slot>
                  <MagnifyingGlassIcon />
                </TextField.Slot>
              </TextField.Root>
            )}

            {/* Search icon – mobile only */}
            {isMobile && (
              <IconButton size='2' variant='soft' onClick={() => setSearchOpen(true)}>
                <MagnifyingGlassIcon />
              </IconButton>
            )}

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
                  <Avatar size='1' fallback={userName[0]} style={{ width: '100%', height: '100%' }} />
                </IconButton>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content align='end'>
                <DropdownMenu.Label>{userName}</DropdownMenu.Label>
                <DropdownMenu.Separator />

                <DropdownMenu.Item>
                  <PersonIcon /> Profil
                </DropdownMenu.Item>

                <DropdownMenu.Item>
                  <GearIcon /> Pengaturan
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item color='red'>
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
            background: 'white',
            zIndex: 50,
            padding: '12px',
            borderBottom: '1px solid var(--gray-6)',
          }}
        >
          <Flex align='center' gap='2'>
            <IconButton variant='ghost' onClick={() => setSearchOpen(false)}>
              <ChevronLeftIcon />
            </IconButton>

            <TextField.Root autoFocus size='2' style={{ flex: 1 }} placeholder='Cari buku...'>
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
