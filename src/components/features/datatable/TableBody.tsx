import { Table, Text, Skeleton } from '@radix-ui/themes';
import { type Row, type ColumnDef } from '@tanstack/react-table';
import { TableRow } from './TableRow';
import type { RowAction } from './types';

interface TableBodyProps<T> {
  rows: Row<T>[];
  isLoading: boolean;
  isEmpty: boolean;
  searchValue: string;
  emptyMessage: string;
  columnsLength: number;
  rowActions?: (row: T) => RowAction<T>[];
  enableContextMenu: boolean;
}

export function TableBody<T>({
  rows,
  isLoading,
  isEmpty,
  searchValue,
  emptyMessage,
  columnsLength,
  rowActions,
  enableContextMenu,
}: TableBodyProps<T>) {
  if (isLoading) {
    return (
      <Table.Body>
        {Array.from({ length: 5 }).map((_, index) => (
          <Table.Row key={`skeleton-${index}`}>
            {Array.from({ length: columnsLength }).map((_, cellIndex) => (
              <Table.Cell
                key={`skeleton-cell-${cellIndex}`}
                style={{
                  borderRight: cellIndex < columnsLength - 1 ? '1px solid var(--gray-7)' : 'none',
                }}
              >
                <Skeleton>
                  <Text>Loading</Text>
                </Skeleton>
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    );
  }

  if (isEmpty) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={columnsLength} align='center' style={{ padding: '32px' }}>
            <Text size='2' color='gray'>
              {searchValue ? 'No results found' : emptyMessage}
            </Text>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body>
      {rows.map((row) => (
        <TableRow key={row.id} row={row} rowActions={rowActions} enableContextMenu={enableContextMenu} />
      ))}
    </Table.Body>
  );
}
