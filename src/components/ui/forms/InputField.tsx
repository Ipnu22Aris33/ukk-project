'use client';

import { FieldWrapper } from './FieldWrapper';
import { TextField, IconButton } from '@radix-ui/themes';
import type { AnyFieldApi } from '@tanstack/react-form';
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

interface InputFieldProps {
  field: AnyFieldApi;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function InputField({ 
  field, 
  label, 
  type = 'text',
  placeholder,
  required = false,
  icon
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Tentukan tipe input yang akan digunakan
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <FieldWrapper field={field} label={label} required={required}>
      <TextField.Root
        size="3"
        type={inputType}
        variant='soft'
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        className="w-full"
      >
        {icon && (
          <TextField.Slot side="left">
            {icon}
          </TextField.Slot>
        )}
        
        {type === 'password' && (
          <TextField.Slot side="right" className="pr-1">
            <IconButton
              type="button"
              size="1"
              variant="ghost"
              className="hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </IconButton>
          </TextField.Slot>
        )}
      </TextField.Root>
    </FieldWrapper>
  );
}