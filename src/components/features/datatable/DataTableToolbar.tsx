'use client';

import React from 'react';
import { TextField, Flex, IconButton, Text, Button, Box, DropdownMenu } from '@radix-ui/themes';
import { MagnifyingGlassIcon, Cross2Icon, MixerHorizontalIcon } from '@radix-ui/react-icons';
import { useResponsive } from '@/hooks/useResponsive';

interface DataTableToolbarProps<TData> {
  table: any;
  enableSearch?: boolean;
  enableColumnToggle?: boolean;
  enableSelection?: boolean;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  table,
  enableSearch = true,
  enableColumnToggle = true,
  enableSelection = true,
  searchPlaceholder = 'Search...',
}: DataTableToolbarProps<TData>) {
  const { isMobile } = useResponsive();
  const selectedRows = Object.keys(table.getState().rowSelection).length;

  return (
    <Box mb='6'>
      <Flex direction='row' gap='4' align='center'>
        {/* Kiri: Search Box */}
        {enableSearch && (
          <Box style={{ position: 'relative', flex: 1 }}>
            <TextField.Root
              size='2'
              placeholder={searchPlaceholder}
              value={table.getState().globalFilter ?? ''}
              onChange={(e) => table.setGlobalFilter(e.target.value)}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height='16' width='16' />
              </TextField.Slot>
              {table.getState().globalFilter && (
                <TextField.Slot>
                  <IconButton size='1' variant='ghost' onClick={() => table.setGlobalFilter('')}>
                    <Cross2Icon height='16' width='16' />
                  </IconButton>
                </TextField.Slot>
              )}
            </TextField.Root>
          </Box>
        )}

        {/* Kanan: Column Toggle */}
        {enableColumnToggle && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              {isMobile ? (
                <IconButton variant='soft' size='2'>
                  <MixerHorizontalIcon />
                </IconButton>
              ) : (
                <Button variant='soft' size='2'>
                  <MixerHorizontalIcon />
                  Columns
                  <DropdownMenu.TriggerIcon />
                </Button>
              )}
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size='2'>
              <DropdownMenu.Label>{isMobile ? 'Columns' : 'Show/Hide Columns'}</DropdownMenu.Label>
              <DropdownMenu.Separator />
              {table
                .getAllColumns()
                .filter((column: any) => column.getCanHide() && column.id !== 'select')
                .map((column: any) => (
                  <DropdownMenu.CheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.columnDef.header?.toString() || column.id}
                  </DropdownMenu.CheckboxItem>
                ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </Flex>
    </Box>
  );
}
