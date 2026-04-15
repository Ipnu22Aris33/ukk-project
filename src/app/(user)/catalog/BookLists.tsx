'use client';

import { useState } from 'react';
import { Grid, Card, Text, Flex, Badge, Box, Button, Skeleton, Dialog, Callout, TextArea } from '@radix-ui/themes';
import {
  ReaderIcon,
  BookmarkIcon,
  InfoCircledIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import Link from 'next/link';
import Image from 'next/image';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useReservations } from '@/hooks/useReservation';
import { FilterSection } from './FilterSection';

/* ─── Modal Reservasi ─── */
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
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) {
          setQty(1);
          setNote('');
        }
      }}
    >
      <Dialog.Trigger>
        <Button size='2' disabled={availableCount === 0} style={{ width: '100%' }}>
          <BookmarkIcon /> Reservasi
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth='420px'>
        <Dialog.Title>Reservasi Buku</Dialog.Title>
        <Dialog.Description size='2' mb='4'>
          Detail reservasi untuk{' '}
          <Text weight='bold' color='indigo'>
            {book.title}
          </Text>
        </Dialog.Description>

        <Callout.Root color='indigo' variant='soft' mb='4' size='1'>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>Stok tersedia: {availableCount} eksemplar</Callout.Text>
        </Callout.Root>

        <Flex direction='column' gap='4'>
          <Flex direction='column' gap='1'>
            <Text as='label' size='2' weight='medium'>
              Jumlah
            </Text>
            <Flex align='center' gap='3'>
              <Button variant='outline' onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                −
              </Button>
              <Text size='3' weight='bold'>
                {qty}
              </Text>
              <Button variant='outline' onClick={() => setQty((q) => Math.min(availableCount, q + 1))} disabled={qty >= availableCount}>
                +
              </Button>
            </Flex>
          </Flex>

          <Flex direction='column' gap='1'>
            <Text as='label' size='2' weight='medium'>
              Catatan
            </Text>
            <TextArea placeholder='Contoh: Ambil sore hari...' value={note} onChange={(e) => setNote(e.target.value)} />
          </Flex>
        </Flex>

        <Flex gap='3' justify='end' mt='5'>
          <Dialog.Close>
            <Button variant='soft' color='gray'>
              Batal
            </Button>
          </Dialog.Close>
          <Button onClick={handleSubmit} loading={reserveBook.create.isPending}>
            Konfirmasi
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}

/* ─── Cover Placeholder ─── */
const NEUTRAL_PALETTES = [
  { bg: '#1c1c1e', text: '#ffffff' },
  { bg: '#1e293b', text: '#e2e8f0' },
  { bg: '#0d1b2a', text: '#dce8f0' },
  { bg: '#111827', text: '#e5e7eb' },
  { bg: '#1b2838', text: '#c6d4df' },
  { bg: '#18181b', text: '#f4f4f5' },
  { bg: '#1a1a2e', text: '#e0e0f0' },
  { bg: '#2c2c2e', text: '#ebebf5' },
];

const hashString = (str: string): number =>
  str.split('').reduce((hash, ch) => (hash * 31 + ch.charCodeAt(0)) >>> 0, 0);

function CoverPlaceholder({ title, author }: { title: string; author: string }) {
  const palette = NEUTRAL_PALETTES[hashString(title) % NEUTRAL_PALETTES.length];

  const initials = title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
        background: palette.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 10px',
      }}
    >
      <Text
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: palette.text,
          opacity: 0.12,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
        }}
      >
        {initials}
      </Text>

      <Box
        style={{
          width: 24,
          height: 1,
          background: palette.text,
          opacity: 0.18,
        }}
      />

      <Text
        style={{
          textAlign: 'center',
          color: palette.text,
          opacity: 0.45,
          fontSize: 9,
          fontWeight: 500,
          lineHeight: 1.5,
          letterSpacing: '0.07em',
          textTransform: 'uppercase',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {title}
      </Text>
    </Box>
  );
}

/* ─── Book Card ─── */
function BookCard({ book }: { book: any }) {
  const hasImage = !!book.coverUrl;

  return (
    <Card
      size='1'
      style={{
        overflow: 'hidden',
        padding: 0,
        display: 'flex',
        flexDirection: 'row',
        height: 160,
      }}
    >
      {/* Cover — kiri */}
      <Box
        style={{
          position: 'relative',
          width: 108,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        {hasImage ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes='108px'
            style={{ objectFit: 'cover' }}
            priority={false}
          />
        ) : (
          <CoverPlaceholder title={book.title} author={book.author} />
        )}

        {/* Overlay gelap untuk buku dengan gambar */}
        {hasImage && (
          <Box
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
            }}
          />
        )}

        {/* Badge kategori */}
        <Box style={{ position: 'absolute', top: 8, left: 8 }}>
          <Badge variant='solid' radius='full' style={{ fontSize: 10 }}>
            {book.category.name}
          </Badge>
        </Box>
      </Box>

      {/* Content — kanan */}
      <Flex
        direction='column'
        justify='between'
        style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}
      >
        {/* Judul + author + tahun */}
        <Box>
          <Text
            weight='medium'
            size='2'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {book.title}
          </Text>
          <Text size='1' color='gray' style={{ display: 'block', marginTop: 2 }}>
            {book.author}
          </Text>
          <Text size='1' color='gray' style={{ display: 'block', marginTop: 1, opacity: 0.7 }}>
            {book.year}
          </Text>
        </Box>

        {/* Stok */}
        <Flex gap='1' wrap='wrap' align='center'>
          <Text size='1' color='green'>{book.availableStock ?? 0} tersedia</Text>
          <Text size='1' color='gray'>•</Text>
          <Text size='1' color='blue'>{book.loanedStock ?? 0} dipinjam</Text>
          <Text size='1' color='gray'>•</Text>
          <Text size='1' color='amber'>{book.reservedStock ?? 0} reservasi</Text>
        </Flex>

        {/* Tombol aksi */}
        <Flex gap='2'>
          <Link href={`/catalog/${book.slug}`} style={{ flex: 1 }}>
            <Button size='2' variant='soft' color='gray' style={{ width: '100%' }}>
              Detail
            </Button>
          </Link>
          <Box style={{ flex: 2 }}>
            <ReservationModal book={book} />
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}

/* ─── Main BookList ─── */
export function BookList() {
  const [filters, setFilters] = useState<any>({ page: 1, limit: 10 });
  const { data: catResponse, isLoading: isLoadingCats } = useCategories().list({ limit: 100 });
  const { data, isLoading } = useBooks().list(filters);

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
              <BookCard key={book.id} book={book} />
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