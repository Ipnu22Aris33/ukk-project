import { Flex, Table, Box } from '@radix-ui/themes';
import { ArrowUpIcon, ArrowDownIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { flexRender, type HeaderGroup } from '@tanstack/react-table';

interface TableHeaderProps<T> {
  headerGroups: HeaderGroup<T>[];
  enableSorting: boolean;
}

export function TableHeader<T>({ headerGroups, enableSorting }: TableHeaderProps<T>) {
  return (
    <Table.Header>
      {headerGroups.map((headerGroup) => (
        <Table.Row key={headerGroup.id}>
          {headerGroup.headers.map((header, index) => (
            <Table.ColumnHeaderCell
              key={header.id}
              onClick={header.column.getToggleSortingHandler()}
              style={{
                cursor: enableSorting && header.column.getCanSort() ? 'pointer' : 'default',
                textAlign: 'center',
                backgroundColor: 'var(--accent-9)',
                color: 'white',
                borderRight: index < headerGroup.headers.length - 1 ? '1px solid var(--gray-6)' : 'none',
              }}
            >
              <Flex gap='1' align='center' justify='center'>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {enableSorting && header.column.getCanSort() && (
                  <Box
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: header.column.getIsSorted() ? 'white' : 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {header.column.getIsSorted() === 'asc' && <ArrowUpIcon width='12' height='12' />}
                    {header.column.getIsSorted() === 'desc' && <ArrowDownIcon width='12' height='12' />}
                    {!header.column.getIsSorted() && <CaretSortIcon width='12' height='12' />}
                  </Box>
                )}
              </Flex>
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      ))}
    </Table.Header>
  );
}
