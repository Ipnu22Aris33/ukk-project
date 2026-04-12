'use client';

import { useState } from 'react';
import { Grid, Card, Text, Flex, Badge, Box, Inset, DataList, Separator, Button, Skeleton, Dialog, Callout, TextArea } from '@radix-ui/themes';
import { CalendarIcon, CheckCircledIcon, CrossCircledIcon, ChevronLeftIcon, ChevronRightIcon, ReaderIcon, BookmarkIcon, InfoCircledIcon } from '@radix-ui/react-icons';

import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useReservations } from '@/hooks/useReservation';
import { FilterSection } from './FilterSection'; // Import komponen yang dipisah tadi

const getCategoryColor = (name: string): string => {
  const colors: Record<string, string> = {
    Komik: 'blue', Novel: 'red', Fiksi: 'green', 'Non-Fiksi': 'amber', Teknologi: 'purple',
  };
  return colors[name] || 'gray';
};

/* --- Modal Reservasi per Item --- */
function ReservationModal({ book }: { book: any }) {
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const reserveBook = useReservations();
  const availableCount = book.availableStock ?? 0;

  const handleSubmit = async () => {
    await reserveBook.create.mutateAsync({
      bookId: book.id,
      quantity: qty,
      notes: note,
    });
  };

  return (
    <Dialog.Root onOpenChange={(open) => { if (!open) { setQty(1); setNote(''); } }}>
      <Dialog.Trigger>
        <Button size="2" disabled={availableCount === 0}>
          <BookmarkIcon /> Reservasi
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="420px">
        <Dialog.Title>Reservasi Buku</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Detail reservasi untuk <Text weight="bold" color="indigo">{book.title}</Text>
        </Dialog.Description>
        
        <Callout.Root color="indigo" variant="soft" mb="4" size="1">
          <Callout.Icon><InfoCircledIcon /></Callout.Icon>
          <Callout.Text>Stok tersedia: {availableCount} eksemplar</Callout.Text>
        </Callout.Root>

        <Flex direction="column" gap="4">
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Jumlah</Text>
            <Flex align="center" gap="3">
              <Button variant="outline" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</Button>
              <Text size="3" weight="bold">{qty}</Text>
              <Button variant="outline" onClick={() => setQty(q => Math.min(availableCount, q + 1))} disabled={qty >= availableCount}>+</Button>
            </Flex>
          </Flex>
          <Flex direction="column" gap="1">
            <Text as="label" size="2" weight="medium">Catatan</Text>
            <TextArea placeholder="Contoh: Ambil sore hari..." value={note} onChange={(e) => setNote(e.target.value)} />
          </Flex>
        </Flex>

        <Flex gap="3" justify="end" mt="5">
          <Dialog.Close><Button variant="soft" color="gray">Batal</Button></Dialog.Close>
          <Button onClick={handleSubmit} loading={reserveBook.create.isPending}>Konfirmasi</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export function BookList() {
  const [filters, setFilters] = useState<any>({ page: 1, limit: 9 });
  const { data: catResponse, isLoading: isLoadingCats } = useCategories().list({ limit: 100 });
  const { data, isLoading } = useBooks().list(filters);

  const booksData = data?.data ?? [];
  const meta = data?.meta;

  if (isLoading) return (
    <Grid columns={{ initial: '1', md: '3' }} gap="5">
      {[...Array(6)].map((_, i) => <Skeleton key={i} height="350px" />)}
    </Grid>
  );

  return (
    <Box>
      <FilterSection 
        onFilterChange={(f) => setFilters(prev => ({ ...prev, ...f, page: 1 }))} 
        categories={catResponse?.data || []} 
        isLoadingCats={isLoadingCats} 
      />

      {booksData.length === 0 ? (
        <Flex direction="column" align="center" py="9" gap="2" style={{ opacity: 0.5 }}>
          <ReaderIcon width="48" height="48" />
          <Text>Buku tidak ditemukan</Text>
        </Flex>
      ) : (
        <>
          <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="5">
            {booksData.map((book: any) => (
              <Card key={book.id} size="2">
                <Inset clip="padding-box" side="top" pb="current">
                  <Box style={{ 
                    height: 180, 
                    background: book.coverUrl ? `url(${book.coverUrl}) center/cover` : `var(--${getCategoryColor(book.category.name)}-9)`,
                    position: 'relative' 
                  }}>
                    <Box style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />
                    <Flex direction="column" justify="end" p="4" style={{ height: '100%', position: 'relative' }}>
                      <Badge variant="solid" mb="2" style={{ width: 'fit-content' }}>{book.category.name}</Badge>
                      <Text weight="bold" size="4">{book.title}</Text>
                      <Text size="2" style={{ color: 'rgba(255,255,255,0.8)' }}>{book.author}</Text>
                    </Flex>
                  </Box>
                </Inset>
                <Box pt="2">
                  <DataList.Root size="1">
                    <DataList.Item align="center">
                      <DataList.Label><CalendarIcon /> Tahun</DataList.Label>
                      <DataList.Value>{book.year}</DataList.Value>
                    </DataList.Item>
                  </DataList.Root>
                  <Separator size="4" my="3" />
                  <Flex justify="between" align="center">
                    <Badge color={book.availableStock > 0 ? 'green' : 'red'} variant="soft">
                      {book.availableStock > 0 ? <CheckCircledIcon /> : <CrossCircledIcon />}
                      {book.availableStock > 0 ? `${book.availableStock} Tersedia` : 'Habis'}
                    </Badge>
                    <ReservationModal book={book} />
                  </Flex>
                </Box>
              </Card>
            ))}
          </Grid>
          {/* Pagination logic here... */}
        </>
      )}
    </Box>
  );
}