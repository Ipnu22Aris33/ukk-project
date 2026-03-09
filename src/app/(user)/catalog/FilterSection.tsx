'use client';

import { useState } from 'react';
import {
  Flex,
  Card,
  TextField,
  Select,
  Button,
  Badge,
  Box,
  Tabs,
  Text
} from '@radix-ui/themes';
import {
  MagnifyingGlassIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';

// Kita akan menggunakan context nanti untuk share state dengan BookList
interface FilterSectionProps {
  onFilterChange?: (filters: any) => void;
}

export function FilterSection({ onFilterChange }: FilterSectionProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  const handleFilterChange = () => {
    onFilterChange?.({
      search,
      category: selectedCategory,
      language: selectedLanguage,
      tab: activeTab
    });
  };

  return (
    <>
      {/* Search and Filter */}
      <Card size="3" mb="5">
        <Flex direction={{ initial: 'column', md: 'row' }} gap="3">
          <Box style={{ flex: 1 }}>
            <TextField.Root 
              placeholder="Cari judul, penulis, atau ISBN..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                handleFilterChange();
              }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          
          <Box style={{ width: 240 }}>
            <Select.Root 
              value={selectedCategory} 
              onValueChange={(value) => {
                setSelectedCategory(value);
                handleFilterChange();
              }}
            >
              <Select.Trigger placeholder="Pilih kategori" />
              <Select.Content>
                <Select.Item value="all">Semua Kategori</Select.Item>
                {/* Categories akan diisi nanti berdasarkan data dari API */}
              </Select.Content>
            </Select.Root>
          </Box>

          <Box style={{ width: 180 }}>
            <Select.Root 
              value={selectedLanguage} 
              onValueChange={(value) => {
                setSelectedLanguage(value);
                handleFilterChange();
              }}
            >
              <Select.Trigger placeholder="Bahasa" />
              <Select.Content>
                <Select.Item value="all">Semua Bahasa</Select.Item>
                <Select.Item value="id">Indonesia</Select.Item>
                <Select.Item value="en">Inggris</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          <Button size="3" onClick={handleFilterChange}>
            Terapkan Filter
          </Button>
        </Flex>
      </Card>

      {/* Tabs Kategori */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} mb="5">
        <Tabs.List>
          <Tabs.Trigger value="all">Semua</Tabs.Trigger>
          <Tabs.Trigger value="popular">Populer</Tabs.Trigger>
          <Tabs.Trigger value="new">Terbaru</Tabs.Trigger>
          <Tabs.Trigger value="recommended">Rekomendasi</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || selectedLanguage !== 'all' || search) && (
        <Flex align="center" gap="2" wrap="wrap" mb="5">
          <Text size="2" style={{ color: 'var(--gray-11)' }}>Filter aktif:</Text>
          
          {selectedCategory !== 'all' && (
            <Badge size="2" color="violet" variant="soft" highContrast>
              <Flex align="center" gap="1">
                Kategori: {selectedCategory}
                <Box as="span" style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('all')}>
                  <Cross2Icon />
                </Box>
              </Flex>
            </Badge>
          )}

          {selectedLanguage !== 'all' && (
            <Badge size="2" color="gray" variant="soft">
              <Flex align="center" gap="1">
                Bahasa: {selectedLanguage === 'id' ? 'Indonesia' : 'Inggris'}
                <Box as="span" style={{ cursor: 'pointer' }} onClick={() => setSelectedLanguage('all')}>
                  <Cross2Icon />
                </Box>
              </Flex>
            </Badge>
          )}

          {search && (
            <Badge size="2" color="gray" variant="soft">
              <Flex align="center" gap="1">
                Pencarian: "{search}"
                <Box as="span" style={{ cursor: 'pointer' }} onClick={() => setSearch('')}>
                  <Cross2Icon />
                </Box>
              </Flex>
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="1" 
            style={{ color: 'var(--violet-11)' }}
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLanguage('all');
              setSearch('');
              setActiveTab('all');
            }}
          >
            Hapus semua
          </Button>
        </Flex>
      )}
    </>
  );
}