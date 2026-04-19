'use client';

import { AlertDialog, Button, Flex } from '@radix-ui/themes';
import type { CategoryResponse } from '@/lib/schema/category';

interface DeleteCategoryDialogProps {
  deleteTarget: CategoryResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteCategoryDialog({ deleteTarget, onClose, onConfirm }: DeleteCategoryDialogProps) {
  return (
    <AlertDialog.Root
      open={!!deleteTarget}
      onOpenChange={(openState) => {
        if (!openState) onClose();
      }}
    >
      <AlertDialog.Content maxWidth='450px'>
        <AlertDialog.Title>Delete Category</AlertDialog.Title>
        <AlertDialog.Description size='2'>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
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
