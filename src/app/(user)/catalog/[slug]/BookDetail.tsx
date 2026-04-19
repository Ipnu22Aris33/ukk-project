'use client';

import { Badge, Box, Button, Callout, Dialog, Flex, Grid, Separator, Skeleton, Text, TextArea, TextField } from '@radix-ui/themes';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  PersonIcon,
  CalendarIcon,
  ReaderIcon,
  BarChartIcon,
  IdCardIcon,
  HomeIcon,
  InfoCircledIcon,
  StackIcon,
  BookmarkFilledIcon,
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { BookResponse as Book } from '@/lib/schema/book';
import { useReservations } from '@/hooks/useReservation';

/* =========================
   HELPERS
========================= */

const getStockColor = (available: number): 'green' | 'orange' | 'red' => {
  if (available === 0) return 'red';
  if (available <= 2) return 'orange';
  return 'green';
};

const getStockLabel = (available: number) => {
  if (available === 0) return 'Tidak tersedia di rak';
  if (available === 1) return '1 tersisa';
  return `${available} tersedia`;
};

/* =========================
   STOCK INDICATOR
========================= */

function StockBar({ total, available, reserved, loaned }: { total: number; available: number; reserved: number; loaned: number }) {
  const availablePct = total > 0 ? (available / total) * 100 : 0;
  const reservedPct = total > 0 ? (reserved / total) * 100 : 0;
  const loanedPct = total > 0 ? (loaned / total) * 100 : 0;

  return (
    <Flex direction='column' gap='2'>
      {/* Bar */}
      <Flex style={{ height: 8, borderRadius: 999, overflow: 'hidden', background: 'var(--gray-4)' }}>
        <Box style={{ width: `${availablePct}%`, background: 'var(--green-9)', transition: 'width 0.3s' }} />
        <Box style={{ width: `${reservedPct}%`, background: 'var(--orange-9)', transition: 'width 0.3s' }} />
        <Box style={{ width: `${loanedPct}%`, background: 'var(--blue-9)', transition: 'width 0.3s' }} />
      </Flex>

      {/* Legend */}
      <Grid columns='3' gap='2'>
        <Flex align='center' gap='1'>
          <Box style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--green-9)', flexShrink: 0 }} />
          <Text size='1' color='gray'>
            Tersedia{' '}
            <Text weight='bold' color='green'>
              {available}
            </Text>
          </Text>
        </Flex>
        <Flex align='center' gap='1'>
          <Box style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--orange-9)', flexShrink: 0 }} />
          <Text size='1' color='gray'>
            Reservasi{' '}
            <Text weight='bold' color='orange'>
              {reserved}
            </Text>
          </Text>
        </Flex>
        <Flex align='center' gap='1'>
          <Box style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--blue-9)', flexShrink: 0 }} />
          <Text size='1' color='gray'>
            Dipinjam{' '}
            <Text weight='bold' color='blue'>
              {loaned}
            </Text>
          </Text>
        </Flex>
      </Grid>
    </Flex>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

interface Props {
  book: Book | null;
  isLoading: boolean;
}

