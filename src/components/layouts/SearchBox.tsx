'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Box, Text, IconButton, Flex } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross2Icon } from '@radix-ui/react-icons';
import { AnimatePresence, motion } from 'framer-motion';
import { useResponsive } from '@/hooks/useResponsive';
import { useBooks } from '@/hooks/useBooks';

interface SearchBoxProps {
  onClose?: () => void;
  autoFocus?: boolean;
  onSelect?: (book: any) => void;
}

export function SearchBox({ onClose, autoFocus, onSelect }: SearchBoxProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dropdownTop, setDropdownTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useResponsive();

  const books = useBooks();
  const { data, isLoading } = books.list({
    search: query,
    limit: 10,
    debounceMs: 300,
  });

  // Hitung posisi top dropdown saat mobile (fixed positioning)
  const updateDropdownTop = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom + 6);
    }
  };

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update top saat scroll / resize (penting karena header sticky)
  useEffect(() => {
    if (!open || !isMobile) return;
    updateDropdownTop();
    window.addEventListener('scroll', updateDropdownTop, { passive: true });
    window.addEventListener('resize', updateDropdownTop);
    return () => {
      window.removeEventListener('scroll', updateDropdownTop);
      window.removeEventListener('resize', updateDropdownTop);
    };
  }, [open, isMobile]);

  const handleOpen = () => {
    updateDropdownTop();
    setOpen(true);
  };

  const handleSelect = (book: any) => {
    setQuery(book.title);
    setOpen(false);
    onSelect?.(book);

    router.push(`/catalog/${book.id}`);

    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setOpen(false);
    onClose?.();
  };

  const dropdownStyle = isMobile
    ? {
        position: 'fixed' as const,
        top: dropdownTop,
        left: 0,
        right: 0,
        zIndex: 999,
        margin: '0 12px',
      }
    : {
        position: 'absolute' as const,
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        zIndex: 999,
      };

  return (
    <Box ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <TextField.Root
        ref={inputRef}
        value={query}
        placeholder='Cari buku...'
        style={{ width: '100%' }}
        onFocus={handleOpen}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!open) handleOpen();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false);
            inputRef.current?.blur();
          }
        }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>

        {onClose && (
          <TextField.Slot>
            <IconButton size='1' variant='ghost' color='gray' onClick={handleClear}>
              <Cross2Icon />
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>

      <AnimatePresence>
        {open && (
          <motion.div
            key='dropdown'
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              ...dropdownStyle,
              backgroundColor: 'var(--color-panel-solid)',
              border: '1px solid var(--gray-6)',
              borderRadius: 'var(--radius-3)',
              boxShadow: 'var(--shadow-3)',
              overflow: 'hidden',
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {!query ? (
              <Box px='3' py='2'>
                <Text size='2' color='gray'>
                  Silakan ketik untuk mencari…
                </Text>
              </Box>
            ) : isLoading ? (
              <Box px='3' py='2'>
                <Text size='2' color='gray'>
                  Memuat...
                </Text>
              </Box>
            ) : !data?.data || data.data.length === 0 ? (
              <Box px='3' py='2'>
                <Text size='2' color='gray'>
                  Tidak ditemukan.
                </Text>
              </Box>
            ) : (
              data.data.map((book) => (
                <Box
                  key={book.id}
                  px='3'
                  py='2'
                  onClick={() => handleSelect(book)}
                  style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--gray-3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <Flex direction='column' gap='1'>
                    <Text size='2' weight='bold'>
                      {book.title}
                    </Text>
                    <Text size='1' color='gray'>
                      {book.author}
                    </Text>
                  </Flex>
                </Box>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
