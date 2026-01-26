'use client';

import { FieldWrapper } from './FieldWrapper';
import { TextField } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';

interface InputFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
}

export function InputField({ 
  field, 
  label, 
  type = 'text',
  placeholder,
  required = false 
}: InputFieldProps) {
  return (
    <FieldWrapper field={field} label={label} required={required}>
      <TextField.Root
        size="3"
        type={type}
        variant='soft'
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className="w-full"
      />
    </FieldWrapper>
  );
}