// DataTableProvider.tsx
'use client';

import * as React from 'react';

interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  search?: string | null;
}

interface DataTableContextValue<T> {
  table: any;
  search: string;
  setSearch: (value: string) => void;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  setPagination: React.Dispatch<React.SetStateAction<{
    pageIndex: number;
    pageSize: number;
  }>>;
  meta?: MetaData;
  isLoading?: boolean;
  refetch?: () => void;
}

const DataTableContext = React.createContext<DataTableContextValue<any> | null>(null);

export function DataTableProvider<T>({
  value,
  children,
}: {
  value: DataTableContextValue<T>;
  children: React.ReactNode;
}) {
  return (
    <DataTableContext.Provider value={value}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContext<T>() {
  const ctx = React.useContext(DataTableContext);
  if (!ctx) throw new Error('useDataTableContext must be inside provider');
  return ctx as DataTableContextValue<T>;
}