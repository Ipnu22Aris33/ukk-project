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
}

export function TextareaField({
  field,
  label,
  placeholder,
  required = false,
  rows = 3,
  resize = true,
}: TextareaFieldProps) {
  return (
    <FieldWrapper field={field} label={label} required={required}>
      <TextArea
        size='3' // Sama dengan Input dan Select
        value={field.state.value}
        variant='soft'
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        rows={rows}
        resize={resize ? undefined : 'none'}
        className='w-full'
      />
    </FieldWrapper>
  );
}
