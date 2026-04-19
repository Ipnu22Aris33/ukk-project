import { Flex, Table, IconButton, ContextMenu } from '@radix-ui/themes';
import { flexRender, type Row } from '@tanstack/react-table';
import type { RowAction } from './types';

interface TableRowProps<T> {
  row: Row<T>;
  rowActions?: (row: T) => RowAction<T>[];
  enableContextMenu: boolean;
}

export function TableRow<T>({ row, rowActions, enableContextMenu }: TableRowProps<T>) {
  const actions = rowActions ? rowActions(row.original) : [];
  const hasActions = actions.length > 0;

  const rowContent = (
    <>
      {row.getVisibleCells().map((cell, cellIndex) => (
        <Table.Cell
          key={cell.id}
          style={{
            borderRight: cellIndex < row.getVisibleCells().length - 1 ? '1px solid var(--gray-7)' : 'none',
          }}
        >
          <Flex align='center' justify={cell.column.id === 'actions' ? 'center' : 'start'}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Flex>
        </Table.Cell>
      ))}
    </>
  );

  if (!hasActions || !enableContextMenu) {
    return <Table.Row key={row.id}>{rowContent}</Table.Row>;
  }

  return (
    <ContextMenu.Root key={row.id}>
      <ContextMenu.Trigger>
        <Table.Row>{rowContent}</Table.Row>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        {actions.map((action) => (
          <ContextMenu.Item key={action.key} color={action.color} onClick={() => action.onClick(row.original)}>
            <Flex gap='2' align='center'>
              {action.icon}
              {action.label}
            </Flex>
          </ContextMenu.Item>
        ))}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
