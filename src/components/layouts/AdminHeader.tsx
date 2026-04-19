'use client';

import { Flex, IconButton, Tooltip } from '@radix-ui/themes';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ScannerModal from './ScannerModal';
import { ScanLine, Menu, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed?: boolean;
  isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed = false, isMobile = false }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Tentukan icon berdasarkan state
  const getToggleIcon = () => {
    if (isMobile) {
      // Mobile: selalu hamburger menu
      return <Menu size={20} />;
    } else {
      // Desktop: arrow kiri/kanan berdasarkan collapsed state
      return sidebarCollapsed ? <ArrowRight size={20} /> : <ArrowLeft size={20} />;
    }
  };

  const getToggleTitle = () => {
    if (isMobile) {
      return sidebarCollapsed ? 'Open menu' : 'Close menu';
    } else {
      return sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
    }
  };

  return (
    <Flex
      align='center'
      justify='between'
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--gray-5)',
        backgroundColor: 'var(--gray-1)',
        flexShrink: 0,
      }}
    >
      <Flex align='center' gap='3'>
        <IconButton
          variant='ghost'
          onClick={onToggleSidebar}
          title={getToggleTitle()}
          style={{
            transition: 'transform 0.2s ease',
          }}
        >
          {getToggleIcon()}
        </IconButton>
      </Flex>

      <Flex align='center' gap='3'>
        <>
          <Tooltip content='Scan Barcode'>
            <IconButton variant='soft' onClick={() => setOpen(true)}>
              <ScanLine size={18} />
            </IconButton>
          </Tooltip>

          <ScannerModal
            open={open}
            onOpenChange={setOpen}
            onDetected={(value) => {
              router.push(`/admin/members/${value}`);
            }}
          />
        </>
        <Tooltip content='Theme'>
          <ThemeToggle />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
