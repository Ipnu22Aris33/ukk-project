import { useState, useRef, useCallback, useEffect } from 'react';

export function useDebouncedSearch(initialValue: string, onSearch: (value: string) => void, debounceMs: number = 100) {
  const [localSearch, setLocalSearch] = useState(initialValue);
  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearchChange = useCallback(
    (value: string) => {
      setLocalSearch(value);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearch(value);
      }, debounceMs);
    },
    [onSearch, debounceMs]
  );

  useEffect(() => {
    setLocalSearch(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return { localSearch, handleSearchChange };
}
