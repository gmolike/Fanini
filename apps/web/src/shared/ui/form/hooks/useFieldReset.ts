import { useCallback, useEffect, useRef } from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
  useFormContext,
  useWatch,
} from 'react-hook-form';

/**
 * Extract default value from nested path
 * @internal
 */
// frontend/src/shared/ui/form/hooks/useFieldReset.ts
const getNestedDefaultValue = (defaultValues: FieldValues, path: string): unknown => {
  const pathParts = path.split('.');
  let value: unknown = defaultValues;

  for (const part of pathParts) {
    if (value !== null && typeof value === 'object' && Object.hasOwn(value, part)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
};

// Vereinfachte isValueDifferent Funktion
const isValueDifferent = (current: unknown, defaultVal: unknown): boolean => {
  if (current == null && defaultVal == null) return false;
  if (current == null || defaultVal == null) return true;

  // Date comparison
  if (current instanceof Date && defaultVal instanceof Date) {
    return current.getTime() !== defaultVal.getTime();
  }

  // Try parsing as dates if strings
  if (typeof current === 'string' && typeof defaultVal === 'string') {
    const currentTime = Date.parse(current);
    const defaultTime = Date.parse(defaultVal);
    if (!isNaN(currentTime) && !isNaN(defaultTime)) {
      return currentTime !== defaultTime;
    }
  }

  // Complex object comparison
  if (typeof current === 'object' && typeof defaultVal === 'object') {
    return JSON.stringify(current) !== JSON.stringify(defaultVal);
  }

  return current !== defaultVal;
};
/**
 * Hook to manage form field reset functionality
 * Tracks default value and provides reset handler
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form
 * @returns Object with reset functionality
 *
 * @example
 * ```tsx
 * const { isDifferentFromDefault, handleReset } = useFieldReset(control, name);
 *
 * {isDifferentFromDefault && (
 *   <Button onClick={handleReset}>Reset</Button>
 * )}
 * ```
 */
export const useFieldReset = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>,
  name: FieldPath<TFieldValues>
) => {
  const form = useFormContext<TFieldValues>();
  const currentValue = useWatch({ control, name });
  const defaultValueRef = useRef<PathValue<TFieldValues, typeof name> | undefined>(undefined);

  // Extract and store default value
  useEffect(() => {
    const { defaultValues } = form.formState;
    if (defaultValues && defaultValueRef.current === undefined) {
      const value = getNestedDefaultValue(defaultValues, name as string);
      defaultValueRef.current = value as PathValue<TFieldValues, typeof name>;
    }
  }, [form.formState, name]);

  /**
   * Reset field to its default value
   */
  const handleReset = useCallback(() => {
    if (defaultValueRef.current !== undefined) {
      form.setValue(name, defaultValueRef.current as PathValue<TFieldValues, typeof name>, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [form, name]);

  /**
   * Clear field value (set to undefined)
   */
  const handleClear = useCallback(() => {
    form.setValue(name, undefined as PathValue<TFieldValues, typeof name>, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [form, name]);

  /**
   * Set field value with validation
   */
  const setValue = useCallback(
    (value: PathValue<TFieldValues, typeof name>) => {
      form.setValue(name, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form, name]
  );

  const isDifferentFromDefault = isValueDifferent(currentValue, defaultValueRef.current);

  return {
    /**
     * Current field value
     */
    currentValue,

    /**
     * Default value for this field
     */
    defaultValue: defaultValueRef.current,

    /**
     * Whether current value differs from default
     */
    isDifferentFromDefault,

    /**
     * Reset to default value
     */
    handleReset,

    /**
     * Clear field value
     */
    handleClear,

    /**
     * Set field value with validation
     */
    setValue,
  };
};
