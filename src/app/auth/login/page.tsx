import { Flex, Container, Box } from '@radix-ui/themes';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <Flex
      align='center'
      justify='center'
      style={{
        minHeight: '100dvh',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <Container
        size='1'
        style={{
          width: '100%',
        }}
      >
        <Box>
          <LoginForm />
        </Box>
      </Container>
    </Flex>
  );
}
