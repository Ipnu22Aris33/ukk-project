'use client';

import { Flex, Text, Skeleton, Separator, Box } from '@radix-ui/themes';
import { useAuth } from '@/hooks/useAuth';

const getGreeting = (): { text: string; emoji: string } => {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Selamat pagi', emoji: '🌤️' };
  if (h < 15) return { text: 'Selamat siang', emoji: '☀️' };
  if (h < 18) return { text: 'Selamat sore', emoji: '🌇' };
  return { text: 'Selamat malam', emoji: '🌙' };
};

export const GreetingSection = () => {
  const { session, isLoading } = useAuth();
  const { text, emoji } = getGreeting();

  const firstName = session?.member.fullName?.split(' ')[0] ?? 'Pengguna';


  return (
    <Flex direction='column' gap='1'>
      <Text
        size='1'
        weight='medium'
        color='gray'
        style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
      >
        {text} {emoji}
      </Text>

      <Skeleton loading={isLoading}>
        <Box style={{ display: 'inline-block' }}>
          <Text
            as='span'
            size='6'
            weight='bold'
            style={{ letterSpacing: '-0.02em', lineHeight: '1.2', display: 'block' }}
          >
            {firstName}
          </Text>
          <Separator
            color='indigo'
            style={{ width: '100%', marginTop: 'var(--space-1)' }}
          />
        </Box>
      </Skeleton>
    </Flex>
  );
};