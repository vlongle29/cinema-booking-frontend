import { useState, useEffect } from "react";

/**
 * Hook to debounce a value (e.g. search input query)
 * @param value The value to be debounced
 * @param delay The delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
   const [debouncedValue, setDebouncedValue] = useState<T>(value);

   useEffect(() => {
      const handler = setTimeout(() => {
         setDebouncedValue(value);
      }, delay);

      // Cleanup timeout if value or delay changes
      return () => {
         clearTimeout(handler);
      };
   }, [value, delay]);

   return debouncedValue;
}
