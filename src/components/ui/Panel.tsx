'use client';

import { Box, Flex, Heading, Button, Separator } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useEffect, useId } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

export interface PanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;

  width?: number | string;
  position?: 'right' | 'left';
}

export function Panel({ open, onClose, title, children, width = 420, position = 'right' }: PanelProps) {
  const { isMobile } = useResponsive();
  const autoId = useId();
  const panelId = `panel-${autoId}`;
  const panelWidth = typeof width === 'number' ? `${width}px` : width;

  /* ESC close */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };

    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <Box
      role='dialog'
      aria-modal='true'
      aria-labelledby={`${panelId}-title`}
      className={`
        fixed top-0 bottom-0 z-50
        flex flex-col
        shadow-xl
        transition-transform duration-300 ease-out
        ${position === 'right' ? 'right-0' : 'left-0'}
        ${open ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'}
      `}
      style={{
        width: isMobile ? '100%' : panelWidth,
        maxWidth: '100%',
        height: '100dvh',
        background: 'var(--color-panel-solid)',
      }}
    >
      {/* Header - fixed */}
      <Flex justify='between' align='center' px='6' py='5' className='shrink-0'>
        <Heading size={isMobile ? '5' : '4'} id={`${panelId}-title`}>
          {title}
        </Heading>

        <Button variant='ghost' color='gray' size='2' onClick={onClose}>
          <Cross1Icon />
        </Button>
      </Flex>

      <Separator size='4' className='shrink-0' />

      {/* Content - scrollable */}
      <Box
        px='6'
        py='5'
        className='flex-1 overflow-y-auto min-h-0'
        style={{
          height: '100%',
          maxHeight: 'calc(100dvh - 120px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
