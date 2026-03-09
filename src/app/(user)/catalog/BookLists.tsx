'use client';

import { useState } from 'react';
import { 
  Grid,
  Card,
  Text,
  Flex,
  Badge,
  Box,
  Inset,
  DataList,
  Separator,
  Button,
  Strong,
  TextField,
  Select,
  Container,
  Heading
} from '@radix-ui/themes';

import {
  CalendarIcon,
  FileTextIcon,
  BookmarkIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  HeartIcon,
  Share1Icon,
  DotsHorizontalIcon,
  ReaderIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  Cross2Icon,
} from '@radix-ui/react-icons';

import { useBooks } from '@/hooks/useBooks';
import type { BookResponse } from '@/lib/schema/book';

// Fungsi untuk mendapatkan warna berdasarkan kategori
const getCategoryColor = (categoryName: string): string => {
  const colors: Record<string, string> = {
    'Komik': 'blue',
    'Novel': 'red',
    'Fiksi': 'green',
    'Non-Fiksi': 'amber',
    'Teknologi': 'purple',
    'Sejarah': 'indigo',
    'Biografi': 'bronze',
    'Anak': 'cyan',
  };
  
  return colors[categoryName] || 'gray';
};

// Komponen untuk loading state
function LoadingState() {
  return (
    <Flex direction="column" align="center" justify="center" py="9" gap="4">
      <Box p="4" style={{ background: 'var(--gray-3)', borderRadius: '50%' }}>
        <ReaderIcon width="48" height="48" style={{ color: 'var(--gray-9)' }} />
      </Box>
      <Text size="4" weight="medium" style={{ color: 'var(--gray-11)' }}>
        Memuat buku...
      </Text>
    </Flex>
  );
}

