'use client';

import * as React from 'react';
import { Popover, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command } from 'cmdk';
import type { AnyFieldApi } from '@tanstack/react-form';
import { FieldWrapper } from './FieldWrapper';

type Option<T extends string | number> = {
  label: string;
  value: T;
};

interface SelectFieldProps<T extends string | number> {
  field: AnyFieldApi;
  label: string;
  options: Option<T>[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  searchable?: boolean;
  search?: string;
  onSearchChange?: (value: string) => void;
  error?: string;
}

export function SelectField<T extends string | number>({
  field,
  label,
  options,
  placeholder = 'Pilih...',
  required = false,
  icon,
  searchable = true,
  search: externalSearch,
  onSearchChange,
  error,
}: SelectFieldProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState('');

  const search = externalSearch !== undefined ? externalSearch : internalSearch;

  const handleSearchChange = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearch(value);
    }
  };

  const selected = options.find((opt) => opt.value === field.state.value);

  React.useEffect(() => {
    if (!open) {
      handleSearchChange('');
    }
  }, [open]);

  return (
    <FieldWrapper field={field} label={label} required={required} error={error}>
      {' '}
      {/* ← KIRIM ERROR KE FIELDWRAPPER */}
      <Popover.Root open={open} onOpenChange={setOpen}>
        {/* TRIGGER */}
        <Popover.Trigger>
          <button type='button' className='w-full text-left'>
            <TextField.Root
              size='3'
              variant='soft'
              className='w-full'
              value={selected?.label || ''}
              placeholder={placeholder}
              onClick={() => setOpen(true)}
              onChange={() => {}}
              color={error ? 'red' : undefined} // ← TAMBAHIN INI!
            >
              {icon && <TextField.Slot side='left'>{icon}</TextField.Slot>}

              {/* CHEVRON */}
              <TextField.Slot side='right'>
                <ChevronDownIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
              </TextField.Slot>
            </TextField.Root>
          </button>
        </Popover.Trigger>

        {/* POPOVER CONTENT */}
        <Popover.Content
          sideOffset={4}
          align='start'
          className='
            w-[--radix-popover-trigger-width]
            max-h-[--radix-popover-content-available-height]
            p-0
          '
        >
          <Command shouldFilter={!externalSearch}>
            {/* SEARCH - hanya tampil jika searchable true */}
            {searchable && (
              <Command.Input
                placeholder='Cari...'
                value={search}
                onValueChange={handleSearchChange}
                className='
                  w-full
                  border-b border-(--gray-6)
                  bg-transparent
                  px-3 py-2
                  text-sm
                  outline-none
                '
              />
            )}
            {/* LIST */}
            <Command.List className='max-h-[calc(var(--radix-popover-content-available-height)-64px)] overflow-y-auto p-1'>
              <Command.Empty className='px-2 py-1.5 text-sm text-(--gray-10)'>Data Tidak Ditemukan</Command.Empty>

              {options.map((opt) => (
                <Command.Item
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    field.handleChange(Number(opt.value));
                    setOpen(false);
                    handleSearchChange('');
                  }}
                  className='
                    flex items-center justify-between
                    rounded-(--radius-2)
                    px-2 py-1.5
                    text-sm
                    cursor-pointer
                    aria-selected:bg-(--accent-3)
                  '
                >
                  {opt.label}
                  {opt.value === field.state.value && <CheckIcon className='text-(--accent-9)' />}
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Root>
    </FieldWrapper>
  );
}
