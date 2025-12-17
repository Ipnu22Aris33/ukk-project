import { Button, Container, Flex, Heading, Text, Box } from '@radix-ui/themes';
import { Icon } from '@iconify/react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
          <Icon icon='mdi:home' width={32} height={32} />
        </Box>

        {/* Title */}
        <Heading size='8' align='center'>
          Welcome 👋
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
