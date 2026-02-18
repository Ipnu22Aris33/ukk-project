'use client';

import { useState, useMemo } from 'react';
import { Popover, TextField, Box, Text, Flex, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ChevronLeftIcon } from '@radix-ui/react-icons';

interface Props {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SearchOverlay = ({ isMobile = false, onCloseMobile }: Props) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const books = ['Atomic Habits', 'Clean Code', 'Deep Work', 'Design Patterns', 'Refactoring'];

  const results = useMemo(() => {
    if (!query) return [];
    return books.filter((b) => b.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <Box style={{ width: '100%' }}>
      {/* MOBILE HEADER */}
      {isMobile && (
        <Flex align='center' gap='2' mb='3'>
          <IconButton variant='ghost' onClick={onCloseMobile}>
            <ChevronLeftIcon />
          </IconButton>
          <Text weight='bold'>Cari Buku</Text>
        </Flex>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <TextField.Root size='2' value={query} onFocus={() => setOpen(true)} onChange={(e) => setQuery(e.target.value)} placeholder='Cari buku...'>
          <TextField.Slot>
            <MagnifyingGlassIcon />
          </TextField.Slot>
        </TextField.Root>

        {open && (
          <Popover.Content
            align='start'
            sideOffset={6}
            style={{
              width: '100%',
              maxHeight: 250,
              overflowY: 'auto',
            }}
          >
            {query ? (
              results.length > 0 ? (
                results.map((item) => (
                  <Box
                    key={item}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setQuery(item);
                      setOpen(false);
                      if (isMobile && onCloseMobile) onCloseMobile();
                    }}
                  >
                    <Text size='2'>{item}</Text>
                  </Box>
                ))
              ) : (
                <Text size='2' color='gray'>
                  Tidak ditemukan
                </Text>
              )
            ) : (
              <Text size='2' color='gray'>
                Mulai ketik untuk mencari buku...
              </Text>
            )}
          </Popover.Content>
        )}
      </Popover.Root>
    </Box>
  );
};
