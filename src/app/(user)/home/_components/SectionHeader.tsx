import { Flex, Text, Button } from '@radix-ui/themes';
import { ArrowRightIcon } from '@radix-ui/react-icons';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader = ({ title, action, onAction }: Props) => (
  <Flex align='center' justify='between' mb='3'>
    <Text size='3' weight='bold' className='tracking-tight'>
      {title}
    </Text>
    {action && (
      <Button variant='ghost' size='1' onClick={onAction} className='cursor-pointer'>
        {action} <ArrowRightIcon />
      </Button>
    )}
  </Flex>
);
