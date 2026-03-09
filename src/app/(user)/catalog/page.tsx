import { Container, Flex, Heading, Box, Section, Text } from '@radix-ui/themes';
import { ReaderIcon } from '@radix-ui/react-icons';
import { BookList } from './BookLists';

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
            </Text>
          </Flex>
        </Container>
      </Section>

      {/* Main Content */}
      <Container size="4" px="4" py="6">
        {/* BookList - Satu komponen yang handle semua (filter, grid, pagination) */}
        <BookList />
      </Container>
    </Box>
  );
}