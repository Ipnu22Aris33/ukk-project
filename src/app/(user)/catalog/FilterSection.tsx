'use client';

import { useState } from 'react';
import { Card, Flex, Box, TextField, Popover, Button, Text, ScrollArea, CheckboxGroup, Separator, Badge } from '@radix-ui/themes';
import { MagnifyingGlassIcon, MixerHorizontalIcon, ChevronDownIcon, Cross2Icon } from '@radix-ui/react-icons';

interface FilterProps {
  onFilterChange: (newFilters: any) => void;
  categories: any[];
  isLoadingCats: boolean;
}

export function FilterSection({ onFilterChange, categories, isLoadingCats }: FilterProps) {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleApplyFilter = () => {
    onFilterChange({
      search: search || undefined,
      category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    });
  };

  const handleRemoveCategory = (id: string) => {
    const next = selectedCategories.filter((item) => item !== id);
    setSelectedCategories(next);
    onFilterChange({
      search: search || undefined,
      category: next.length > 0 ? next.join(',') : undefined,
    });
  };

  return (
    <>
      <Card size='2' mb='4'>
        {/* 🔥 Container Utama: Pakai overflowX agar bisa scroll horizontal di mobile */}
        <Flex
          gap='3'
          align='center'
          style={{
            overflowX: 'auto',
            paddingBottom: '2px', // Space buat scrollbar tipis
            WebkitOverflowScrolling: 'touch', // Smooth scroll di iOS
          }}
        >
          {/* SEARCH INPUT: Beri minWidth agar tidak gepeng saat horizontal */}
          <Box style={{ flexGrow: 1, minWidth: '200px' }}>
            <TextField.Root
              placeholder='Cari buku...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height='16' width='16' />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          {/* FILTER BUTTON: Tetap horizontal */}
          <Popover.Root>
            <Popover.Trigger>
              <Button variant='outline' color='gray' style={{ flexShrink: 0 }}>
                <Flex align='center' gap='2'>
                  <MixerHorizontalIcon />

                  {/* 🔥 Bungkus pakai Box karena Box pasti dukung prop 'display' responsive */}
                  <Box display={{ initial: 'none', sm: 'inline' }}>
                    <Text size='2'>{selectedCategories.length === 0 ? 'Semua Kategori' : `${selectedCategories.length} Terpilih`}</Text>
                  </Box>

                  {/* Indikator angka buat mobile (opsional tapi ngebantu) */}
                  {selectedCategories.length > 0 && (
                    <Box display={{ initial: 'inline', sm: 'none' }}>
                      <Badge variant='solid' radius='full' size='1'>
                        {selectedCategories.length}
                      </Badge>
                    </Box>
                  )}
                </Flex>
                <ChevronDownIcon />
              </Button>
            </Popover.Trigger>
            {/* Popover Content tetap sama */}
            <Popover.Content style={{ width: 250 }}>
              <Text size='2' weight='bold' mb='2' as='div'>
                Filter Kategori
              </Text>
              <ScrollArea scrollbars='vertical' style={{ height: 200 }}>
                <CheckboxGroup.Root value={selectedCategories} onValueChange={setSelectedCategories}>
                  <Flex direction='column' gap='2'>
                    {isLoadingCats ? (
                      <Text size='1'>Loading...</Text>
                    ) : (
                      categories.map((cat: any) => (
                        <CheckboxGroup.Item key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </CheckboxGroup.Item>
                      ))
                    )}
                  </Flex>
                </CheckboxGroup.Root>
              </ScrollArea>
              <Separator size='4' my='3' />
              <Flex gap='2' justify='end'>
                <Button variant='soft' color='gray' size='1' onClick={() => setSelectedCategories([])}>
                  Reset
                </Button>
                <Popover.Close>
                  <Button size='1' onClick={handleApplyFilter}>
                    Terapkan
                  </Button>
                </Popover.Close>
              </Flex>
            </Popover.Content>
          </Popover.Root>

          {/* Tombol Cari */}
          <Button size='2' onClick={handleApplyFilter} style={{ flexShrink: 0 }}>
            Cari
          </Button>
        </Flex>
      </Card>

      {/* BADGES: Juga dibikin scrollable horizontal agar tidak baris-berbaris ke bawah */}
      {selectedCategories.length > 0 && (
        <Flex
          gap='2'
          mb='4'
          align='center'
          style={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: '4px',
          }}
        >
          <Text size='1' color='gray' style={{ flexShrink: 0 }}>
            Kategori:
          </Text>
          {selectedCategories.map((id) => (
            <Badge key={id} color='violet' variant='soft' size='2' radius='full' style={{ flexShrink: 0 }}>
              {categories.find((c: any) => String(c.id) === id)?.name}
              <Box style={{ cursor: 'pointer', display: 'inline-flex', marginLeft: 4 }} onClick={() => handleRemoveCategory(id)}>
                <Cross2Icon width='12' height='12' />
              </Box>
            </Badge>
          ))}
        </Flex>
      )}
    </>
  );
}
