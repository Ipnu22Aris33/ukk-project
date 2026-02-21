// components/forms/FieldWrapper.tsx
'use client';

import * as Form from '@radix-ui/react-form';

interface FieldWrapperProps {
  field: any;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string; // ← TAMBAH INI
}

export function FieldWrapper({
  field,
  label,
  required = false,
  children,
  className = '',
  error, // ← TERIMA ERROR
}: FieldWrapperProps) {
  return (
    <Form.Field className={`grid ${className}`} name={field?.name}>
      <Form.Label className='text-sm font-medium mb-2'>
        {label} {required && <span className='text-red-500'>*</span>}
      </Form.Label>
      {children}
      {/* Prioritaskan error dari props, fallback ke field error */}
      {(error) && (
        <Form.Message className='text-sm text-red-500 mt-1'>{error}</Form.Message>
      )}
    </Form.Field>
  );
}
