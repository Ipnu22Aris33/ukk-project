'use client';

import { Label } from '@radix-ui/react-label';
import { ReactNode, useState, Children, cloneElement, isValidElement } from 'react';

interface FloatingLabelInputProps {
  children: ReactNode;
  label: ReactNode;
  variant?: 'outline' | 'underline';
}

export function FloatingLabelInput({
  children,
  label,
  variant = 'outline',
}: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const child = Children.only(children);
  const childProps = isValidElement(child) ? child.props : {};
  const initialValue = (childProps as any).value || (childProps as any).defaultValue || '';

  const [initialized, setInitialized] = useState(false);
  if (!initialized && String(initialValue).length > 0) {
    setHasValue(true);
    setInitialized(true);
  }

  const isFloating = isFocused || hasValue;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (
      isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props &&
      'onFocus' in child.props
    ) {
      (child.props as any).onFocus?.(e);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    if (
      isValidElement(child) &&
      typeof child.props === 'object' &&
      child.props &&
      'onBlur' in child.props
    ) {
      (child.props as any).onBlur?.(e);
    }
  };

  const inputStyles = {
    outline:
      'px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:border-[var(--accent-9)] focus:ring-2 focus:ring-[var(--accent-4)]',
    underline:
      'px-0 pt-6 pb-2 border-b-2 border-gray-300 rounded-none focus:border-[var(--accent-9)] focus:ring-0',
  };

  const clonedInput = isValidElement(child)
    ? cloneElement(child as React.ReactElement<any>, {
        onFocus: handleFocus,
        onBlur: handleBlur,
        placeholder: isFocused ? (child.props as any).placeholder : '',
        className: `w-full bg-transparent outline-none transition-all duration-200 ${inputStyles[variant]} ${
          (child.props as any).className || ''
        }`,
      })
    : children;

  return (
    <div className='relative w-full'>
      {clonedInput}
      <Label
        className={`absolute left-${variant === 'outline' ? '4' : '0'} transition-all duration-200 pointer-events-none ${
          isFloating ? 'top-1.5 text-xs font-medium' : 'top-4 text-base text-gray-500'
        }`}
        style={
          isFloating
            ? {
                color: 'var(--accent-11)',
              }
            : undefined
        }
      >
        {label}
      </Label>
    </div>
  );
}
