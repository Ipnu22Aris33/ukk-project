import { Button, Flex, IconButton, DropdownMenu } from '@radix-ui/themes';
import { ReloadIcon, PlusIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Printer } from 'lucide-react';

interface ToolbarProps {
  isMobile: boolean;
  isLoading: boolean;
  showRefresh: boolean;
  showPrint: boolean;
  showAdd: boolean;
  refreshButtonLabel: string;
  printButtonLabel: string;
  addButtonLabel: string;
  onRefresh: () => void;
  onPrint: () => void;
  onAdd?: () => void;
}

export function Toolbar({
  isMobile,
  isLoading,
  showRefresh,
  showPrint,
  showAdd,
  refreshButtonLabel,
  printButtonLabel,
  addButtonLabel,
  onRefresh,
  onPrint,
  onAdd,
}: ToolbarProps) {
  const hasToolbarButtons = showRefresh || showPrint || showAdd;

  if (!hasToolbarButtons) return null;

  if (isMobile) {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant='soft' size='2'>
            <DotsHorizontalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {showRefresh && (
            <DropdownMenu.Item onClick={onRefresh}>
              <Flex gap='2' align='center'>
                <ReloadIcon />
                {refreshButtonLabel}
              </Flex>
            </DropdownMenu.Item>
          )}
          {showPrint && (
            <DropdownMenu.Item onClick={onPrint}>
              <Flex gap='2' align='center'>
                <Printer size={16} />
                {printButtonLabel}
              </Flex>
            </DropdownMenu.Item>
          )}
          {showAdd && onAdd && (
            <DropdownMenu.Item onClick={onAdd}>
              <Flex gap='2' align='center'>
                <PlusIcon />
                {addButtonLabel}
              </Flex>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  }

  return (
    <Flex gap='2'>
      {showRefresh && (
        <Button size='2' variant='soft' onClick={onRefresh} disabled={isLoading}>
          <Flex gap='2' align='center'>
            <ReloadIcon />
            {refreshButtonLabel}
          </Flex>
        </Button>
      )}
      {showPrint && (
        <Button size='2' variant='soft' onClick={onPrint}>
          <Flex gap='2' align='center'>
            <Printer size={16} />
            {printButtonLabel}
          </Flex>
        </Button>
      )}
      {showAdd && onAdd && (
        <Button size='2' variant='solid' onClick={onAdd}>
          <Flex gap='2' align='center'>
            <PlusIcon />
            {addButtonLabel}
          </Flex>
        </Button>
      )}
    </Flex>
  );
}
