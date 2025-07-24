// src/shared/hooks/useTypedUrlState.ts
import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Serializer für URL-Parameter
 * @description Konvertiert Werte zu URL-kompatiblen Strings
 */
const serialize = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
};

/**
 * Deserializer für URL-Parameter
 * @description Konvertiert URL-Strings zurück zu typisierten Werten
 */
const deserialize = <T>(value: string | null, defaultValue: T): T => {
  if (value === null || value === '') return defaultValue;

  if (typeof defaultValue === 'number') {
    const num = Number(value);
    return (isNaN(num) ? defaultValue : num) as T;
  }

  if (typeof defaultValue === 'boolean') {
    return (value === 'true') as T;
  }

  return value as T;
};

/**
 * useTypedUrlState Hook
 * @description Typsicherer URL State Management Hook
 */
export const useTypedUrlState = <T extends Record<string, string | number | boolean>>(
  defaultValues: T
): [T, (updates: Partial<T>) => void, () => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse State from URL
  const state = useMemo((): T => {
    const result = { ...defaultValues };

    for (const [key, defaultValue] of Object.entries(defaultValues)) {
      const urlValue = searchParams.get(key);
      result[key as keyof T] = deserialize(urlValue, defaultValue) as T[keyof T];
    }

    return result;
  }, [searchParams, defaultValues]);

  // Update State
  const setState = useCallback(
    (updates: Partial<T>) => {
      const newParams = new URLSearchParams(searchParams);

      for (const [key, value] of Object.entries(updates)) {
        const defaultValue = defaultValues[key as keyof T];
        const serialized = serialize(value);

        // Nur nicht-default Werte in URL
        if (value !== defaultValue && serialized !== '') {
          newParams.set(key, serialized);
        } else {
          newParams.delete(key);
        }
      }

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, defaultValues, setSearchParams]
  );

  // Reset to defaults
  const resetState = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return [state, setState, resetState];
};
