'use client';

import React, { useState } from 'react';
import { Flex, Text, IconButton, Button, Select, TextField, DropdownMenu, Box } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';

interface DataTableFooterProps<TData> {
  table: any;
  enableSelection?: boolean;
  manualPagination?: boolean;
  meta?: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    isLoading?: boolean;
  };
}

export function DataTableFooter<TData>({ table, enableSelection = true, manualPagination = false, meta }: DataTableFooterProps<TData>) {
  const [goToPage, setGoToPage] = useState('');

  const getPageButtons = () => {
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const start = Math.max(0, Math.min(currentPage - 2, pageCount - 5));

    return Array.from({ length: 5 }, (_, i) => start + i);
  };

  const pageButtons = getPageButtons();

  // Untuk manual pagination, gunakan meta data
  const totalItems = manualPagination ? meta?.totalItems || 0 : table.getFilteredRowModel().rows.length;
  const visibleItems = manualPagination ? table.getRowModel().rows.length : table.getRowModel().rows.length;

  return (
    <Flex direction={{ initial: 'column', sm: 'row' }} align='center' justify='between' gap='4' mt='6'>
      {/* Kiri: Info & Page Size */}
      <Flex align='center' gap='4' wrap='wrap' justify={{ initial: 'center', sm: 'start' }}>
        <Text size='2' color='gray'>
          Showing{' '}
          <Text weight='medium' as='span'>
            {visibleItems}
          </Text>{' '}
          of{' '}
          <Text weight='medium' as='span'>
            {totalItems}
          </Text>
        </Text>

        {/* Page Size Selector */}
        <Flex align='center' gap='2'>
          {/* "Show" text - hidden on mobile */}
          <Box display={{ initial: 'none', sm: 'block' }}>
            <Text size='2' color='gray'>
              Show
            </Text>
          </Box>

          <Select.Root
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <Select.Trigger />
            <Select.Content>
              {[5, 10, 20, 30, 50].map((pageSize) => (
                <Select.Item key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* "entries" text - hidden on mobile */}
          <Box display={{ initial: 'none', sm: 'block' }}>
            <Text size='2' color='gray'>
              entries
            </Text>
          </Box>
        </Flex>
      </Flex>

      {/* Kanan: Page Navigation */}
      {table.getPageCount() > 0 && (
        <Flex align='center' gap='4' wrap='wrap' justify={{ initial: 'center', sm: 'end' }}>
          {/* Page Info - hidden on mobile */}
          <Box display={{ initial: 'none', sm: 'block' }}>
            <Text size='2' color='gray'>
              Page{' '}
              <Text weight='medium' as='span'>
                {table.getState().pagination.pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text weight='medium' as='span'>
                {table.getPageCount()}
              </Text>
            </Text>
          </Box>

          {/* Page Buttons */}
          <Flex gap='1' align='center'>
            {/* Mobile Page Info */}
            <Box display={{ initial: 'block', sm: 'none' }}>
              <Text size='2' color='gray'>
                {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
              </Text>
            </Box>

            {/* First Page - hidden on mobile */}
            <Box display={{ initial: 'none', sm: 'block' }}>
              <IconButton onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} variant='soft' size='2'>
                <DoubleArrowLeftIcon />
              </IconButton>
            </Box>

            {/* Previous Page */}
            <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} variant='soft' size='2'>
              <ChevronLeftIcon />
            </IconButton>

            {/* Page Number Buttons - Desktop */}
            <Box display={{ initial: 'none', sm: 'block' }}>
              <Flex gap='1'>
                {pageButtons.map((pageIndex) => (
                  <Button
                    key={pageIndex}
                    variant={table.getState().pagination.pageIndex === pageIndex ? 'solid' : 'soft'}
                    size='2'
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                ))}
              </Flex>
            </Box>

            {/* Page Number Dropdown - Mobile */}
            <Box display={{ initial: 'block', sm: 'none' }}>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <Button variant='soft' size='2'>
                    <DotsHorizontalIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                    <DropdownMenu.Item key={pageIndex} onClick={() => table.setPageIndex(pageIndex)}>
                      Page {pageIndex + 1}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </Box>

            {/* Next Page */}
            <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} variant='soft' size='2'>
              <ChevronRightIcon />
            </IconButton>

            {/* Last Page - hidden on mobile */}
            <Box display={{ initial: 'none', sm: 'block' }}>
              <IconButton onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} variant='soft' size='2'>
                <DoubleArrowRightIcon />
              </IconButton>
            </Box>
          </Flex>

          {/* Go to Page - Desktop */}
          <Box display={{ initial: 'none', sm: 'block' }}>
            <Flex align='center' gap='2'>
              <Text size='2' color='gray'>
                Go to
              </Text>
              <TextField.Root
                size='1'
                type='number'
                min='1'
                max={table.getPageCount()}
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                style={{ width: '60px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt(goToPage);
                    if (!isNaN(page) && page >= 1 && page <= table.getPageCount()) {
                      table.setPageIndex(page - 1);
                      setGoToPage('');
                    }
                  }
                }}
              />
            </Flex>
          </Box>
        </Flex>
      )}
    </Flex>
  );
}
