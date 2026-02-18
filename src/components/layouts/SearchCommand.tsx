'use client';

import { useState } from 'react';
import { Command } from 'cmdk';
import { Box, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export const SearchCommand = () => {
  const [open, setOpen] = useState(false);

  const books = [
    'Atomic Habits',
    'Clean Code',
    'Deep Work',
    'Design Patterns',
    'Refactoring',
  ];

  return (
    <>
      {/* Trigger Button */}
      <IconButton
        variant="soft"
        onClick={() => setOpen(true)}
      >
        <MagnifyingGlassIcon />
      </IconButton>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Cari Buku"
      >
        <Command.Input
          placeholder="Cari buku..."
        />

        <Command.List>
          <Command.Empty>
            Tidak ditemukan.
          </Command.Empty>

          {books.map((book) => (
            <Command.Item
              key={book}
              onSelect={() => {
                console.log(book);
                setOpen(false);
              }}
            >
              {book}
            </Command.Item>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
};
