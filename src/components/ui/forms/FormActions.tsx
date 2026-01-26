'use client';

import { Button, Flex, Box } from '@radix-ui/themes';
import { SunIcon, ResetIcon } from '@radix-ui/react-icons';
import { Submit } from '@radix-ui/react-form';

interface FormActionsProps {
  canSubmit: boolean;
  isSubmitting: boolean;
  submitLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
  onReset?: () => void;
  showSecondaryAction?: boolean;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  secondaryVariant?: 'soft' | 'outline' | 'ghost' | 'solid';
  secondaryColor?: 'gray' | 'blue' | 'red' | 'green' | 'yellow';
  layout?: 'column' | 'row';
}

export function FormActions({
  canSubmit,
  isSubmitting,
  submitLabel = 'Simpan',
  showReset = true,
  resetLabel = 'Reset',
  onReset,
  showSecondaryAction = false,
  secondaryLabel = 'Cancel',
  onSecondaryAction,
  secondaryVariant = 'outline',
  secondaryColor = 'gray',
  layout = 'column',
}: FormActionsProps) {
  return (
    <Box className='mt-6'>
      <Flex gap='3' direction={layout} className={layout === 'row' ? 'flex-row-reverse' : ''}>
        <Submit asChild>
          <Button
            size='3'
            disabled={!canSubmit || isSubmitting}
            className={layout === 'row' ? 'flex-1' : 'w-full'}
          >
            {isSubmitting ? (
              <Flex align='center' justify='center' gap='2'>
                <SunIcon className='animate-spin' />
                Menyimpan...
              </Flex>
            ) : (
              submitLabel
            )}
          </Button>
        </Submit>

        {/* Reset Button */}
        {showReset && onReset && (
          <Button
            type='button'
            variant='soft'
            color='gray'
            size={layout === 'row' ? '3' : '2'}
            onClick={onReset}
            disabled={isSubmitting}
            className={layout === 'row' ? 'flex-1' : 'w-full'}
          >
            {resetLabel}
          </Button>
        )}

        {showSecondaryAction && onSecondaryAction && (
          <Button
            type='button'
            variant={secondaryVariant}
            color={secondaryColor}
            size={layout === 'row' ? '3' : '2'}
            onClick={onSecondaryAction}
            disabled={isSubmitting}
            className={layout === 'row' ? 'flex-1' : 'w-full'}
          >
            {secondaryLabel}
          </Button>
        )}
      </Flex>
    </Box>
  );
}
