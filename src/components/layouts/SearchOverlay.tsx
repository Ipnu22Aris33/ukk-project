'use client';

import { useState, useMemo, useEffect } from 'react';
import { Popover, TextField, Box, Text, Flex, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, ChevronLeftIcon } from '@radix-ui/react-icons';
import { useBooks } from '@/hooks/useBooks';

interface Props {
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SearchOverlay = ({ isMobile = false, onCloseMobile }: Props) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const books = useBooks();
  const { data, isLoading } = books.list({
    search: query,
    limit: 10,
    debounceMs: 300,
  });

  // Auto close on mobile when selecting
  const handleSelectBook = (bookTitle: string) => {
    setQuery(bookTitle);
    setOpen(false);
    if (isMobile && onCloseMobile) onCloseMobile();
  };

  // Close popover on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

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
              isLoading ? (
                <Text size='2' color='gray'>
                  Memuat...
                </Text>
              ) : data?.data && data.data.length > 0 ? (
                data.data.map((book) => (
                  <Box
                    key={book.id}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleSelectBook(book.title)}
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
