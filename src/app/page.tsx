import { Button, Container, Flex, Heading, Text, Box } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AppIcon } from '@/components/ui/AppIcon';
import Spinner from '@/components/icons/SvgSpinnersBlocksShuffle3';

export default function Home() {
  return (
    <Container size='3'>
      <Flex
        direction='column'
        align='center'
        justify='center'
        gap='6'
        style={{ minHeight: '100vh' }}
      >
        {/* Icon / Visual */}
        <Box
          style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--accent-9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          <Spinner width='24' height='24' />
        </Box>

        {/* Title */}
        <Heading size='8' align='center'>
          Welcome 👋
          <AppIcon name='SvgSpinnersBlocksShuffle3' size={32} />
        </Heading>

        {/* Description */}
        <Text size='4' color='gray' align='center' style={{ maxWidth: 480 }}>
          Ini demo <strong>Radix UI Themes</strong> dengan dukungan dark / light mode
          berbasis sistem. Coba ubah theme OS kamu atau gunakan toggle di bawah.
        </Text>

        {/* Actions */}
        <Flex gap='3' wrap='wrap' justify='center'>
          <Button size='3'>Get Started</Button>
          <Button size='3' variant='outline'>
            Documentation
          </Button>
        </Flex>

        {/* Color Preview */}
        <Flex gap='2' mt='4'>
          {['violet', 'blue', 'green', 'orange', 'red'].map((color) => (
            <Box
              key={color}
              title={color}
              style={{
                width: 28,
                height: 28,
                borderRadius: 'var(--radius-2)',
                backgroundColor: `var(--${color}-9)`,
              }}
            />
          ))}
        </Flex>

        {/* Footer note */}
        <Text size='2' color='gray' align='center'>
          Warna dan background otomatis mengikuti system theme.
        </Text>
      </Flex>
    </Container>
  );
}
