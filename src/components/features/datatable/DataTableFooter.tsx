'use client';

import { Flex, Text, IconButton, Button, Select } from '@radix-ui/themes';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon 
} from '@radix-ui/react-icons';
import { useDataTableContext } from './DataTableProvider';

export function DataTableFooter() {
  const { table, meta, setPagination } = useDataTableContext<any>();
  
  const currentPage = meta?.page ? meta.page - 1 : table.getState().pagination.pageIndex;
  const totalPages = meta?.totalPages || table.getPageCount();
  const pageSize = meta?.limit || table.getState().pagination.pageSize;
  
  const canPreviousPage = meta ? meta.hasPrev : table.getCanPreviousPage();
  const canNextPage = meta ? meta.hasNext : table.getCanNextPage();

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      const pageIndices = Array.from({ length: totalPages }, (_, i) => i);
      pages.push(...pageIndices);
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, start + maxVisible - 1);
      
      const adjustedStart = end - start + 1 < maxVisible 
        ? Math.max(0, end - maxVisible + 1) 
        : start;
      
      const visiblePages = Array.from(
        { length: end - adjustedStart + 1 }, 
        (_, i) => adjustedStart + i
      );
      pages.push(...visiblePages);
      
      if (adjustedStart > 0) {
        pages.unshift('...');
        pages.unshift(0);
      }
      if (end < totalPages - 1) {
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (pageIndex: number) => {
    // Update pagination state di parent component (BookTable)
    setPagination(prev => ({ ...prev, pageIndex }));
    // Juga update table instance
    table.setPageIndex(pageIndex);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = Number(value);
    // Update pagination state di parent component
    setPagination(prev => ({ 
      ...prev, 
      pageSize: newSize,
      pageIndex: 0 
    }));
    // Juga update table instance
    table.setPageSize(newSize);
    table.setPageIndex(0);
  };

  return (
    <Flex justify="between" align="center" mt="6" gap="4">
      {/* Left: Page info */}
      <Text size="2">
        Page {currentPage + 1} of {totalPages}
        {meta?.total !== undefined && ` (Total: ${meta.total})`}
      </Text>

      {/* Center: Pagination controls */}
      <Flex gap="1" align="center">
        {/* First page button */}
        <IconButton
          variant="soft"
          size="1"
          onClick={() => handlePageChange(0)}
          disabled={!canPreviousPage}
        >
          <DoubleArrowLeftIcon />
        </IconButton>

        {/* Previous page button */}
        <IconButton
          variant="soft"
          size="1"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!canPreviousPage}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) => (
          typeof page === 'number' ? (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "solid" : "soft"}
              size="1"
              onClick={() => handlePageChange(page)}
              style={{ minWidth: '32px' }}
            >
              {page + 1}
            </Button>
          ) : (
            <Text key={`ellipsis-${idx}`} size="2" color="gray" mx="1">
              ...
            </Text>
          )
        ))}

        {/* Next page button */}
        <IconButton
          variant="soft"
          size="1"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!canNextPage}
        >
          <ChevronRightIcon />
        </IconButton>

        {/* Last page button */}
        <IconButton
          variant="soft"
          size="1"
          onClick={() => handlePageChange(totalPages - 1)}
          disabled={!canNextPage}
        >
          <DoubleArrowRightIcon />
        </IconButton>
      </Flex>

      {/* Right: Items per page */}
      <Flex gap="2" align="center" display={{ initial: 'none', sm: 'flex' }}>
        <Text size="2" color="gray">
          Show:
        </Text>
        <Select.Root
          value={pageSize.toString()}
          onValueChange={handlePageSizeChange}
          size="1"
        >
          <Select.Trigger 
            style={{ 
              minWidth: '70px',
              fontSize: '12px',
              padding: '2px 8px'
            }} 
          />
          <Select.Content>
            <Select.Group>
              {[10, 20, 30, 40, 50].map(size => (
                <Select.Item 
                  key={size} 
                  value={size.toString()}
                >
                  {size}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </Flex>
    </Flex>
  );
}