// components/forms/FieldWrapper.tsx
'use client';

import * as Form from '@radix-ui/react-form';

interface FieldWrapperProps {
  field: any;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function FieldWrapper({ 
  field, 
  label, 
  required = false, 
  children,
  className = ''
}: FieldWrapperProps) {
  return (
    <Form.Field className={`grid ${className}`} name={field?.name}>
      <Form.Label className="text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </Form.Label>
      {children}
      {field?.state?.meta?.errors?.length > 0 && (
        <Form.Message className="text-sm text-red-500 mt-1">
          {field.state.meta.errors[0]}
        </Form.Message>
      )}
    </Form.Field>
  );
}