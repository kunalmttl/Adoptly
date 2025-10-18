// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// This hook takes a value and a delay, and only returns the latest value
// after the user has stopped typing for the specified delay.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timeout on every render if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}