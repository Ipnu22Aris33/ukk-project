'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, Flex, Text, IconButton } from '@radix-ui/themes';
import { Cross1Icon, ArchiveIcon } from '@radix-ui/react-icons';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  open: boolean;
  onClose: () => void;
  menus: { label: string; href: string }[];
}

export const MobileDrawer = ({ open, onClose, menus }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const content = (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key='overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />

          {/* Drawer */}
          <motion.div
            key='drawer'
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100dvh',
              width: '75%',
              maxWidth: 300,
              backgroundColor: 'var(--color-panel-solid)',
              zIndex: 201,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '8px 0 32px rgba(0,0,0,0.12)',
            }}
          >
            {/* Header */}
            <Flex
              align='center'
              justify='between'
              style={{
                padding: '20px 20px',
                borderBottom: '1px solid var(--gray-a4)',
                flexShrink: 0,
              }}
            >
              <Flex align='center' gap='3'>
                <Box
                  style={{
                    background: 'linear-gradient(135deg, var(--indigo-9), var(--violet-9))',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <ArchiveIcon width='16' height='16' color='white' />
                </Box>
                <Text size='4' weight='bold' style={{ letterSpacing: '-0.01em' }}>
                  Perpustakaan
                </Text>
              </Flex>

              <IconButton variant='ghost' size='2' onClick={onClose} style={{ cursor: 'pointer' }}>
                <Cross1Icon />
              </IconButton>
            </Flex>

            {/* Menu */}
            <Flex
              direction='column'
              style={{ flex: 1, padding: '12px 12px', gap: 4 }}
            >
              {menus.map((menu) => {
                const active = pathname === menu.href;

                return (
                  <Box
                    key={menu.href}
                    onClick={() => { router.push(menu.href); onClose(); }}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 10,
                      backgroundColor: active ? 'var(--indigo-a3)' : 'var(--gray-a2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      userSelect: 'none',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gray-a3)';
                    }}
                    onMouseLeave={(e) => {
                      if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gray-a2)';
                    }}
                  >
                    <Text
                      size='3'
                      weight={active ? 'medium' : 'regular'}
                      style={{ color: active ? 'var(--indigo-11)' : 'var(--gray-12)' }}
                    >
                      {menu.label}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof window === 'undefined') return null;
  return createPortal(content, document.body);
};