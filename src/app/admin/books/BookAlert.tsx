'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes';

interface DeleteAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
}

export function BookAlert({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this data? This action cannot be undone.',
}: DeleteAlertDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content maxWidth='400px'>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size='2'>{description}</AlertDialog.Description>

        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray'>
              Cancel
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button variant='solid' color='red' onClick={onConfirm} loading={loading}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
