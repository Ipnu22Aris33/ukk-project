'use client';

import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
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
  const [selectedValue, setSelectedValue] = useState('');
  const [dropdownTop, setDropdownTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

  const books = useBooks();
  const { data, isLoading } = books.list({
    search: query,
    limit: 10,
    debounceMs: 300,
  });

  // Auto-select item pertama setiap kali data berubah
  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setSelectedValue(`${data.data[0].title} ${data.data[0].author}`);
    } else {
      setSelectedValue('');
    }
  }, [data]);

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
    router.push(`/catalog/${book.slug}`);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    setSelectedValue('');
    setOpen(false);
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;

    if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
      e.preventDefault();
      const commandEl = commandRef.current;
      if (commandEl) {
        commandEl.dispatchEvent(
          new KeyboardEvent('keydown', { key: e.key, bubbles: true, cancelable: true })
        );
      }
    }

    if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
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
        onKeyDown={handleKeyDown}
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
            }}
          >
            <Command
              ref={commandRef}
              aria-label='Cari Buku'
              value={selectedValue}
              onValueChange={setSelectedValue}
              style={{
                background: 'transparent',
                padding: 0,
                width: '100%',
                maxHeight: '300px',
              }}
              shouldFilter={false}
            >
              <Command.List
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  padding: 0,
                }}
              >
                {!query ? (
                  <Command.Item
                    disabled
                    style={{ padding: '8px 12px', outline: 'none' }}
                  >
                    <Text size='2' color='gray'>
                      Silakan ketik untuk mencari…
                    </Text>
                  </Command.Item>
                ) : isLoading ? (
                  <Command.Item
                    disabled
                    style={{ padding: '8px 12px', outline: 'none' }}
                  >
                    <Text size='2' color='gray'>
                      Memuat...
                    </Text>
                  </Command.Item>
                ) : !data?.data || data.data.length === 0 ? (
                  <Command.Item
                    disabled
                    style={{ padding: '8px 12px', outline: 'none' }}
                  >
                    <Text size='2' color='gray'>
                      Tidak ditemukan.
                    </Text>
                  </Command.Item>
                ) : (
                  data.data.map((book) => {
                    const itemValue = `${book.title} ${book.author}`;
                    const isSelected = selectedValue === itemValue;
                    return (
                      <Command.Item
                        key={book.id}
                        value={itemValue}
                        onSelect={() => handleSelect(book)}
                        style={{
                          padding: '8px 12px',
                          cursor: 'pointer',
                          outline: 'none',
                          transition: 'background 0.15s',
                          backgroundColor: isSelected ? 'var(--accent-3)' : 'transparent',
                        }}
                        onMouseEnter={() => setSelectedValue(itemValue)}
                        onMouseLeave={() => {/* biarkan cmdk yang handle */}}
                      >
                        <Flex direction='column' gap='1'>
                          <Text size='2' weight='bold'>
                            {book.title}
                          </Text>
                          <Text size='1' color='gray'>
                            {book.author}
                          </Text>
                        </Flex>
                      </Command.Item>
                    );
                  })
                )}
              </Command.List>
            </Command>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}