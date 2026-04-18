import { Flex, Container, Box } from '@radix-ui/themes';
import ActivateForm from './_components/ActivateForm';

export default function ActivatePage() {
  return (
    <Flex align='center' justify='center' style={{ minHeight: '100vh', padding: '16px' }}>
      <Container size='1'>
        <Box>
          <ActivateForm />
        </Box>
      </Container>
    </Flex>
  );
}
