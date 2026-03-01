'use client';

import { use } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { BookDetail } from './BookDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CatalogDetailPage({ params }: Props) {
  const { slug } = use(params);
  const books = useBooks();

  const { data, isLoading } = books.getBy('slug', slug);
  const book = data?.data ?? null;

  return <BookDetail book={book} isLoading={isLoading} />;
}