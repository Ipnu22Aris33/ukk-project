'use client';

import { FieldWrapper } from './FieldWrapper';
import { Select } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  field: AnyFieldApi;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export function SelectField({
  field,
  label,
  options,
  placeholder = 'Pilih opsi',
  required = false,
}: SelectFieldProps) {
  return (
    <FieldWrapper field={field} label={label} required={required}>
      <Select.Root
        size="3"
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        onOpenChange={(open) => !open && field.handleBlur()}
      >
        <Select.Trigger
          variant="soft"
          placeholder={placeholder}
          className="w-full"
        />
        <Select.Content 
          variant="soft" 
          position="popper" 
          sideOffset={10}
        >
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </FieldWrapper>
  );
}