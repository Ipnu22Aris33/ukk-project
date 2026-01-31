'use client';

import React from 'react';
import { flexRender } from '@tanstack/react-table';
import { Table, Checkbox, Flex } from '@radix-ui/themes';
import { ChevronUpIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { DataTableEmpty } from './DataTableEmpty';

interface DataTableBodyProps<TData> {
  table: any;
  enableSelection?: boolean;
}

export function DataTableBody<TData>({
  table,
  enableSelection = true,
}: DataTableBodyProps<TData>) {
  // Tambah select column jika enable
  if (enableSelection) {
    const columns = table.getAllColumns();
    const hasSelectColumn = columns.some((col: any) => col.id === 'select');
    
    if (!hasSelectColumn) {
      table.setOptions((prev: any) => ({
        ...prev,
        columns: [
          {
            id: 'select',
            header: ({ table }: { table: any }) => (
              <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                size="2"
              />
            ),
            cell: ({ row }: { row: any }) => (
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                size="2"
              />
            ),
            enableSorting: false,
            enableHiding: false,
          },
          ...prev.columns,
        ],
      }));
    }
  }

  if (table.getRowModel().rows.length === 0) {
    return <DataTableEmpty />;
  }

  return (
    <Table.Root variant="surface" size="2" layout="auto">
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup: any) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <Table.ColumnHeaderCell key={header.id}>
                {header.isPlaceholder ? null : (
                  <Flex
                    align="center"
                    gap="2"
                    style={{ 
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none'
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <Flex direction="column">
                        <ChevronUpIcon
                          style={{ 
                            height: '12px', 
                            width: '12px',
                            color: header.column.getIsSorted() === 'asc' 
                              ? 'var(--accent-11)' 
                              : 'var(--gray-8)'
                          }}
                        />
                        <ChevronDownIcon
                          style={{ 
                            height: '12px', 
                            width: '12px',
                            marginTop: '-4px',
                            color: header.column.getIsSorted() === 'desc' 
                              ? 'var(--accent-11)' 
                              : 'var(--gray-8)'
                          }}
                        />
                      </Flex>
                    )}
                  </Flex>
                )}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map((row: any) => (
          <Table.Row key={row.id} align="center">
            {row.getVisibleCells().map((cell: any) => (
              <Table.Cell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}