'use client';

import { useState } from 'react';
import { Grid, Text, Flex, Box, Button, Skeleton } from '@radix-ui/themes';
import { ReaderIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { FilterSection } from './FilterSection';
import { BookCard } from './BookCard';

export function BookList() {
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10 });
  const { data: catResponse, isLoading: isLoadingCats } = useCategories().list({ limit: 100 });
  const books = useBooks();
  const { data, isLoading } = books.list(filters);

  const booksData = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading)
    return (
      <Grid columns={{ initial: '1', sm: '2', md: '2', lg: '3' }} gap='3'>
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} style={{ height: 160, borderRadius: 8 }} />
        ))}
      </Grid>
    );

  return (
    <Box>
      <FilterSection
        onFilterChange={(f) => setFilters((prev: any) => ({ ...prev, ...f, page: 1 }))}
        categories={catResponse?.data || []}
        isLoadingCats={isLoadingCats}
      />

      {booksData.length === 0 ? (
        <Flex direction='column' align='center' py='9' gap='2' style={{ opacity: 0.45 }}>
          <ReaderIcon width='48' height='48' />
          <Text size='2'>Buku tidak ditemukan</Text>
        </Flex>
      ) : (
        <>
          <Grid columns={{ initial: '1', sm: '2', md: '2', lg: '3' }} gap='3'>
            {booksData.map((book: any) => (
              <BookCard key={book.id} book={book} onReserveSuccess={books.invalidate.list} />
            ))}
          </Grid>

          {meta && meta.totalPages > 1 && (
            <Flex justify='center' align='center' gap='3' mt='6'>
              <Button
                variant='soft'
                color='gray'
                size='2'
                disabled={filters.page <= 1}
                onClick={() => setFilters((prev: any) => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeftIcon /> Sebelumnya
              </Button>

              <Text size='2' color='gray'>
                {filters.page} / {meta.totalPages}
              </Text>

              <Button
                variant='soft'
                color='gray'
                size='2'
                disabled={filters.page >= meta.totalPages}
                onClick={() => setFilters((prev: any) => ({ ...prev, page: prev.page + 1 }))}
              >
                Berikutnya <ChevronRightIcon />
              </Button>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
}
