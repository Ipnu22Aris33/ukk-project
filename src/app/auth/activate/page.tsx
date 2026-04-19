import { Flex, Container, Box } from '@radix-ui/themes';
import ActivateForm from './_components/ActivateForm';

export default function ActivatePage() {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        minHeight: '100dvh',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      <Container
        size="1"
        style={{
          width: '100%',
        }}
      >
        <Box>
          <ActivateForm />
        </Box>
      </Container>
    </Flex>
  );
}