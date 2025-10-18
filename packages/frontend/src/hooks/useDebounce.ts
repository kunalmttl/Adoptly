// src/hooks/useDebounce.ts

import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 * It takes a value and a delay, and only returns the latest value after
 * the specified delay has passed without the value changing.
 *
 * This is commonly used for search inputs to prevent firing an API call on every keystroke.
 *
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce (e.g., the current text in a search input).
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to store the debounced value.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer that will update the debounced value after the specified delay.
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // The cleanup function. This is the key to debouncing.
    // It runs every time the `value` or `delay` changes, clearing the previous
    // timer before a new one is set. This ensures the state is only updated
    // once the user stops providing new values for the duration of the `delay`.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect if the value or delay changes.

  return debouncedValue;
}