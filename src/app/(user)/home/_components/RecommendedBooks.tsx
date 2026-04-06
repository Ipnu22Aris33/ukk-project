import { Box, Card, Flex, Text, Badge } from '@radix-ui/themes';
import { BookmarkIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SectionHeader } from './SectionHeader';

const books = [
  { id: '1', title: 'The Pragmatic Programmer', author: 'David Thomas',  category: 'Pemrograman' },
  { id: '2', title: 'Design Patterns',          author: 'Gang of Four',  category: 'Arsitektur'  },
  { id: '3', title: 'Refactoring',              author: 'Martin Fowler', category: 'Pemrograman' },
] as const;

export const RecommendedBooks = () => {
  const router = useRouter();

  return (
    <Box>
      <SectionHeader title='Rekomendasi Buku' action='Lihat semua' onAction={() => router.push('/books')} />
      <Flex direction='column' gap='2'>
        {books.map((book) => (
          <Card key={book.id} className='p-3 px-4 rounded-xl cursor-pointer'>
            <Flex align='center' justify='between' gap='3'>
              <Flex align='center' gap='3' className='flex-1 min-w-0'>
                <Box className='w-8.5 h-8.5 rounded-lg shrink-0 bg-violetA-3 text-violet-9 flex items-center justify-center'>
                  <BookmarkIcon width='15' height='15' />
                </Box>
                <Box className='min-w-0 flex-1'>
                  <Text size='2' weight='medium' className='block leading-snug overflow-hidden text-ellipsis whitespace-nowrap'>
                    {book.title}
                  </Text>
                  <Text size='1' color='gray' className='block leading-snug'>{book.author}</Text>
                </Box>
              </Flex>
              <Badge variant='soft' radius='full' size='1' className='shrink-0'>{book.category}</Badge>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );
};