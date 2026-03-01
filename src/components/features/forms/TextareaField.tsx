'use client';

import { FieldWrapper } from './FieldWrapper';
import { TextArea, Flex, Box } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';

interface TextareaFieldProps {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  resize?: boolean;
  error?: string;
  icon?: React.ReactNode;
}

export function TextareaField({ field, label, placeholder, required = false, rows = 3, resize = true, error, icon }: TextareaFieldProps) {
  const hasError = !!error || field.state.meta.errors.length > 0;
  const errorMessage = error || field.state.meta.errors[0]?.message;

  return (
    <FieldWrapper field={field} label={label} required={required} error={errorMessage}>
      <Flex style={{ position: 'relative' }}>
        {icon && (
          <Box
            style={{
              position: 'absolute',
              padding: '0px 8px 0px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '40px',
              width: '40px',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {icon}
          </Box>
        )}

        <TextArea
          size='3'
          value={field.state.value || ''}
          variant='soft'
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          placeholder={placeholder}
          rows={rows}
          resize={resize ? undefined : 'none'}
          className='w-full'
          color={hasError ? 'red' : undefined}
          aria-invalid={hasError}
          style={{
            padding: icon ? '0px 0px 0px 28px' : undefined,
          }}
        />
      </Flex>
    </FieldWrapper>
  );
}
