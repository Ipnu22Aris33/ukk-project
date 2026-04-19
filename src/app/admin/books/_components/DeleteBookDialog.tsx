'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import type { BookResponse } from '@/lib/schema/book';

interface DeleteBookDialogProps {
  deleteTarget: BookResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteBookDialog({ deleteTarget, onClose, onConfirm }: DeleteBookDialogProps) {
  return (
    <AlertDialog.Root
      open={!!deleteTarget}
      onOpenChange={(openState) => {
        if (!openState) onClose();
      }}
    >
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>Delete Book</AlertDialog.Title>
        <AlertDialog.Description size='2'>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
        </AlertDialog.Description>

        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray'>
              Cancel
            </Button>
          </AlertDialog.Cancel>

          <AlertDialog.Action>
            <Button color='red' onClick={onConfirm}>
              Delete
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
