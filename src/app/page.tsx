import { Button, Container, Flex, Heading, Text, Box } from '@radix-ui/themes';
import { AppIcon } from '@/components/ui/AppIcon';

export default function HomeView() {
  return (
    <Container size='3'>
      <Flex
        direction='column'
        align='center'
        justify='center'
        gap='6'
        style={{ minHeight: '80vh' }}
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
          <AppIcon name='SvgSpinnersBlocksShuffle3' size={32} />
        </Box>

        {/* Title */}
        <Heading size='8' align='center'>
          Welcome 👋
        </Heading>

        {/* Description */}
        <Text size='4' color='gray' align='center' style={{ maxWidth: 480 }}>
          Ini demo <strong>Radix UI Themes</strong> dengan dukungan dark / light mode berbasis
          sistem. Coba ubah theme OS kamu atau gunakan toggle di bawah.
        </Text>

        {/* Actions */}
        <Flex gap='3' wrap='wrap' justify='center'>
          <Button size='3'>Get Started</Button>
          <Button size='3' variant='outline'>
            Documentation
          </Button>
        </Flex>
      </Flex>
    </Container>
  );
}
