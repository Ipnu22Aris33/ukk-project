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
} from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { BookResponse as Book } from '@/lib/schema/book';
import { useReservations } from '@/hooks/useReservation';

const getStockColor = (stock: number): 'green' | 'orange' | 'red' => {
  if (stock === 0) return 'red';
  if (stock <= 2) return 'orange';
  return 'green';
};

const getStockLabel = (stock: number) => {
  if (stock === 0) return 'Tidak tersedia';
  if (stock === 1) return '1 tersisa';
  return `${stock} tersedia`;
};

type MetaField = {
  label: string;
  value: string | number | undefined | null;
  icon: React.ReactNode;
  color?: 'green' | 'orange' | 'red' | 'gray';
  mono?: boolean;
};

interface Props {
  book: Book | null;
  isLoading: boolean;
}

export const BookDetail = ({ book, isLoading }: Props) => {
  const router = useRouter();

  const stockColor = book ? getStockColor(book.stock) : 'gray';
  const isAvailable = (book?.stock ?? 0) > 0;

  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');

  const maxQty = book?.stock ?? 1;

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
      label: 'Stok',
      value: book ? getStockLabel(book.stock) : null,
      icon: <BarChartIcon width={13} height={13} color={`var(--${stockColor}-9)`} />,
      color: stockColor,
    },
  ];

  const reserveBook = useReservations();

  const handleSubmit = () => {
    reserveBook.create.mutateAsync({
      bookId: book?.id!,
      quantity: qty,
      notes: note,
    });
  };

  const reservasiTrigger = (
    <Button size='3' color='indigo' variant={isAvailable ? 'solid' : 'soft'} disabled={!isAvailable || isLoading} style={{ width: '100%' }}>
      <BookmarkIcon />
      {isAvailable ? 'Reservasi' : 'Stok Habis'}
    </Button>
  );

  const ctaSection = (
    <Flex direction='column' gap='2'>
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            setQty(1);
            setNote('');
          }
        }}
      >
        <Dialog.Trigger>{reservasiTrigger}</Dialog.Trigger>

        <Dialog.Content maxWidth='420px'>
          <Dialog.Title>Reservasi Buku</Dialog.Title>
          <Dialog.Description size='2' color='gray' mb='4'>
            Isi detail reservasi untuk{' '}
            <Text weight='medium' color='gray'>
              {book?.title}
            </Text>
          </Dialog.Description>

          {/* Stock info callout */}
          <Callout.Root color={stockColor} variant='soft' mb='4'>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text size='2'>
              Stok tersedia: <Text weight='bold'>{book?.stock} eksemplar</Text>
            </Callout.Text>
          </Callout.Root>

          <Flex direction='column' gap='4'>
            {/* Qty */}
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

            {/* Note */}
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
                placeholder='Contoh: butuh sebelum tanggal 20...'
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
            <Dialog.Close>
              <Button color='indigo' onClick={handleSubmit} >
                <BookmarkIcon />
                Konfirmasi Reservasi
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Skeleton loading={isLoading}>
        <Flex align='center' justify='center' gap='1'>
          {isAvailable ? <CheckCircledIcon color={`var(--${stockColor}-9)`} /> : <CrossCircledIcon color='var(--red-9)' />}
          <Text size='1' color={stockColor} weight='medium'>
            {book ? getStockLabel(book.stock) : ''}
          </Text>
        </Flex>
      </Skeleton>
    </Flex>
  );

  return (
    <Box p={{ initial: '4', sm: '6', md: '8' }} style={{ maxWidth: 960, margin: '0 auto' }}>
      {/* Back */}
      <Box mb='6'>
        <Button variant='ghost' color='gray' size='2' onClick={() => router.back()}>
          <ArrowLeftIcon />
          Kembali
        </Button>
      </Box>

      {/* Main Layout */}
      <Grid columns={{ initial: '1', sm: '200px 1fr' }} gap={{ initial: '6', sm: '8' }} align='start'>
        {/* ── LEFT: Cover + CTA (mobile) ── */}
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

          <Box display={{ initial: 'block', sm: 'none' }}>{ctaSection}</Box>
        </Flex>

        {/* ── RIGHT: All Info + CTA (desktop) ── */}
        <Flex direction='column' gap='5'>
          <Skeleton loading={isLoading}>
            <Flex gap='2' wrap='wrap'>
              {book?.category && (
                <Badge variant='soft' color='indigo' radius='full' size='1'>
                  {book.category.name}
                </Badge>
              )}
            </Flex>
          </Skeleton>

          <Skeleton loading={isLoading}>
            <Text as='p' size='8' weight='bold' style={{ lineHeight: 1.15, letterSpacing: '-0.025em', fontFamily: 'Georgia, serif' }}>
              {book?.title ?? 'Memuat...'}
            </Text>
          </Skeleton>

          <Skeleton loading={isLoading}>
            <Flex align='center' gap='2'>
              <PersonIcon color='var(--gray-9)' />
              <Text size='3' color='gray' style={{ fontStyle: 'italic' }}>
                {book?.author}
              </Text>
            </Flex>
          </Skeleton>

          <Separator size='4' />

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

          <Box display={{ initial: 'none', sm: 'block' }}>
            <Separator size='4' mb='4' />
            {ctaSection}
          </Box>
        </Flex>
      </Grid>
    </Box>
  );
};
