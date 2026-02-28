// app/katalog/page.tsx
import { 
  Container,
  Flex,
  Grid,
  Card,
  Text,
  Heading,
  TextField,
  Select,
  Button,
  Badge,
  Box,
  Section,
  Separator,
  Inset,
  Strong,
  DataList,
  Tabs
} from '@radix-ui/themes';

import {
  MagnifyingGlassIcon,
  CalendarIcon,
  StarFilledIcon,
  Cross2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookmarkIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  BookmarkFilledIcon,
  PersonIcon,
  ClockIcon,
  ReaderIcon,
  FileTextIcon,
  HomeIcon,
  HeartIcon,
  Share1Icon,
  DotsHorizontalIcon,
 
} from '@radix-ui/react-icons';

// Data dummy untuk katalog buku
const dummyBooks = [
  {
    id: 1,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    isbn: "978-1250301697",
    category: "Thriller Psikologis",
    publisher: "Celadon Books",
    year: 2019,
    pages: 336,
    language: "Inggris",
    description: "Sebuah novel thriller psikologis tentang seorang wanita yang diam setelah membunuh suaminya.",
    coverColor: "blue",
    available: true,
    totalCopies: 5,
    availableCopies: 3,
    rating: 4.5,
    totalReviews: 128
  },
  {
    id: 2,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "978-9793062792",
    category: "Fiksi Sastra",
    publisher: "Bentang Pustaka",
    year: 2005,
    pages: 529,
    language: "Indonesia",
    description: "Kisah inspiratif tentang perjuangan anak-anak di Belitung untuk mendapatkan pendidikan.",
    coverColor: "red",
    available: true,
    totalCopies: 10,
    availableCopies: 4,
    rating: 4.8,
    totalReviews: 256
  },
  {
    id: 3,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Improvement",
    publisher: "Avery",
    year: 2018,
    pages: 320,
    language: "Inggris",
    description: "Cara mudah dan terbukti untuk membangun kebiasaan baik dan menghentikan kebiasaan buruk.",
    coverColor: "green",
    available: true,
    totalCopies: 8,
    availableCopies: 2,
    rating: 4.9,
    totalReviews: 512
  },
  {
    id: 4,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "978-9799731223",
    category: "Sejarah Fiksi",
    publisher: "Lentera Dipantara",
    year: 1980,
    pages: 535,
    language: "Indonesia",
    description: "Novel bersejarah tentang kehidupan di masa kolonial Belanda.",
    coverColor: "amber",
    available: true,
    totalCopies: 6,
    availableCopies: 1,
    rating: 4.7,
    totalReviews: 189
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "978-0857197689",
    category: "Keuangan",
    publisher: "Harriman House",
    year: 2020,
    pages: 256,
    language: "Inggris",
    description: "Pelajaran abadi tentang kekayaan, keserakahan, dan kebahagiaan.",
    coverColor: "purple",
    available: true,
    totalCopies: 4,
    availableCopies: 0,
    rating: 4.6,
    totalReviews: 234
  },
  {
    id: 6,
    title: "Pulang",
    author: "Tere Liye",
    isbn: "978-602-291-894-5",
    category: "Fiksi",
    publisher: "Republika Penerbit",
    year: 2022,
    pages: 420,
    language: "Indonesia",
    description: "Kisah tentang perjalanan hidup dan pencarian jati diri.",
    coverColor: "orange",
    available: true,
    totalCopies: 7,
    availableCopies: 5,
    rating: 4.4,
    totalReviews: 98
  },
  {
    id: 7,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "978-0062316097",
    category: "Non-Fiksi Sejarah",
    publisher: "Harper",
    year: 2015,
    pages: 443,
    language: "Inggris",
    description: "Sejarah singkat umat manusia dari masa lalu hingga masa depan.",
    coverColor: "indigo",
    available: true,
    totalCopies: 5,
    availableCopies: 2,
    rating: 4.8,
    totalReviews: 345
  },
  {
    id: 8,
    title: "Hujan",
    author: "Tere Liye",
    isbn: "978-602-291-475-6",
    category: "Fiksi Remaja",
    publisher: "Republika Penerbit",
    year: 2016,
    pages: 320,
    language: "Indonesia",
    description: "Kisah cinta dan persahabatan di masa depan pasca bencana.",
    coverColor: "cyan",
    available: false,
    totalCopies: 5,
    availableCopies: 0,
    rating: 4.3,
    totalReviews: 156
  },
  {
    id: 9,
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "978-0062502174",
    category: "Fiksi Filosofis",
    publisher: "HarperOne",
    year: 1993,
    pages: 208,
    language: "Inggris",
    description: "Perjalanan seorang gembala dalam mencari harta karun dan makna hidup.",
    coverColor: "bronze",
    available: true,
    totalCopies: 8,
    availableCopies: 6,
    rating: 4.7,
    totalReviews: 423
  }
];

