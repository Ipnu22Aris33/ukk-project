'use client';

import { Card, Text, Flex, Badge, Box, Button } from '@radix-ui/themes';
import Image from 'next/image';
import Link from 'next/link';
import { ReservationModal } from './ReservationModal';
import { CoverPlaceholder } from './CoverPlaceholder';

interface BookCardProps {
  book: any;
  onReserveSuccess: () => void;
}

export function BookCard({ book, onReserveSuccess }: BookCardProps) {
  const hasImage = !!book.coverUrl;

  return (
    <Card size='1' style={{ overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'row', height: 160 }}>
      <Box style={{ position: 'relative', width: 108, flexShrink: 0, overflow: 'hidden' }}>
        {hasImage ? (
          <Image src={book.coverUrl} alt={book.title} fill sizes='108px' style={{ objectFit: 'cover' }} priority={false} />
        ) : (
          <CoverPlaceholder title={book.title} author={book.author} />
        )}

        {hasImage && (
          <Box style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        )}

        <Box style={{ position: 'absolute', top: 8, left: 8 }}>
          <Badge variant='solid' radius='full' style={{ fontSize: 10 }}>
            {book.category.name}
          </Badge>
        </Box>
      </Box>

      <Flex direction='column' justify='between' style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
        <Box>
          <Text weight='medium' size='2' style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
            {book.title}
          </Text>
          <Text size='1' color='gray' style={{ display: 'block', marginTop: 2 }}>{book.author}</Text>
          <Text size='1' color='gray' style={{ display: 'block', marginTop: 1, opacity: 0.7 }}>{book.year}</Text>
        </Box>

        <Flex gap='1' wrap='wrap' align='center'>
          <Text size='1' color='green'>{book.availableStock ?? 0} tersedia</Text>
          <Text size='1' color='gray'>•</Text>
          <Text size='1' color='blue'>{book.loanedStock ?? 0} dipinjam</Text>
          <Text size='1' color='gray'>•</Text>
          <Text size='1' color='amber'>{book.reservedStock ?? 0} reservasi</Text>
        </Flex>

        <Flex gap='2'>
          <Link href={`/catalog/${book.slug}`} style={{ flex: 1 }}>
            <Button size='2' variant='soft' color='gray' style={{ width: '100%' }}>Detail</Button>
          </Link>
          <Box style={{ flex: 2 }}>
            <ReservationModal book={book} onSuccess={onReserveSuccess} />
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}