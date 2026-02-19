'use client';
import * as React from 'react';
import { Table, ContextMenu } from '@radix-ui/themes';
import { flexRender, type Row } from '@tanstack/react-table';
import { useDataTableContext } from './DataTableProvider';
import type { RowAction } from './ColumnFactory';

interface DataTableBodyProps<T> {
  rowActions?: (row: T) => RowAction<T>[]; // per row
}

export function DataTableBody<T>({ rowActions }: DataTableBodyProps<T>) {
  const { table } = useDataTableContext<T>();

  return (
    <Table.Root variant='surface'>
      <Table.Header>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.ColumnHeaderCell key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {table.getRowModel().rows.map((row: Row<T>) => {
          const actions = rowActions ? rowActions(row.original) : [];
          const hasActions = actions.length > 0;

          if (!hasActions) {
            return (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                ))}
              </Table.Row>
            );
          }

          return (
            <ContextMenu.Root key={row.id}>
              <ContextMenu.Trigger>
                <Table.Row>
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Table.Cell>
                  ))}
                </Table.Row>
              </ContextMenu.Trigger>

              <ContextMenu.Content>
                {actions.map((action) => (
                  <ContextMenu.Item key={action.key} color={action.color} onClick={() => action.onClick(row.original)}>
                    {action.label}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}
