import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Badge, Text, Checkbox, IconButton } from '@radix-ui/themes';

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'gray';
  onClick: (row: T) => void;
};

type NestedKeys<T, Prev extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
      ? `${Prev}${K & string}`
      : `${Prev}${K & string}` | NestedKeys<T[K], `${Prev}${K & string}.`>
    : `${Prev}${K & string}`;
}[keyof T];

type BadgeColor = React.ComponentProps<typeof Badge>['color'];
type TextColor = React.ComponentProps<typeof Text>['color'];
type TextWeight = React.ComponentProps<typeof Text>['weight'];

export function ColumnFactory<T>() {
  const getNestedValue = (row: any, path: string) => path.split('.').reduce((acc, key) => acc?.[key], row);

  return {
    selectColumn(): ColumnDef<T> {
      return {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(value === true)}
          />
        ),
        cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(value === true)} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      };
    },

    textColumn<K extends NestedKeys<T>>(path: K, header: string, options?: { color?: TextColor; weight?: TextWeight }): ColumnDef<T> {
      return {
        accessorFn: (row) => getNestedValue(row, path),
        header,
        cell: ({ getValue }) => {
          const value = getValue() as string | number | null | undefined;
          return (
            <Text size='2' color={options?.color} weight={options?.weight}>
              {value != null ? String(value) : '-'}
            </Text>
          );
        },
      };
    },

    numberColumn(keyOrPath: keyof T | string, header: string): ColumnDef<T> {
      return {
        accessorFn: (row) => (typeof keyOrPath === 'string' ? getNestedValue(row, keyOrPath) : row[keyOrPath]),
        header,
        cell: ({ getValue }) => {
          const value = getValue() as string | number | null | undefined;
          return (
            <Text size='2' align='right'>
              {value != null ? String(value) : '-'}
            </Text>
          );
        },
      };
    },

    dateColumn(keyOrPath: keyof T | string, header: string, locale: string = 'id-ID'): ColumnDef<T> {
      return {
        accessorFn: (row) => (typeof keyOrPath === 'string' ? getNestedValue(row, keyOrPath) : row[keyOrPath]),
        header,
        cell: ({ getValue }) => {
          const value = getValue() as string | null | undefined;
          if (!value) return <Text size='2'>-</Text>;
          const date = new Date(value);
          return <Text size='2'>{date.toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' })}</Text>;
        },
      };
    },

    statusBadgeColumn(keyOrPath: keyof T | string, header: string, map: Record<string, { label: string; color: BadgeColor }>): ColumnDef<T> {
      return {
        accessorFn: (row) => (typeof keyOrPath === 'string' ? getNestedValue(row, keyOrPath) : row[keyOrPath]),
        header,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          const config = map[value];
          if (!config)
            return (
              <Badge variant='soft' color='gray'>
                Unknown
              </Badge>
            );
          return (
            <Badge variant='soft' radius='full' color={config.color}>
              {config.label}
            </Badge>
          );
        },
      };
    },

    actionsColumn(getInlineActions: (row: T) => RowAction<T>[]): ColumnDef<T> {
      return {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        enableHiding: false,
        size: 80,
        cell: ({ row }) => {
          const actions = getInlineActions(row.original);
          if (actions.length === 0) return null;
          return (
            <div style={{ display: 'flex', gap: 4 }}>
              {actions.map((a) => (
                <IconButton
                  key={a.key}
                  size='1'
                  variant='ghost'
                  style={{ color: a.color ?? undefined }}
                  onClick={() => a.onClick(row.original)}
                  title={a.label}
                >
                  {a.icon ?? a.label[0]}
                </IconButton>
              ))}
            </div>
          );
        },
      };
    },
  };
}
