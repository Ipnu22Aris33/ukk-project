import { Box, Flex, Text, Avatar } from '@radix-ui/themes';

const user = { name: 'Budi Santoso', initials: 'BS' };

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

export const GreetingSection = () => (
  <Flex align='center' justify='between' gap='3'>
    <Box className='min-w-0'>
      <Text size='2' color='gray' className='block mb-0.5'>
        {getGreeting()},
      </Text>
      <Text size='6' weight='bold' className='block tracking-tight overflow-hidden text-ellipsis whitespace-nowrap'>
        {user.name.split(' ')[0]} 👋
      </Text>
    </Box>
    <Avatar size='4' fallback={user.initials} className='rounded-full border-2 border-indigoA-6 shrink-0' />
  </Flex>
);