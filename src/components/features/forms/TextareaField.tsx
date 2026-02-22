'use client';

import { FieldWrapper } from './FieldWrapper';
import { TextArea } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';

interface TextareaFieldProps {
  field: AnyFieldApi;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  resize?: boolean;
  error?: string;
}

export function TextareaField({ field, label, placeholder, required = false, rows = 3, resize = true, error }: TextareaFieldProps) {
  // Menentukan apakah field memiliki error
  const hasError = !!error || field.state.meta.errors.length > 0;

  // Mendapatkan pesan error pertama jika ada
  const errorMessage = error || field.state.meta.errors[0]?.message;

  return (
    <FieldWrapper field={field} label={label} required={required} error={errorMessage}>
      <TextArea
        size='3'
        value={field.state.value}
        variant='soft'
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        resize={resize ? undefined : 'none'}
        className='w-full'
        color={hasError ? 'red' : undefined}
        aria-invalid={hasError}
      />
    </FieldWrapper>
  );
}
