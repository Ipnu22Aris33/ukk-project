'use client';

import { Button, Flex, Box } from '@radix-ui/themes';
import { SunIcon } from '@radix-ui/react-icons';
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
  widthMode?: 'full' | 'grid';
}

export function FormActions({
  canSubmit,
  isSubmitting,
  submitLabel = 'Save',
  showReset = false,
  resetLabel = 'Reset',
  onReset,
  showSecondaryAction = false,
  secondaryLabel = 'Cancel',
  onSecondaryAction,
  secondaryVariant = 'outline',
  secondaryColor = 'gray',
  layout = 'column',
  widthMode = 'full',
}: FormActionsProps) {
  const isFull = widthMode === 'full';

  return (
    <Box className={`mt-6 ${isFull ? 'w-full' : ''}`}>
      <Flex
        direction={layout}
        gap='3'
        className={`w-full ${layout === 'row' ? 'flex-row' : 'flex-col'}`}
        style={{ width: '100%' }}
      >
        <Submit asChild>
          <Button
            size='3'
            disabled={!canSubmit || isSubmitting}
            className={`${isFull ? 'w-full flex-1' : ''}`}
            style={{ flex: isFull && layout === 'row' ? 1 : 'auto' }}
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

        {showReset && onReset && (
          <Button
            type='button'
            variant='soft'
            color='gray'
            size='3'
            onClick={onReset}
            disabled={isSubmitting}
            className={`${isFull ? 'w-full flex-1' : ''}`}
            style={{ flex: isFull && layout === 'row' ? 1 : 'auto' }}
          >
            {resetLabel}
          </Button>
        )}

        {showSecondaryAction && onSecondaryAction && (
          <Button
            type='button'
            variant={secondaryVariant}
            color={secondaryColor}
            size='3'
            onClick={onSecondaryAction}
            disabled={isSubmitting}
            className={`${isFull ? 'w-full flex-1' : ''}`}
            style={{ flex: isFull && layout === 'row' ? 1 : 'auto' }}
          >
            {secondaryLabel}
          </Button>
        )}
      </Flex>
    </Box>
  );
}