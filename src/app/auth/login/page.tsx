import { Flex, Container, Box } from '@radix-ui/themes';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <Flex align='center' justify='center' style={{ minHeight: '100vh', padding: '16px' }}>
      <Container size='1'>
        <Box>
          <LoginForm />
        </Box>
      </Container>
    </Flex>
  );
}
