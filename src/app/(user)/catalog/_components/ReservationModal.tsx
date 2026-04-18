'use client';

import { useState } from 'react';
import { Dialog, Callout, TextArea, Text, Flex, Button } from '@radix-ui/themes';
import { BookmarkIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useReservations } from '@/hooks/useReservation';

interface ReservationModalProps {
  book: any;
  onSuccess: () => void;
}

export function ReservationModal({ book, onSuccess }: ReservationModalProps) {
  const [open, setOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const reserveBook = useReservations();
  const availableCount = book.availableStock ?? 0;

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setQty(1);
      setNote('');
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      await reserveBook.create.mutateAsync({
        bookId: book.id,
        quantity: qty,
        notes: note,
      });
      onSuccess();
      setOpen(false);
    } catch (err: any) {
      setError(err.message ?? 'Reservasi gagal, coba lagi.');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Trigger>
        <Button size='2' disabled={availableCount === 0} style={{ width: '100%' }} onClick={() => setOpen(true)}>
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

        {error && (
          <Callout.Root color='red' variant='soft' mb='4' size='1'>
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

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
