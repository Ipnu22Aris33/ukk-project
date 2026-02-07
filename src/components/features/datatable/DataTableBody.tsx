'use client';

import * as React from 'react';
import { Table, ContextMenu } from '@radix-ui/themes';
import { flexRender, type Row, type Cell } from '@tanstack/react-table';
import { useDataTableContext } from './DataTableProvider';

interface ContextMenuItem {
  label: string;
  icon?: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'gray';
  shortcut?: string;
  disabled?: boolean;
  onClick: (row: any) => void;
}

interface DataTableBodyProps {
  contextMenuItems?: ContextMenuItem[];
  rowContextMenuItems?: (row: any) => ContextMenuItem[];
}

function TableRowWithContextMenu({ 
  row, 
  menuItems 
}: { 
  row: Row<any>; 
  menuItems: ContextMenuItem[];
}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <Table.Row>
          {row.getVisibleCells().map((cell: Cell<any, any>) => (
            <Table.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        {menuItems.map((item, index) => (
          <ContextMenu.Item
            key={`${item.label}-${index}`}
            color={item.color}
            disabled={item.disabled}
            shortcut={item.shortcut}
            onClick={() => item.onClick(row.original)}
          >
            {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
            {item.label}
          </ContextMenu.Item>
        ))}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}

export function DataTableBody({ 
  contextMenuItems = [],
  rowContextMenuItems 
}: DataTableBodyProps) {
  const { table } = useDataTableContext<any>();
  const tableInstance = table as any;

  // Default context menu items
  const defaultContextMenuItems: ContextMenuItem[] = [
    {
      label: 'View Details',
      onClick: (row) => console.log('View:', row),
    },
    {
      label: 'Edit',
      onClick: (row) => console.log('Edit:', row),
    },
    {
      label: 'Delete',
      color: 'red',
      onClick: (row) => console.log('Delete:', row),
    },
  ];

  return (
    <Table.Root variant="surface">
      <Table.Header>
        {tableInstance.getHeaderGroups().map((headerGroup: any) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header: any) => (
              <Table.ColumnHeaderCell key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </Table.ColumnHeaderCell>
            ))}
          </Table.Row>
        ))}
      </Table.Header>

      <Table.Body>
        {tableInstance.getRowModel().rows.map((row: Row<any>) => {
          const menuItems = rowContextMenuItems 
            ? rowContextMenuItems(row.original)
            : contextMenuItems.length > 0 
              ? contextMenuItems 
              : defaultContextMenuItems;

          return (
            <TableRowWithContextMenu 
              key={row.id} 
              row={row} 
              menuItems={menuItems}
            />
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}