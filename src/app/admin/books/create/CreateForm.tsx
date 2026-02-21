// app/books/create/page.tsx
'use client';

import { Container, Heading, Flex, Card } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { useBooks } from '@/hooks/useBooks';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { BookForm } from '../BookForm';

export function CreateForm() {
  const router = useRouter();
  const books = useBooks();

  const handleSubmit = async (data: any) => {
    await books.create.mutateAsync({
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      stock: Number(data.stock),
      year: Number(data.year),
      isbn: data.isbn,
      categoryId: Number(data.categoryId),
    });

    router.push('/admin/books');
    router.refresh();
  };

  const breadcrumbItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Books', href: '/admin/books' },
    { label: 'Create New Book' },
  ];

  return (
    <Container size='3'>
      <Breadcrumb items={breadcrumbItems} />

      <Flex justify='between' align='center' mb='6'>
        <Heading size='8'>Create New Book</Heading>
      </Flex>

      <Card size='3'>
        <BookForm 
          onSubmit={handleSubmit}
          submitLabel='Create Book'
        />
      </Card>
    </Container>
  );
}