// Komponen untuk empty state
function EmptyState() {
  return (
    <Flex direction="column" align="center" justify="center" py="9" gap="4">
      <Box p="4" style={{ background: 'var(--gray-3)', borderRadius: '50%' }}>
        <ReaderIcon width="48" height="48" style={{ color: 'var(--gray-9)' }} />
      </Box>
      <Text size="4" weight="medium" style={{ color: 'var(--gray-11)' }}>
        Tidak ada buku yang ditemukan
      </Text>
      <Text size="2" style={{ color: 'var(--gray-10)' }}>
        Coba ubah filter atau kata kunci pencarian Anda
      </Text>
    </Flex>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export function BookList() {
  const books = useBooks();
  
  // State untuk filter yang sedang aktif (yang dipake buat fetch)
  const [activePage, setActivePage] = useState(1);
  const [activeSearch, setActiveSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [limit] = useState(9);
  
  // State untuk form filter (nilai sementara sebelum di-apply)
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State untuk menampilkan filter yang aktif
  const [showActiveFilters, setShowActiveFilters] = useState(false);
  
  // Fetch books dengan useBooks hook - pake active state
  const { data, isLoading, refetch } = books.list({
    page: activePage,
    search: activeSearch,
    limit,
    // Kalau API support filter category, tambahkan di sini
    // categoryId: activeCategory !== 'all' ? activeCategory : undefined,
  });

  // Apply filter - baru fetch data
  const applyFilters = () => {
    setActiveSearch(searchInput);
    setActiveCategory(selectedCategory);
    setActivePage(1); // Reset ke halaman pertama
    setShowActiveFilters(true);
  };

  // Handle clear individual filter
  const clearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setActivePage(1);
    if (selectedCategory === 'all' && !searchInput) {
      setShowActiveFilters(false);
    }
  };

  const clearCategory = () => {
    setSelectedCategory('all');
    setActiveCategory('all');
    setActivePage(1);
    if (!searchInput) {
      setShowActiveFilters(false);
    }
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSelectedCategory('all');
    setActiveSearch('');
    setActiveCategory('all');
    setActivePage(1);
    setShowActiveFilters(false);
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error handling
  if (!data && !isLoading) {
    return (
      <Flex direction="column" align="center" justify="center" py="9" gap="4">
        <Box p="4" style={{ background: 'var(--red-3)', borderRadius: '50%' }}>
          <CrossCircledIcon width="48" height="48" style={{ color: 'var(--red-9)' }} />
        </Box>
        <Text size="4" weight="medium" style={{ color: 'var(--red-11)' }}>
          Gagal memuat data buku
        </Text>
        <Button onClick={() => refetch()}>
          Coba Lagi
        </Button>
      </Flex>
    );
  }

  const booksData = data?.data ?? [];
  const meta = data?.meta;
  
  // Hitung statistik dari data yang ada
  const totalBooks = meta?.total || booksData.length;
  const availableBooks = booksData.filter(b => b.stock > 0).length;
  const totalCopies = booksData.reduce((acc, b) => acc + b.stock, 0);

  // Extract unique categories untuk filter
  const categories = Array.from(
    new Map(
      booksData.map(book => [book.category.id, book.category])
    ).values()
  );

  return (
    <Box>
      {/* Search and Filter Section - dengan tombol apply */}
      <Card size="3" mb="5">
        <Flex direction={{ initial: 'column', md: 'row' }} gap="3">
          <Box style={{ flex: 1 }}>
            <TextField.Root 
              placeholder="Cari judul, penulis, atau ISBN..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
            </TextField.Root>
          </Box>
          
          <Box style={{ width: 240 }}>
            <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
              <Select.Trigger placeholder="Pilih kategori" />
              <Select.Content>
                <Select.Item value="all">Semua Kategori</Select.Item>
                {categories.map((category) => (
                  <Select.Item key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Box>

          <Button size="3" onClick={applyFilters}>
            Terapkan Filter
          </Button>
        </Flex>
      </Card>

      {/* Active Filters - muncul setelah apply filter */}
      {showActiveFilters && (activeCategory !== 'all' || activeSearch) && (
        <Flex align="center" gap="2" wrap="wrap" mb="5">
          <Text size="2" style={{ color: 'var(--gray-11)' }}>Filter aktif:</Text>
          
          {activeCategory !== 'all' && (
            <Badge size="2" color="violet" variant="soft" highContrast>
              <Flex align="center" gap="1">
                Kategori: {categories.find(c => c.id.toString() === activeCategory)?.name}
                <Box as="span" style={{ cursor: 'pointer' }} onClick={clearCategory}>
                  <Cross2Icon />
                </Box>
              </Flex>
            </Badge>
          )}

          {activeSearch && (
            <Badge size="2" color="gray" variant="soft">
              <Flex align="center" gap="1">
                Pencarian: "{activeSearch}"
                <Box as="span" style={{ cursor: 'pointer' }} onClick={clearSearch}>
                  <Cross2Icon />
                </Box>
              </Flex>
            </Badge>
          )}

          <Button variant="ghost" size="1" style={{ color: 'var(--violet-11)' }} onClick={clearAllFilters}>
            Hapus semua
          </Button>
        </Flex>
      )}

      {/* Quick Stats */}
      <Grid columns="3" gap="4" style={{ maxWidth: 600 }} mb="5">
        <Card size="2">
          <Flex direction="column">
            <Text size="8" weight="bold">{totalBooks}</Text>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Buku</Text>
          </Flex>
        </Card>
        <Card size="2">
          <Flex direction="column">
            <Text size="8" weight="bold" style={{ color: 'var(--green-11)' }}>
              {availableBooks}
            </Text>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>Tersedia</Text>
          </Flex>
        </Card>
        <Card size="2">
          <Flex direction="column">
            <Text size="8" weight="bold" style={{ color: 'var(--amber-11)' }}>
              {totalCopies}
            </Text>
            <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Eksemplar</Text>
          </Flex>
        </Card>
      </Grid>

      {/* Empty State */}
      {booksData.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Books Grid */}
          <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="5" width="auto">
            {booksData.map((book) => {
              const categoryColor = getCategoryColor(book.category.name);
              
              return (
                <Card key={book.id} size="2">
                  <Inset clip="padding-box" side="top" pb="current">
                    {book.coverUrl ? (
                      <Box 
                        style={{ 
                          height: 160,
                          backgroundImage: `url(${book.coverUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        <Box style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%)' }} />
                        
                        <Flex 
                          direction="column" 
                          justify="end" 
                          style={{ height: '100%', position: 'relative', zIndex: 1, padding: 'var(--space-4)' }}
                        >
                          <Flex justify="between" align="center" mb="2">
                            <Badge color="gray" variant="solid" highContrast>
                              {book.category.name}
                            </Badge>
                          </Flex>
                          
                          <Text size="5" weight="bold" style={{ color: 'white' }}>
                            {book.title}
                          </Text>
                          <Text size="2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {book.author}
                          </Text>
                        </Flex>
                      </Box>
                    ) : (
                      <Box 
                        style={{ 
                          height: 160,
                          background: `linear-gradient(135deg, var(--${categoryColor}-9), var(--${categoryColor}-11))`,
                          padding: 'var(--space-4)',
                          position: 'relative'
                        }}
                      >
                        <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
                        
                        <Flex 
                          direction="column" 
                          justify="end" 
                          style={{ height: '100%', position: 'relative', zIndex: 1 }}
                        >
                          <Flex justify="between" align="center" mb="2">
                            <Badge color="gray" variant="solid" highContrast>
                              {book.category.name}
                            </Badge>
                          </Flex>
                          
                          <Text size="5" weight="bold" style={{ color: 'white' }}>
                            {book.title}
                          </Text>
                          <Text size="2" style={{ color: 'rgba(255,255,255,0.9)' }}>
                            {book.author}
                          </Text>
                        </Flex>
                      </Box>
                    )}
                  </Inset>

                  <Box pt="3">
                    <DataList.Root>
                      <DataList.Item>
                        <DataList.Label minWidth="88px">
                          <Flex align="center" gap="2">
                            <CalendarIcon /> Tahun
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>{book.year}</DataList.Value>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.Label minWidth="88px">
                          <Flex align="center" gap="2">
                            <FileTextIcon /> Penerbit
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>{book.publisher}</DataList.Value>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.Label minWidth="88px">
                          <Flex align="center" gap="2">
                            <BookmarkIcon /> ISBN
                          </Flex>
                        </DataList.Label>
                        <DataList.Value>{book.isbn}</DataList.Value>
                      </DataList.Item>
                    </DataList.Root>

                    <Separator size="4" my="3" />

                    <Flex justify="between" align="center">
                      <Text size="1" style={{ color: 'var(--gray-10)' }}>
                        {new Date(book.createdAt).toLocaleDateString('id-ID')}
                      </Text>

                      <Flex align="center" gap="3">
                        {book.stock > 0 ? (
                          <>
                            <Badge color="green" variant="soft" highContrast>
                              <Flex align="center" gap="1">
                                <CheckCircledIcon />
                                {book.stock} Tersedia
                              </Flex>
                            </Badge>
                            <Button size="2" variant="solid">
                              Pinjam
                            </Button>
                          </>
                        ) : (
                          <>
                            <Badge color="red" variant="soft">
                              <Flex align="center" gap="1">
                                <CrossCircledIcon />
                                Habis
                              </Flex>
                            </Badge>
                            <Button size="2" variant="soft" disabled>
                              Tidak Tersedia
                            </Button>
                          </>
                        )}
                      </Flex>
                    </Flex>

                    {/* Action Buttons */}
                    <Flex gap="2" mt="3">
                      <Button size="1" variant="ghost">
                        <HeartIcon />
                      </Button>
                      <Button size="1" variant="ghost">
                        <BookmarkIcon />
                      </Button>
                      <Button size="1" variant="ghost">
                        <Share1Icon />
                      </Button>
                      <Box style={{ flex: 1 }} />
                      <Button size="1" variant="ghost">
                        <DotsHorizontalIcon />
                      </Button>
                    </Flex>
                  </Box>
                </Card>
              );
            })}
          </Grid>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <Flex align="center" justify="between" mt="8" pt="5" style={{ borderTop: '1px solid var(--gray-5)' }}>
              <Text size="2" style={{ color: 'var(--gray-11)' }}>
                Menampilkan <Strong>{(meta.page - 1) * limit + 1}-{Math.min(meta.page * limit, meta.total)}</Strong> dari <Strong>{meta.total}</Strong> buku
              </Text>

              <Flex align="center" gap="2">
                <Button 
                  variant="soft" 
                  size="2" 
                  disabled={meta.page === 1}
                  onClick={() => setActivePage(meta.page - 1)}
                >
                  <ChevronLeftIcon />
                </Button>

                <Flex align="center" gap="1">
                  {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                    let pageNum;
                    if (meta.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (meta.page <= 3) {
                      pageNum = i + 1;
                    } else if (meta.page >= meta.totalPages - 2) {
                      pageNum = meta.totalPages - 4 + i;
                    } else {
                      pageNum = meta.page - 2 + i;
                    }
                    
                    return (
                      <Button 
                        key={pageNum} 
                        variant={pageNum === meta.page ? "solid" : "soft"} 
                        size="2"
                        highContrast={pageNum === meta.page}
                        onClick={() => setActivePage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  {meta.totalPages > 5 && meta.page < meta.totalPages - 2 && (
                    <>
                      <Text size="2" style={{ color: 'var(--gray-10)' }}>...</Text>
                      <Button 
                        variant="soft" 
                        size="2"
                        onClick={() => setActivePage(meta.totalPages)}
                      >
                        {meta.totalPages}
                      </Button>
                    </>
                  )}
                </Flex>

                <Button 
                  variant="soft" 
                  size="2"
                  disabled={meta.page === meta.totalPages}
                  onClick={() => setActivePage(meta.page + 1)}
                >
                  <ChevronRightIcon />
                </Button>
              </Flex>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}