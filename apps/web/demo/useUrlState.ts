// src/shared/hooks/useUrlState.ts
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * useUrlState Hook
 * @description Managed State in der URL mit Type Safety
 */
export const useUrlState = <T extends Record<string, string | number | boolean>>(
  defaultValues: T,
  options?: {
    debounce?: number;
    replace?: boolean;
  }
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse current state from URL
  const state = useMemo(() => {
    const result = { ...defaultValues };

    searchParams.forEach((value, key) => {
      if (key in defaultValues) {
        const defaultValue = defaultValues[key];

        if (typeof defaultValue === 'number') {
          result[key as keyof T] = Number(value) as T[keyof T];
        } else if (typeof defaultValue === 'boolean') {
          result[key as keyof T] = (value === 'true') as T[keyof T];
        } else {
          result[key as keyof T] = value as T[keyof T];
        }
      }
    });

    return result;
  }, [searchParams, defaultValues]);

  // Update state
  const setState = useCallback(
    (updates: Partial<T>) => {
      const newState = { ...state, ...updates };
      const params = new URLSearchParams();

      Object.entries(newState).forEach(([key, value]) => {
        const defaultValue = defaultValues[key as keyof T];

        // Nur nicht-default Werte in URL
        if (value !== defaultValue && value !== '' && value !== null) {
          params.set(key, String(value));
        }
      });

      setSearchParams(params, { replace: options?.replace ?? true });
    },
    [state, defaultValues, setSearchParams, options?.replace]
  );

  return [state, setState] as const;
};
