'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, Flex, Text, IconButton } from '@radix-ui/themes';
import { Cross1Icon, ArchiveIcon } from '@radix-ui/react-icons';
import { useRouter, usePathname } from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
  menus: { label: string; href: string }[];
}

export const MobileDrawer = ({ open, onClose, menus }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  // Lock scroll saat drawer terbuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <>
      {/* Overlay */}
      <Box
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 200,
        }}
      />

      {/* Drawer */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100dvh',
          width: '75%',
          maxWidth: 300,
          backgroundColor: 'var(--gray-1)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '8px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="between"
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--gray-a4)',
          }}
        >
          <Flex align="center" gap="3">
            <Box
              style={{
                background:
                  'linear-gradient(135deg, var(--indigo-9), var(--violet-9))',
                padding: '8px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArchiveIcon width="16" height="16" color="white" />
            </Box>

            <Text size="4" weight="bold">
              Perpustakaan
            </Text>
          </Flex>

          <IconButton variant="ghost" size="2" onClick={onClose}>
            <Cross1Icon />
          </IconButton>
        </Flex>

        {/* Menu */}
        <Flex direction="column" style={{ flex: 1, padding: '12px', gap: 6 }}>
          {menus.map((menu) => {
            const active = pathname === menu.href;

            return (
              <Box
                key={menu.href}
                onClick={() => {
                  router.push(menu.href);
                  onClose();
                }}
                style={{
                  cursor: 'pointer',
                  borderRadius: 10,
                  backgroundColor: active
                    ? 'var(--indigo-a3)'
                    : 'var(--gray-a2)',
                  padding: '12px 16px',
                }}
              >
                <Text
                  size="3"
                  weight={active ? 'medium' : 'regular'}
                  style={{
                    color: active
                      ? 'var(--indigo-11)'
                      : 'var(--gray-12)',
                  }}
                >
                  {menu.label}
                </Text>
              </Box>
            );
          })}
        </Flex>
      </Box>
    </>,
    document.body
  );
};