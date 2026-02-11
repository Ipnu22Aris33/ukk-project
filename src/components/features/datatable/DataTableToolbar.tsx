'use client';

import * as React from 'react';
import { Flex, TextField, Box, DropdownMenu, IconButton } from '@radix-ui/themes';
import { MagnifyingGlassIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useDataTableContext } from './DataTableProvider';

interface DataTableToolbarProps {
  actions?: React.ReactNode;
  showSearch?: boolean; // Opsional: kontrol apakah search ditampilkan
  searchPlaceholder?: string;
}

export function DataTableToolbar({ 
  actions, 
  showSearch = true,
  searchPlaceholder = "Search..." 
}: DataTableToolbarProps) {
  const { search, setSearch, setPagination, table } = useDataTableContext<any>();

  const handleSearchChange = React.useCallback(
    (value: string) => {
      setSearch(value);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
      table.setPageIndex(0);
    },
    [setSearch, setPagination, table]
  );

  return (
    <Flex mb="4" gap="3" align="center" justify="between" wrap="wrap">
      {/* Kiri: Search (jika diaktifkan) */}
      {showSearch && (
        <Box style={{ flex: '1', maxWidth: '300px', minWidth: '200px' }}>
          <TextField.Root
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            style={{ width: '100%' }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon />
            </TextField.Slot>
          </TextField.Root>
        </Box>
      )}

      {/* Kanan: Actions */}
      {actions && (
        <Flex 
          gap='3' 
          align='center' 
          ml={showSearch ? 'auto' : undefined}
          display={{ initial: 'none', sm: 'flex' }}
        >
          {actions}
        </Flex>
      )}

      {/* Mobile Actions (jika ada actions) */}
      {actions && (
        <Box display={{ initial: 'block', sm: 'none' }}>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton variant='soft' size='2'>
                <DotsHorizontalIcon />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <Flex direction='column' gap='2'>
                {React.Children.toArray(actions).map((action, index) => (
                  <React.Fragment key={index}>{action}</React.Fragment>
                ))}
              </Flex>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Box>
      )}
    </Flex>
  );
}