'use client';

import * as Form from '@radix-ui/react-form';
import * as Toggle from '@radix-ui/react-toggle';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';

interface InputFieldProps {
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'textarea';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  showPasswordToggle?: boolean;
  icon?: string;
  floatingLabel?: boolean;
  disabled?: boolean;
  error?: string;
  success?: string;
  style?: React.CSSProperties;
  variant?: 'outlined' | 'filled' | 'standard';
  validate?: (value: string) => string | boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  rows?: number;
}

export function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  name,
  id,
  className = '',
  showPasswordToggle = false,
  icon,
  floatingLabel = false,
  disabled = false,
  error: externalError,
  success,
  style,
  variant = 'outlined',
  validate,
  validateOnChange = true,
  validateOnBlur = true,
  pattern,
  minLength,
  maxLength,
  min,
  max,
  rows = 3,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState('');
  const [isTouched, setIsTouched] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const shouldShowPasswordToggle = type === 'password' && showPasswordToggle;
  const inputType = type === 'password' && showPassword ? 'text' : type;
  const hasValue = value.length > 0;
  const shouldFloat = floatingLabel && (hasValue || isFocused);

  // Validasi internal
  const validateInput = (valueToValidate: string): string => {
    if (required && !valueToValidate.trim()) {
      return `${label} is required`;
    }

    if (!valueToValidate.trim()) return '';

    if (pattern && valueToValidate) {
      const regex = new RegExp(pattern);
      if (!regex.test(valueToValidate)) {
        return `Invalid ${label.toLowerCase()} format`;
      }
    }

    if (minLength && valueToValidate.length < minLength) {
      return `Minimum ${minLength} characters required`;
    }

    if (maxLength && valueToValidate.length > maxLength) {
      return `Maximum ${maxLength} characters allowed`;
    }

    if (type === 'number') {
      const numValue = parseFloat(valueToValidate);
      if (!isNaN(numValue)) {
        if (min !== undefined && numValue < min) {
          return `Minimum value is ${min}`;
        }
        if (max !== undefined && numValue > max) {
          return `Maximum value is ${max}`;
        }
      }
    }

    if (type === 'email' && valueToValidate) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(valueToValidate)) {
        return 'Please enter a valid email address';
      }
    }

    if (validate) {
      const validationResult = validate(valueToValidate);
      if (typeof validationResult === 'string') {
        return validationResult;
      }
      if (validationResult === false) {
        return `Invalid ${label.toLowerCase()}`;
      }
    }

    return '';
  };

  // Run validation on value change
  useEffect(() => {
    if (validateOnChange && isTouched) {
      const error = validateInput(value);
      setInternalError(error);
    }
  }, [value, isTouched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!isTouched) setIsTouched(true);
    onChange(e);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!isTouched) setIsTouched(true);
    if (validateOnBlur) {
      const error = validateInput(value);
      setInternalError(error);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  // Prioritize external error over internal error
  const displayError = externalError || internalError;
  const hasError = !!displayError;
  const isValid = !hasError && isTouched && hasValue;

  // Variant styles
  const variantStyles = {
    outlined: {
      container: 'border rounded-lg',
      input: 'bg-transparent',
    },
    filled: {
      container: 'border-0 rounded-t-lg border-b',
      input: 'bg-(--gray-3) pt-6',
    },
    standard: {
      container: 'border-0 border-b rounded-none',
      input: 'bg-transparent px-0 pt-6',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Form.Field
      name={name || label.toLowerCase()}
      className={`relative ${className}`}
      style={style}
    >
      {floatingLabel ? (
        <div className='relative'>
          <div
            className={`relative ${currentVariant.container} ${hasError ? 'border-(--red-9)' : 'border-(--gray-7)'}`}
          >
            {/* Icon */}
            {icon && (
              <div
                className={`
                absolute 
                ${variant === 'standard' ? 'left-0' : 'left-3'}
                top-1/2 
                -translate-y-1/2
                z-20 flex items-center justify-center
              `}
              >
                <Icon
                  icon={icon}
                  className={`
                    w-5 h-5 
                    transition-all duration-200
                    ${
                      disabled
                        ? 'text-(--gray-8)'
                        : hasError
                          ? 'text-(--red-9)'
                          : isFocused || hasValue
                            ? 'text-(--accent-10)'
                            : 'text-(--gray-9)'
                    }
                  `}
                />
              </div>
            )}

            {/* Input atau Textarea */}
            <Form.Control asChild>
              {type === 'textarea' ? (
                <textarea
                  id={id}
                  placeholder={isFocused && !hasValue ? placeholder : ''}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  rows={rows}
                  className={`
                    w-full 
                    ${variant === 'standard' ? 'px-0 pb-1' : 'px-3'}
                    pt-6
                    pb-2
                    text-base
                    transition-all 
                    duration-200
                    ease-in-out
                    ${currentVariant.input}
                    text-(--gray-12)
                    outline-none
                    placeholder:text-(--gray-9)
                    placeholder:opacity-0
                    placeholder:transition-opacity
                    placeholder:duration-200
                    hover:border-(--accent-8)
                    focus:border-(--accent-9)
                    focus:placeholder:opacity-60
                    ${variant !== 'standard' ? 'focus:ring-2 focus:ring-opacity-50' : ''}
                    ${
                      hasError
                        ? 'border-(--red-9) focus:border-(--red-9) focus:ring-(--red-4)'
                        : 'hover:border-(--accent-8) focus:border-(--accent-9) focus:ring-(--accent-4)'
                    }
                    ${icon && variant !== 'standard' ? 'pl-10' : ''}
                    ${icon && variant === 'standard' ? 'pl-8' : ''}
                    ${shouldShowPasswordToggle && variant !== 'standard' ? 'pr-10' : ''}
                    ${shouldShowPasswordToggle && variant === 'standard' ? 'pr-8' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    resize-y
                    min-h-[44px]
                  `}
                />
              ) : (
                <input
                  id={id}
                  type={inputType}
                  placeholder={isFocused && !hasValue ? placeholder : ''}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  pattern={pattern}
                  minLength={minLength}
                  maxLength={maxLength}
                  min={min}
                  max={max}
                  className={`
                    w-full 
                    ${variant === 'standard' ? 'px-0 pb-1' : 'px-3'}
                    pt-6
                    pb-2
                    text-base
                    transition-all 
                    duration-200
                    ease-in-out
                    ${currentVariant.input}
                    text-(--gray-12)
                    outline-none
                    placeholder:text-(--gray-9)
                    placeholder:opacity-0
                    placeholder:transition-opacity
                    placeholder:duration-200
                    hover:border-(--accent-8)
                    focus:border-(--accent-9)
                    focus:placeholder:opacity-60
                    ${variant !== 'standard' ? 'focus:ring-2 focus:ring-opacity-50' : ''}
                    ${
                      hasError
                        ? 'border-(--red-9) focus:border-(--red-9) focus:ring-(--red-4)'
                        : 'hover:border-(--accent-8) focus:border-(--accent-9) focus:ring-(--accent-4)'
                    }
                    ${icon && variant !== 'standard' ? 'pl-10' : ''}
                    ${icon && variant === 'standard' ? 'pl-8' : ''}
                    ${shouldShowPasswordToggle && variant !== 'standard' ? 'pr-10' : ''}
                    ${shouldShowPasswordToggle && variant === 'standard' ? 'pr-8' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
              )}
            </Form.Control>

            {/* Floating Label */}
            <Form.Label
              className={`
                absolute 
                pointer-events-none
                transition-all 
                duration-200 
                ease-[cubic-bezier(0.0, 0, 0.2, 1)]
                origin-top-left
                ${
                  shouldFloat
                    ? `
                    top-2
                    text-xs 
                    font-medium
                    z-10
                    ${
                      hasError
                        ? 'text-(--red-9)'
                        : isFocused
                          ? 'text-(--accent-10)'
                          : 'text-(--gray-12)'
                    }
                    scale-75
                    translate-y-0
                  `
                    : `
                    top-1/2 
                    -translate-y-1/2
                    text-base
                    ${hasError ? 'text-(--red-9)' : 'text-(--gray-11)'}
                    scale-100
                  `
                }
                ${disabled ? 'text-(--gray-8)' : ''}
                ${
                  icon
                    ? shouldFloat
                      ? variant === 'standard'
                        ? 'left-8'
                        : 'left-10'
                      : variant === 'standard'
                        ? 'left-8'
                        : 'left-10'
                    : shouldFloat
                      ? variant === 'standard'
                        ? 'left-0'
                        : 'left-3'
                      : variant === 'standard'
                        ? 'left-0'
                        : 'left-3'
                }
              `}
            >
              {label}
              {required && <span className='text-(--red-9) ml-0.5'>*</span>}
            </Form.Label>

            {/* Password Toggle */}
            {shouldShowPasswordToggle && (
              <div
                className={`
                absolute 
                ${variant === 'standard' ? 'right-0' : 'right-3'}
                top-1/2 
                -translate-y-1/2
                flex items-center justify-center
              `}
              >
                <Toggle.Root
                  pressed={showPassword}
                  onPressedChange={handleTogglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={disabled}
                  className={`
                    p-1
                    rounded
                    transition-colors
                    duration-200
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-50
                    ${
                      disabled
                        ? 'text-(--gray-8) cursor-not-allowed'
                        : hasError
                          ? 'text-(--red-9) hover:text-(--red-9) focus-visible:ring-(--red-4)'
                          : isFocused
                            ? 'text-(--accent-10) focus-visible:ring-(--accent-4)'
                            : 'text-(--gray-9) hover:text-(--accent-10) focus-visible:ring-(--accent-4)'
                    }
                  `}
                >
                  <Icon icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'} className='w-5 h-5' />
                </Toggle.Root>
              </div>
            )}

            {/* Success Icon */}
            {isValid && (
              <div
                className={`
                absolute 
                ${variant === 'standard' ? 'right-0' : 'right-3'}
                top-1/2 
                -translate-y-1/2
                flex items-center justify-center
                ${shouldShowPasswordToggle ? 'right-10' : ''}
              `}
              >
                <Icon icon='mdi:check-circle' className='w-5 h-5 text-(--green-9)' />
              </div>
            )}
          </div>

          {/* Messages */}
          {displayError && (
            <Form.Message className='text-xs text-(--red-9) mt-1 ml-3 flex items-center gap-1'>
              <Icon icon='mdi:alert-circle' className='w-4 h-4 flex-shrink-0' />
              <span>{displayError}</span>
            </Form.Message>
          )}
          {success && !displayError && (
            <div className='text-xs text-(--green-9) mt-1 ml-3 flex items-center gap-1'>
              <Icon icon='mdi:check-circle' className='w-4 h-4 flex-shrink-0' />
              <span>{success}</span>
            </div>
          )}
        </div>
      ) : (
        /* Non-Floating Label */
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Form.Label className='text-sm font-medium text-(--gray-12)'>
              {label}
              {required && <span className='text-(--red-9) ml-1'>*</span>}
            </Form.Label>
            {isValid && <Icon icon='mdi:check-circle' className='w-4 h-4 text-(--green-9)' />}
          </div>

          <div className='relative'>
            {/* Icon */}
            {icon && (
              <div className='absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center'>
                <Icon
                  icon={icon}
                  className={`
                    w-5 h-5 
                    transition-colors duration-200
                    ${
                      disabled ? 'text-(--gray-8)' : hasError ? 'text-(--red-9)' : 'text-(--gray-9)'
                    }
                  `}
                />
              </div>
            )}

            {/* Input atau Textarea */}
            <Form.Control asChild>
              {type === 'textarea' ? (
                <textarea
                  id={id}
                  placeholder={placeholder}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  rows={rows}
                  className={`
                    w-full 
                    px-4 
                    py-3 
                    text-sm 
                    border 
                    rounded-lg
                    transition-all 
                    duration-200
                    ease-in-out
                    ${hasError ? 'border-(--red-9)' : 'border-(--gray-7)'}
                    bg-(--gray-2)
                    text-(--gray-12)
                    outline-none
                    placeholder:text-(--gray-9)
                    ${
                      hasError
                        ? 'hover:border-(--red-8) focus:border-(--red-9) focus:ring-2 focus:ring-(--red-4) focus:ring-opacity-50'
                        : 'hover:border-(--accent-8) focus:border-(--accent-9) focus:ring-2 focus:ring-(--accent-4) focus:ring-opacity-50'
                    }
                    shadow-sm
                    ${icon ? 'pl-10' : ''}
                    ${shouldShowPasswordToggle || isValid ? 'pr-12' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    resize-y
                    min-h-[44px]
                  `}
                />
              ) : (
                <input
                  id={id}
                  type={inputType}
                  placeholder={placeholder}
                  value={value}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required={required}
                  disabled={disabled}
                  pattern={pattern}
                  minLength={minLength}
                  maxLength={maxLength}
                  min={min}
                  max={max}
                  className={`
                    w-full 
                    px-4 
                    py-3 
                    text-sm 
                    border 
                    rounded-lg
                    transition-all 
                    duration-200
                    ease-in-out
                    ${hasError ? 'border-(--red-9)' : 'border-(--gray-7)'}
                    bg-(--gray-2)
                    text-(--gray-12)
                    outline-none
                    placeholder:text-(--gray-9)
                    ${
                      hasError
                        ? 'hover:border-(--red-8) focus:border-(--red-9) focus:ring-2 focus:ring-(--red-4) focus:ring-opacity-50'
                        : 'hover:border-(--accent-8) focus:border-(--accent-9) focus:ring-2 focus:ring-(--accent-4) focus:ring-opacity-50'
                    }
                    shadow-sm
                    ${icon ? 'pl-10' : ''}
                    ${shouldShowPasswordToggle || isValid ? 'pr-12' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
              )}
            </Form.Control>

            {/* Password Toggle */}
            {shouldShowPasswordToggle && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center'>
                <Toggle.Root
                  pressed={showPassword}
                  onPressedChange={handleTogglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className={`
                    p-1
                    rounded
                    transition-colors
                    duration-200
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-50
                    ${
                      hasError
                        ? 'text-(--red-9) hover:text-(--red-9) focus-visible:ring-(--red-4)'
                        : isFocused
                          ? 'text-(--accent-10) focus-visible:ring-(--accent-4)'
                          : 'text-(--gray-9) hover:text-(--accent-10) focus-visible:ring-(--accent-4)'
                    }
                  `}
                >
                  <Icon icon={showPassword ? 'mdi:eye' : 'mdi:eye-off'} className='w-5 h-5' />
                </Toggle.Root>
              </div>
            )}

            {/* Success Icon */}
            {isValid && !shouldShowPasswordToggle && (
              <div className='absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center'>
                <Icon icon='mdi:check-circle' className='w-5 h-5 text-(--green-9)' />
              </div>
            )}
          </div>

          {/* Messages */}
          {displayError && (
            <Form.Message className='text-xs text-(--red-9) flex items-center gap-1'>
              <Icon icon='mdi:alert-circle' className='w-4 h-4 flex-shrink-0' />
              <span>{displayError}</span>
            </Form.Message>
          )}
          {success && !displayError && (
            <div className='text-xs text-(--green-9) flex items-center gap-1'>
              <Icon icon='mdi:check-circle' className='w-4 h-4 flex-shrink-0' />
              <span>{success}</span>
            </div>
          )}
        </div>
      )}
    </Form.Field>
  );
}