export const BookDetail = ({ book, isLoading }: Props) => {
  const router = useRouter();

  const availableCount = book?.availableStock ?? 0;
  const totalCount = book?.totalStock ?? 0;
  const reservedCount = book?.reservedStock ?? 0;
  const loanedCount = book?.loanedStock ?? 0;

  const stockColor = book ? getStockColor(availableCount) : 'gray';
  const isAvailable = availableCount > 0;
  const maxQty = isAvailable ? availableCount : 1;

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const reserveBook = useReservations();

  const handleSubmit = () => {
    reserveBook.create.mutateAsync({
      bookId: book?.id!,
      quantity: qty,
      notes: note,
    });
  };

  type MetaField = {
    label: string;
    value: string | number | undefined | null;
    icon: React.ReactNode;
    color?: 'green' | 'orange' | 'red' | 'gray';
    mono?: boolean;
  };

  const metaFields: MetaField[] = [
    {
      label: 'Penerbit',
      value: book?.publisher,
      icon: <HomeIcon width={13} height={13} color='var(--gray-8)' />,
    },
    {
      label: 'Tahun Terbit',
      value: book?.year,
      icon: <CalendarIcon width={13} height={13} color='var(--gray-8)' />,
    },
    {
      label: 'ISBN',
      value: book?.isbn,
      icon: <IdCardIcon width={13} height={13} color='var(--gray-8)' />,
      mono: true,
    },
    {
      label: 'Total Koleksi',
      value: `${totalCount} eksemplar`,
      icon: <StackIcon width={13} height={13} color='var(--gray-8)' />,
    },
  ];

  const ctaSection = (
    <Flex direction='column' gap='3'>
      {/* Stock Bar */}
      <Skeleton loading={isLoading}>
        <Box
          p='3'
          style={{
            background: 'var(--gray-2)',
            borderRadius: 'var(--radius-3)',
            border: '1px solid var(--gray-4)',
          }}
        >
          <Flex justify='between' align='center' mb='2'>
            <Text size='1' weight='medium' color='gray' style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Ketersediaan Stok
            </Text>
            <Badge color={stockColor} variant='soft' size='1'>
              {getStockLabel(availableCount)}
            </Badge>
          </Flex>
          <StockBar total={totalCount} available={availableCount} reserved={reservedCount} loaned={loanedCount} />
        </Box>
      </Skeleton>

      {/* Reservasi Button + Dialog */}
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setQty(1);
            setNote('');
          }
        }}
      >
        <Dialog.Trigger>
          <Button size='3' color='indigo' variant={isAvailable ? 'solid' : 'soft'} disabled={!isAvailable || isLoading} style={{ width: '100%' }}>
            <BookmarkIcon />
            {isAvailable ? 'Reservasi Buku' : 'Stok di Rak Habis'}
          </Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth='420px'>
          <Dialog.Title>Reservasi Buku</Dialog.Title>
          <Dialog.Description size='2' color='gray' mb='4'>
            Isi detail reservasi untuk{' '}
            <Text weight='medium' color='gray'>
              {book?.title}
            </Text>
          </Dialog.Description>

          <Callout.Root color={stockColor} variant='soft' mb='4'>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text size='2'>
              Buku yang dapat dipesan sekarang: <Text weight='bold'>{availableCount} eksemplar</Text>
            </Callout.Text>
          </Callout.Root>

          <Flex direction='column' gap='4'>
            <Flex direction='column' gap='1'>
              <Text as='label' size='2' weight='medium'>
                Jumlah
              </Text>
              <Flex align='center' gap='2'>
                <Button variant='outline' color='gray' size='2' disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                  −
                </Button>
                <TextField.Root value={qty} readOnly size='2' style={{ width: 56, textAlign: 'center' }} />
                <Button variant='outline' color='gray' size='2' disabled={qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
                  +
                </Button>
                <Text size='1' color='gray'>
                  maks. {maxQty}
                </Text>
              </Flex>
            </Flex>

            <Flex direction='column' gap='1'>
              <Flex justify='between' align='center'>
                <Text as='label' size='2' weight='medium'>
                  Catatan
                </Text>
                <Text size='1' color='gray'>
                  Opsional
                </Text>
              </Flex>
              <TextArea
                placeholder='Contoh: saya ambil sore nanti...'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                resize='vertical'
              />
            </Flex>
          </Flex>

          <Flex gap='3' justify='end' mt='5'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>
                Batal
              </Button>
            </Dialog.Close>
            <Button color='indigo' onClick={handleSubmit} loading={reserveBook.create.isPending}>
              <BookmarkIcon />
              Konfirmasi Reservasi
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Flex>
  );

  return (
    <Box p={{ initial: '4', sm: '6', md: '8' }} style={{ maxWidth: 960, margin: '0 auto' }}>
      <Box mb='6'>
        <Button variant='ghost' color='gray' size='2' onClick={() => router.back()}>
          <ArrowLeftIcon />
          Kembali
        </Button>
      </Box>

      <Grid columns={{ initial: '1', sm: '200px 1fr' }} gap={{ initial: '6', sm: '8' }} align='start'>
        {/* Cover */}
        <Flex direction='column' gap='3'>
          <Skeleton loading={isLoading}>
            <Box
              overflow='hidden'
              style={{
                width: '100%',
                aspectRatio: '2 / 3',
                borderRadius: 'var(--radius-4)',
                background: 'var(--gray-3)',
                position: 'relative',
                boxShadow: '0 2px 4px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.12)',
              }}
            >
              {book?.coverUrl ? (
                <Image src={book.coverUrl} alt={book.title} fill sizes='200px' style={{ objectFit: 'cover' }} priority />
              ) : (
                <Flex align='center' justify='center' height='100%'>
                  <ReaderIcon width={32} height={32} color='var(--gray-6)' />
                </Flex>
              )}
            </Box>
          </Skeleton>

          {/* CTA mobile */}
          <Box display={{ initial: 'block', sm: 'none' }}>{ctaSection}</Box>
        </Flex>

        {/* Info */}
        <Flex direction='column' gap='5'>
          {/* Category badge */}
          <Skeleton loading={isLoading}>
            <Flex gap='2' wrap='wrap' align='center'>
              {book?.category && (
                <>
                  <Badge variant='soft' color='indigo' radius='full' size='1'>
                    {book.category.name}
                  </Badge>
                  {book.category.description && (
                    <Text size='1' color='gray'>
                      {book.category.description}
                    </Text>
                  )}
                </>
              )}
            </Flex>
          </Skeleton>

          {/* Title */}
          <Skeleton loading={isLoading}>
            <Text as='p' size='8' weight='bold' style={{ lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: 'Georgia, serif' }}>
              {book?.title ?? 'Memuat...'}
            </Text>
          </Skeleton>

          {/* Author */}
          <Skeleton loading={isLoading}>
            <Flex align='center' gap='2'>
              <PersonIcon color='var(--gray-9)' />
              <Text size='3' color='gray' style={{ fontStyle: 'italic' }}>
                {book?.author}
              </Text>
            </Flex>
          </Skeleton>

          <Separator size='4' />

          {/* Meta grid */}
          <Grid columns='2' gap='4'>
            {metaFields.map(({ label, value, icon, color, mono }) => (
              <Skeleton key={label} loading={isLoading}>
                <Flex direction='column' gap='1'>
                  <Text size='1' color='gray' weight='medium' style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {label}
                  </Text>
                  <Flex align='center' gap='1'>
                    {icon}
                    <Text size='2' weight='medium' color={color} style={mono ? { fontFamily: 'monospace', letterSpacing: '0.04em' } : undefined}>
                      {value ?? '—'}
                    </Text>
                  </Flex>
                </Flex>
              </Skeleton>
            ))}
          </Grid>

          {/* CTA desktop */}
          <Box display={{ initial: 'none', sm: 'block' }}>
            <Separator size='4' mb='4' />
            {ctaSection}
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};
