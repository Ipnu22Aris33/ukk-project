import { Box, Card, Flex, Text, Badge } from '@radix-ui/themes';
import { ReaderIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SectionHeader } from './SectionHeader';

const loans = [
  { id: '1', title: 'Clean Code',    author: 'Robert C. Martin', dueDate: '20 Feb 2026', status: 'active'  },
  { id: '2', title: 'Atomic Habits', author: 'James Clear',      dueDate: '18 Feb 2026', status: 'overdue' },
  { id: '3', title: 'Deep Work',     author: 'Cal Newport',      dueDate: '25 Feb 2026', status: 'active'  },
] as const;

const statusConfig = {
  active:   { label: 'Aktif',     color: 'blue'  as const },
  overdue:  { label: 'Terlambat', color: 'red'   as const },
  returned: { label: 'Kembali',   color: 'green' as const },
};

export const ActiveLoans = () => {
  const router = useRouter();

  return (
    <Box className='min-w-0'>
      <SectionHeader title='Peminjaman Aktif' action='Lihat semua' onAction={() => router.push('/loans')} />
      <Flex direction='column' gap='2'>
        {loans.map((loan) => {
          const s = statusConfig[loan.status];
          return (
            <Card key={loan.id} className='p-3 px-4 rounded-xl cursor-pointer'>
              <Flex align='center' justify='between' gap='3'>
                <Flex align='center' gap='3' className='flex-1 min-w-0'>
                  <Box className='w-9 h-9 rounded-lg shrink-0 bg-indigoA-3 text-indigo-9 flex items-center justify-center'>
                    <ReaderIcon width='16' height='16' />
                  </Box>
                  <Box className='min-w-0 flex-1'>
                    <Text size='2' weight='medium' className='block leading-snug overflow-hidden text-ellipsis whitespace-nowrap'>
                      {loan.title}
                    </Text>
                    <Text size='1' color='gray' className='block leading-snug'>{loan.author}</Text>
                  </Box>
                </Flex>
                <Flex direction='column' align='end' gap='1' className='shrink-0'>
                  <Badge color={s.color} radius='full' size='1'>{s.label}</Badge>
                  <Text size='1' color='gray'>{loan.dueDate}</Text>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
};