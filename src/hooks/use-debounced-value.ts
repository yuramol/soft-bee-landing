'use client';

import { useEffect, useState } from 'react';

/**
 * Returns `value` after it has stayed unchanged for `delayMs`.
 * Useful for search inputs so rapid keystrokes do not trigger expensive work.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
