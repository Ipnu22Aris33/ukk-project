// components/DataTable/ActionsCell.tsx
import { Flex, IconButton } from '@radix-ui/themes';
import type { RowAction } from './types';

interface ActionsCellProps<T> {
  row: T;
  actions: RowAction<T>[];
}

export function ActionsCell<T>({ row, actions }: ActionsCellProps<T>) {
  return (
    <Flex gap='2' justify='center' align='center' style={{ width: '100%', height: '100%' }}>
      {actions.map((action) => (
        <IconButton
          key={action.key}
          size='1'
          variant='solid'
          color={action.color}
          onClick={() => action.onClick(row)}
          title={action.label}
        >
          {action.icon ?? action.label[0]}
        </IconButton>
      ))}
    </Flex>
  );
}