'use client';

import * as React from 'react';
import { Popover, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';
import { Command } from 'cmdk';
import type { AnyFieldApi } from '@tanstack/react-form';
import { FieldWrapper } from './FieldWrapper';

type Option = {
  label: string;
  value: string;
};

interface SelectFieldProps {
  field: AnyFieldApi;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export function SelectField({ field, label, options, placeholder = 'Pilih...', required = false, icon }: SelectFieldProps) {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === field.state.value);

  return (
    <FieldWrapper field={field} label={label} required={required}>
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
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
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
            p-0
          '
        >
          <Command>
            {/* SEARCH */}
            <Command.Input
              placeholder='Cari...'
              className='
                w-full
                border-b border-(--gray-6)
                bg-transparent
                px-3 py-2
                text-sm
                outline-none
              '
            />

            {/* LIST */}
            <Command.List className='max-h-60 overflow-y-auto p-1'>
              <Command.Empty className='px-2 py-1.5 text-sm text-(--gray-10)'>Tidak ada data</Command.Empty>

              {options.map((opt) => (
                <Command.Item
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => {
                    field.handleChange(opt.value);
                    setOpen(false);
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
