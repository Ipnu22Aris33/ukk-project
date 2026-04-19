import { useState, useCallback, useEffect } from 'react';
import type { PaginationState } from '@tanstack/react-table';

export function useTablePagination(
  page: number,
  limit: number | undefined,
  pageSizes: number[],
  onPageChange?: (page: number) => void,
  onPageSizeChange?: (size: number) => void
) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: limit || pageSizes[0],
  });

  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
      onPageChange?.(newPageIndex + 1);
    },
    [onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (value: string) => {
      const newSize = Number(value);
      setPagination((prev) => ({ ...prev, pageSize: newSize, pageIndex: 0 }));
      onPageSizeChange?.(newSize);
      onPageChange?.(1);
    },
    [onPageSizeChange, onPageChange]
  );

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: page - 1,
      pageSize: limit || prev.pageSize,
    }));
  }, [page, limit]);

  return {
    pagination,
    setPagination,
    handlePageChange,
    handlePageSizeChange,
  };
}