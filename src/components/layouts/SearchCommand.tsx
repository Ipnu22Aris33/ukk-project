'use client';

import { useState } from 'react';
import { Command } from 'cmdk';
import { Box, IconButton, Text, Flex } from '@radix-ui/themes';
import { MagnifyingGlassIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';
import { useBooks } from '@/hooks/useBooks';

export const SearchCommand = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const books = useBooks();
  const { data, isLoading } = books.list({ 
    search, 
    limit: 10,
    debounceMs: 300 
  });

  return (
    <>
      {/* Trigger Button */}
      <IconButton variant='soft' onClick={() => setOpen(true)}>
        <MagnifyingGlassIcon />
      </IconButton>

      <Command.Dialog 
        open={open} 
        onOpenChange={setOpen} 
        label='Cari Buku'
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false);
        }}
      >
        <Command.Input 
          placeholder='Cari judul buku...' 
          value={search}
          onValueChange={setSearch}
        />

        <Command.List>
          {isLoading && (
            <Command.Loading>Memuat...</Command.Loading>
          )}

          <Command.Empty>
            {search ? 'Tidak ditemukan.' : 'Ketik untuk mencari...'}
          </Command.Empty>

          {data?.data?.map((book) => (
            <Command.Item
              key={book.id}
              value={`${book.title} ${book.author}`}
              onSelect={() => {
                console.log('Selected:', book);
                setOpen(false);
                setSearch('');
                // Bisa tambah navigasi ke detail buku
                // router.push(`/books/${book.id}`);
              }}
            >
              <Flex align='center' gap='2'>
                <BookmarkFilledIcon />
                <Box>
                  <Text size='2' weight='bold'>{book.title}</Text>
                  <Text size='1' color='gray'>{book.author}</Text>
                </Box>
              </Flex>
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
};