const categories = [
  { id: 'all', name: 'Semua Kategori', count: 9 },
  { id: 'thriller', name: 'Thriller Psikologis', count: 1 },
  { id: 'sastra', name: 'Fiksi Sastra', count: 1 },
  { id: 'self-improvement', name: 'Self-Improvement', count: 1 },
  { id: 'sejarah', name: 'Sejarah Fiksi', count: 1 },
  { id: 'keuangan', name: 'Keuangan', count: 1 },
  { id: 'remaja', name: 'Fiksi Remaja', count: 1 },
  { id: 'filsafat', name: 'Fiksi Filosofis', count: 1 },
  { id: 'nonfiksi', name: 'Non-Fiksi Sejarah', count: 1 },
];

export default function KatalogPage() {
  return (
    <Box style={{ background: 'var(--gray-2)' }}>
      {/* Header Section */}
      <Section size="2" style={{ background: 'var(--gray-1)', borderBottom: '1px solid var(--gray-4)' }}>
        <Container size="4">
          <Flex direction="column" gap="4">
            <Flex align="center" gap="3">
              <Box p="2" style={{ background: 'var(--violet-3)', borderRadius: 'var(--radius-3)' }}>
                <ReaderIcon width="24" height="24" style={{ color: 'var(--violet-11)' }} />
              </Box>
              <Heading size="8" trim="both">
                Katalog Buku
              </Heading>
            </Flex>
            
            <Text size="4" style={{ color: 'var(--gray-11)' }}>
              Jelajahi koleksi lengkap buku yang tersedia di perpustakaan kami.
              Total <Strong>{dummyBooks.length} judul</Strong> buku.
            </Text>

            {/* Quick Stats */}
            <Grid columns="3" gap="4" style={{ maxWidth: 600 }}>
              <Card size="2">
                <Flex direction="column">
                  <Text size="8" weight="bold">{dummyBooks.length}</Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Buku</Text>
                </Flex>
              </Card>
              <Card size="2">
                <Flex direction="column">
                  <Text size="8" weight="bold" style={{ color: 'var(--green-11)' }}>
                    {dummyBooks.filter(b => b.availableCopies > 0).length}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Tersedia</Text>
                </Flex>
              </Card>
              <Card size="2">
                <Flex direction="column">
                  <Text size="8" weight="bold" style={{ color: 'var(--amber-11)' }}>
                    {dummyBooks.reduce((acc, b) => acc + b.totalCopies, 0)}
                  </Text>
                  <Text size="2" style={{ color: 'var(--gray-11)' }}>Total Eksemplar</Text>
                </Flex>
              </Card>
            </Grid>
          </Flex>
        </Container>
      </Section>

      {/* Main Content */}
      <Container size="4" px="4" py="6">
        {/* Search and Filter */}
        <Card size="3" mb="5">
          <Flex direction={{ initial: 'column', md: 'row' }} gap="3">
            <Box style={{ flex: 1 }}>
              <TextField.Root placeholder="Cari judul, penulis, atau ISBN...">
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
              </TextField.Root>
            </Box>
            
            <Box style={{ width: 240 }}>
              <Select.Root defaultValue="all">
                <Select.Trigger placeholder="Pilih kategori" />
                <Select.Content>
                  {categories.map((category) => (
                    <Select.Item key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </Box>

            <Box style={{ width: 180 }}>
              <Select.Root defaultValue="all">
                <Select.Trigger placeholder="Bahasa" />
                <Select.Content>
                  <Select.Item value="all">Semua Bahasa</Select.Item>
                  <Select.Item value="id">Indonesia</Select.Item>
                  <Select.Item value="en">Inggris</Select.Item>
                </Select.Content>
              </Select.Root>
            </Box>

            <Button size="3">
              Terapkan Filter
            </Button>
          </Flex>
        </Card>

        {/* Tabs Kategori */}
        <Tabs.Root defaultValue="all" mb="5">
          <Tabs.List>
            <Tabs.Trigger value="all">Semua</Tabs.Trigger>
            <Tabs.Trigger value="popular">Populer</Tabs.Trigger>
            <Tabs.Trigger value="new">Terbaru</Tabs.Trigger>
            <Tabs.Trigger value="recommended">Rekomendasi</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>

        {/* Active Filters */}
        <Flex align="center" gap="2" wrap="wrap" mb="5">
          <Text size="2" style={{ color: 'var(--gray-11)' }}>Filter aktif:</Text>
          
          <Badge size="2" color="violet" variant="soft" highContrast>
            <Flex align="center" gap="1">
              Semua Kategori
              <Cross2Icon />
            </Flex>
          </Badge>

          <Badge size="2" color="gray" variant="soft">
            <Flex align="center" gap="1">
              Bahasa Indonesia
              <Cross2Icon />
            </Flex>
          </Badge>

          <Button variant="ghost" size="1" style={{ color: 'var(--violet-11)' }}>
            Hapus semua
          </Button>
        </Flex>

        {/* Books Grid */}
        <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="5" width="auto">
          {dummyBooks.map((book) => (
            <Card key={book.id} size="2">
              <Inset clip="padding-box" side="top" pb="current">
                <Box 
                  style={{ 
                    height: 160,
                    background: `linear-gradient(135deg, var(--${book.coverColor}-9), var(--${book.coverColor}-11))`,
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
                        {book.category}
                      </Badge>
                      <Badge color="yellow" variant="solid">
                        <Flex align="center" gap="1">
                          <StarFilledIcon />
                          {book.rating}
                        </Flex>
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
                        <FileTextIcon /> Halaman
                      </Flex>
                    </DataList.Label>
                    <DataList.Value>{book.pages}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label minWidth="88px">
                      <Flex align="center" gap="2">
                        <ClockIcon /> Bahasa
                      </Flex>
                    </DataList.Label>
                    <DataList.Value>{book.language}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label minWidth="88px">
                      <Flex align="center" gap="2">
                        <BookmarkIcon /> Penerbit
                      </Flex>
                    </DataList.Label>
                    <DataList.Value>{book.publisher}</DataList.Value>
                  </DataList.Item>
                </DataList.Root>

                <Text size="2" style={{ color: 'var(--gray-11)' }} mt="3">
                  {book.description}
                </Text>

                <Separator size="4" my="3" />

                <Flex justify="between" align="center">
                  <Text size="1" style={{ color: 'var(--gray-10)' }}>
                    {book.isbn.substring(0, 14)}...
                  </Text>

                  <Flex align="center" gap="3">
                    {book.availableCopies > 0 ? (
                      <>
                        <Badge color="green" variant="soft" highContrast>
                          <Flex align="center" gap="1">
                            <CheckCircledIcon />
                            {book.availableCopies}/{book.totalCopies}
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
          ))}
        </Grid>

        {/* Pagination */}
        <Flex align="center" justify="between" mt="8" pt="5" style={{ borderTop: '1px solid var(--gray-5)' }}>
          <Text size="2" style={{ color: 'var(--gray-11)' }}>
            Menampilkan <Strong>1-9</Strong> dari <Strong>24</Strong> buku
          </Text>

          <Flex align="center" gap="2">
            <Button variant="soft" size="2" disabled>
              <ChevronLeftIcon />
            </Button>

            <Flex align="center" gap="1">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button 
                  key={page} 
                  variant={page === 1 ? "solid" : "soft"} 
                  size="2"
                  highContrast={page === 1}
                >
                  {page}
                </Button>
              ))}
              <Text size="2" style={{ color: 'var(--gray-10)' }}>...</Text>
              <Button variant="soft" size="2">10</Button>
            </Flex>

            <Button variant="soft" size="2">
              <ChevronRightIcon />
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
}