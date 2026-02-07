// datatable/columnFactory.ts
import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { Badge, DropdownMenu, ContextMenu, IconButton, Text, Checkbox } from '@radix-ui/themes';
import { DotsHorizontalIcon, EyeOpenIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

/* =======================
 * TYPES
 * ======================= */

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'gray';
  onClick: (row: T) => void;
};

type ActionOverride = Partial<Omit<RowAction<any>, 'key' | 'onClick'>>;

type ActionsColumnOptions<T> = {
  useDefault?: boolean;
  handlers?: {
    view?: (row: T) => void;
    edit?: (row: T) => void;
    delete?: (row: T) => void;
  };
  override?: {
    view?: ActionOverride;
    edit?: ActionOverride;
    delete?: ActionOverride;
  };
  actions?: RowAction<T>[];
};

/* =======================
 * DEFAULT ACTION TEMPLATE
 * ======================= */

const defaultActions = {
  view: {
    key: 'view',
    label: 'View',
    icon: <EyeOpenIcon />,
  },
  edit: {
    key: 'edit',
    label: 'Edit',
    icon: <Pencil1Icon />,
  },
  delete: {
    key: 'delete',
    label: 'Delete',
    icon: <TrashIcon />,
    color: 'red' as const,
  },
};

type BadgeColor = React.ComponentProps<typeof Badge>['color'];
type TextColor = React.ComponentProps<typeof Text>['color'];
type TextWeight = React.ComponentProps<typeof Text>['weight'];

export function ColumnFactory<T>() {
  return {
    /* =======================
     * SELECT / CHECKBOX
     * ======================= */
    selectColumn(): ColumnDef<T> {
      return {
        id: 'select',

        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? 'indeterminate' : false}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(value === true);
            }}
          />
        ),

        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              row.toggleSelected(value === true);
            }}
          />
        ),

        enableSorting: false,
        enableHiding: false,
        size: 40,
      };
    },
    /* =======================
     * TEXT COLUMN (default)
     * ======================= */
    textColumn<K extends keyof T>(
      key: K,
      header: string,
      options?: {
        color?: TextColor;
        weight?: TextWeight;
      }
    ): ColumnDef<T> {
      return {
        accessorKey: key as string,
        header,
        cell: ({ row }) => (
          <Text size='2' color={options?.color} weight={options?.weight}>
            {row.getValue(key as string)}
          </Text>
        ),
      };
    },

    /* =======================
     * NUMBER COLUMN
     * ======================= */
    numberColumn<K extends keyof T>(key: K, header: string): ColumnDef<T> {
      return {
        accessorKey: key as string,
        header,
        cell: ({ row }) => (
          <Text size='2' align='right'>
            {row.getValue(key as string)}
          </Text>
        ),
      };
    },

    /* =======================
     * DATE COLUMN
     * ======================= */
    dateColumn<K extends keyof T>(key: K, header: string, locale: string = 'id-ID'): ColumnDef<T> {
      return {
        accessorKey: key as string,
        header,
        cell: ({ row }) => {
          const value = row.getValue(key as string);
          if (!value) return <Text size='2'>-</Text>;

          const date = new Date(value as string);

          return (
            <Text size='2'>
              {date.toLocaleDateString(locale, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          );
        },
      };
    },

    /* =======================
     * STATUS BADGE COLUMN
     * ======================= */
    statusBadgeColumn<K extends keyof T>(
      key: K,
      header: string,
      map: Record<
        string,
        {
          label: string;
          color: BadgeColor;
        }
      >
    ): ColumnDef<T> {
      return {
        accessorKey: key as string,
        header,
        cell: ({ row }) => {
          const value = row.getValue(key as string) as string;
          const config = map[value];

          if (!config) {
            return (
              <Badge variant='soft' color='gray'>
                Unknown
              </Badge>
            );
          }

          return (
            <Badge variant='soft' radius='full' color={config.color}>
              {config.label}
            </Badge>
          );
        },
      };
    },

    /* =======================
     * ACTIONS COLUMN
     * ======================= */
    actionsColumn(options: ActionsColumnOptions<T>): ColumnDef<T> {
      return {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableHiding: false,
        size: 48,

        cell: ({ row }) => {
          const actions: RowAction<T>[] = [];

          /* ===== DEFAULT ACTIONS ===== */
          if (options.useDefault && options.handlers) {
            if (options.handlers.view) {
              actions.push({
                ...defaultActions.view,
                ...options.override?.view,
                onClick: options.handlers.view,
              });
            }

            if (options.handlers.edit) {
              actions.push({
                ...defaultActions.edit,
                ...options.override?.edit,
                onClick: options.handlers.edit,
              });
            }

            if (options.handlers.delete) {
              actions.push({
                ...defaultActions.delete,
                ...options.override?.delete,
                onClick: options.handlers.delete,
              });
            }
          }

          /* ===== EXTRA ACTIONS ===== */
          if (options.actions) {
            actions.push(...options.actions);
          }

          if (actions.length === 0) return null;

          /* =======================
           * RENDER
           * ======================= */

          const menuItems = actions.map((action) => (
            <DropdownMenu.Item key={action.key} color={action.color} onClick={() => action.onClick(row.original)}>
              {action.icon && <span style={{ marginRight: 8 }}>{action.icon}</span>}
              {action.label}
            </DropdownMenu.Item>
          ));

          return (
            <ContextMenu.Root>
              {/* ===== SECONDARY: RIGHT CLICK ===== */}

              <ContextMenu.Trigger>
                {/* ===== PRIMARY: ICON CLICK ===== */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <IconButton size='1' variant='ghost'>
                      <DotsHorizontalIcon />
                    </IconButton>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Content align='end'>{menuItems}</DropdownMenu.Content>
                </DropdownMenu.Root>
              </ContextMenu.Trigger>

              {/* ===== CONTEXT MENU CONTENT ===== */}
              <ContextMenu.Content>
                {actions.map((action) => (
                  <ContextMenu.Item key={action.key} color={action.color} onClick={() => action.onClick(row.original)}>
                    {action.icon && <span style={{ marginRight: 8 }}>{action.icon}</span>}
                    {action.label}
                  </ContextMenu.Item>
                ))}
              </ContextMenu.Content>
            </ContextMenu.Root>
          );
        },
      };
    },
  };
}
