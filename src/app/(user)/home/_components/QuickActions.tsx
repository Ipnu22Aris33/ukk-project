import { Box, Card, Flex, Text, Button } from '@radix-ui/themes';
import { PlusIcon, CheckCircledIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';
import { SectionHeader } from './SectionHeader';

export const QuickActions = () => {
  const router = useRouter();

  return (
    <Box>
      <SectionHeader title='Aksi Cepat' />
      <div className='grid grid-cols-2 gap-3 w-full'>
        <Card className='p-4 rounded-xl'>
          <Flex direction='column' gap='3'>
            <Box className='w-8.5 h-8.5 rounded-lg shrink-0 bg-linear-to-br from-indigo-9 to-violet-9 flex items-center justify-center'>
              <PlusIcon width='17' height='17' className='text-white' />
            </Box>
            <Box>
              <Text size='2' weight='bold' className='block leading-snug'>Pengajuan</Text>
              <Text size='1' color='gray' className='block leading-snug'>Pinjam buku baru</Text>
            </Box>
            <Button size='1' variant='soft' onClick={() => router.push('/loans/new')} className='cursor-pointer w-full'>
              Ajukan
            </Button>
          </Flex>
        </Card>

        <Card className='p-4 rounded-xl'>
          <Flex direction='column' gap='3'>
            <Box className='w-8.5 h-8.5 rounded-lg shrink-0 bg-linear-to-br from-green-9 to-teal-9 flex items-center justify-center'>
              <CheckCircledIcon width='17' height='17' className='text-white' />
            </Box>
            <Box>
              <Text size='2' weight='bold' className='block leading-snug'>Pengembalian</Text>
              <Text size='1' color='gray' className='block leading-snug'>Kembalikan buku</Text>
            </Box>
            <Button size='1' variant='soft' color='green' onClick={() => router.push('/loans/return')} className='cursor-pointer w-full'>
              Kembalikan
            </Button>
          </Flex>
        </Card>
      </div>
    </Box>
  );
};