import { type ColumnDef } from '@tanstack/react-table';

export type MetaData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
};

export type RowAction<T> = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  color?: 'red' | 'blue' | 'green' | 'orange' | 'gray';
  onClick: (row: T) => void;
};

export type NestedKeys<T, Prev extends string = ''> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Array<any>
      ? `${Prev}${K & string}`
      : `${Prev}${K & string}` | NestedKeys<T[K], `${Prev}${K & string}.`>
    : `${Prev}${K & string}`;
}[keyof T];

export type ColDataTable<T> = ColumnDef<T> & {
  accessorKey: NestedKeys<T>;
};

export type PrintConfig = {
  title: string;
  institution?: string;
  subtitle?: string;
  period?: string;
};

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  meta?: MetaData;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  rowActions?: (row: T) => RowAction<T>[];
  enableSearch?: boolean;
  enablePagination?: boolean;
  enableSorting?: boolean;
  enablePageSize?: boolean;
  enableContextMenu?: boolean;
  emptyMessage?: string;
  pageSizes?: number[];
  searchDebounceMs?: number;
  refreshButtonLabel?: string;
  printButtonLabel?: string;
  addButtonLabel?: string;
  showRefresh?: boolean;
  showPrint?: boolean;
  showAdd?: boolean;
  onAdd?: () => void;
  onRefresh?: () => void;
  printConfig?: PrintConfig;
}