import { Flex, Text, IconButton, Button, Select } from '@radix-ui/themes';
import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';

interface PaginationProps {
  isMobile: boolean;
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize: number;
  pageSizes: number[];
  hasPrev: boolean;
  hasNext: boolean;
  isLoading: boolean;
  enablePageSize: boolean;
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (value: string) => void;
}

export function Pagination({
  isMobile,
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  pageSizes,
  hasPrev,
  hasNext,
  isLoading,
  enablePageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      pages.push(...Array.from({ length: totalPages }, (_, i) => i));
    } else {
      const start = Math.max(0, currentPage - 2);
      const end = Math.min(totalPages - 1, start + maxVisible - 1);
      const adjustedStart = end - start + 1 < maxVisible ? Math.max(0, end - maxVisible + 1) : start;
      const visiblePages = Array.from({ length: end - adjustedStart + 1 }, (_, i) => adjustedStart + i);
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

  return (
    <Flex justify='between' align='center' gap='4' style={{ width: '100%' }} direction={isMobile ? 'column' : 'row'}>
      <Text size='2' color='gray'>
        Page {currentPage + 1} of {totalPages}
        {totalItems && ` (Total: ${totalItems})`}
      </Text>

      <Flex gap='1' align='center' wrap='wrap' justify='center'>
        <IconButton variant='soft' size='1' onClick={() => onPageChange(0)} disabled={!hasPrev || isLoading}>
          <DoubleArrowLeftIcon />
        </IconButton>
        <IconButton variant='soft' size='1' onClick={() => onPageChange(currentPage - 1)} disabled={!hasPrev || isLoading}>
          <ChevronLeftIcon />
        </IconButton>

        {pageNumbers.map((p, idx) =>
          typeof p === 'number' ? (
            <Button
              key={`page-${p}`}
              variant={currentPage === p ? 'solid' : 'soft'}
              size='1'
              onClick={() => onPageChange(p)}
              disabled={isLoading}
              style={{ minWidth: '32px' }}
            >
              {p + 1}
            </Button>
          ) : (
            <Text key={`ellipsis-${idx}`} size='2' color='gray' mx='1'>
              ...
            </Text>
          )
        )}

        <IconButton variant='soft' size='1' onClick={() => onPageChange(currentPage + 1)} disabled={!hasNext || isLoading}>
          <ChevronRightIcon />
        </IconButton>
        <IconButton variant='soft' size='1' onClick={() => onPageChange(totalPages - 1)} disabled={!hasNext || isLoading}>
          <DoubleArrowRightIcon />
        </IconButton>
      </Flex>

      {enablePageSize && (
        <Flex gap='2' align='center'>
          <Text size='2' color='gray'>
            Show:
          </Text>
          <Select.Root value={pageSize.toString()} onValueChange={onPageSizeChange} size='1' disabled={isLoading}>
            <Select.Trigger style={{ minWidth: '70px', fontSize: '12px', padding: '2px 8px' }} />
            <Select.Content>
              <Select.Group>
                {pageSizes.map((size) => (
                  <Select.Item key={size} value={size.toString()}>
                    {size}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      )}
    </Flex>
  );
}
