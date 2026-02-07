'use client';

import * as React from 'react';
import { Flex, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useDataTableContext } from './DataTableProvider';

export function DataTableToolbar() {
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
    <Flex mb="4" gap="3" align="center">
      <TextField.Root
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Search..."
        style={{ width: 260 }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>
      </TextField.Root>
    </Flex>
  );
}