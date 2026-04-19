'use client';

import { DataList, Button } from '@radix-ui/themes';
import Image from 'next/image';
import type { BookResponse } from '@/lib/schema/book';

interface ViewBookContentProps {
  book: BookResponse;
  onClose: () => void;
}

export function ViewBookContent({ book, onClose }: ViewBookContentProps) {
  return (
    <>
      <DataList.Root>
        <DataList.Item>
          <DataList.Label>Cover</DataList.Label>
          <DataList.Value>
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={book.title}
                width={120}
                height={160}
                style={{
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
            ) : (
              'No cover'
            )}
          </DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Title</DataList.Label>
          <DataList.Value>{book.title}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Author</DataList.Label>
          <DataList.Value>{book.author}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Category</DataList.Label>
          <DataList.Value>{book.category.name}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Publisher</DataList.Label>
          <DataList.Value>{book.publisher}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>ISBN</DataList.Label>
          <DataList.Value>{book.isbn}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Year</DataList.Label>
          <DataList.Value>{book.year}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Stock</DataList.Label>
          <DataList.Value>{book.totalStock}</DataList.Value>
        </DataList.Item>

        <DataList.Item>
          <DataList.Label>Slug</DataList.Label>
          <DataList.Value>{book.slug}</DataList.Value>
        </DataList.Item>
      </DataList.Root>

      <Button mt='4' variant='soft' onClick={onClose}>
        Close
      </Button>
    </>
  );
}
