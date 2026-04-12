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
      <Card size="3" mb="5">
        <Flex direction={{ initial: 'column', md: 'row' }} gap="3" align="center">
          <Box style={{ flex: 1, width: '100%' }}>
            <TextField.Root
              placeholder="Cari judul, penulis, atau ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>

          <Popover.Root>
            <Popover.Trigger>
              <Button variant="outline" color="gray" style={{ minWidth: 220, justifyContent: 'space-between' }}>
                <Flex align="center" gap="2">
                  <MixerHorizontalIcon />
                  <Text size="2">{selectedCategories.length === 0 ? 'Semua Kategori' : `${selectedCategories.length} Terpilih`}</Text>
                </Flex>
                <ChevronDownIcon />
              </Button>
            </Popover.Trigger>
            <Popover.Content style={{ width: 250 }}>
              <Text size="2" weight="bold" mb="2" as="div">Filter Kategori</Text>
              <ScrollArea scrollbars="vertical" style={{ height: 200 }}>
                <CheckboxGroup.Root value={selectedCategories} onValueChange={setSelectedCategories}>
                  <Flex direction="column" gap="2">
                    {isLoadingCats ? (
                      <Text size="1">Loading...</Text>
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
              <Separator size="4" my="3" />
              <Flex gap="2" justify="end">
                <Button variant="soft" color="gray" size="1" onClick={() => setSelectedCategories([])}>Reset</Button>
                <Popover.Close>
                  <Button size="1" onClick={handleApplyFilter}>Terapkan</Button>
                </Popover.Close>
              </Flex>
            </Popover.Content>
          </Popover.Root>

          <Button size="2" onClick={handleApplyFilter}>Cari</Button>
        </Flex>
      </Card>

      {selectedCategories.length > 0 && (
        <Flex gap="2" mb="4" wrap="wrap" align="center">
          <Text size="1" color="gray">Kategori aktif:</Text>
          {selectedCategories.map((id) => (
            <Badge key={id} color="violet" variant="soft" size="2" radius="full">
              {categories.find((c: any) => String(c.id) === id)?.name}
              <Box style={{ cursor: 'pointer', display: 'inline-flex', marginLeft: 4 }} onClick={() => handleRemoveCategory(id)}>
                <Cross2Icon width="12" height="12" />
              </Box>
            </Badge>
          ))}
        </Flex>
      )}
    </>
  );
}