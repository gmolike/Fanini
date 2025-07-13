import { useCallback, useMemo } from 'react';
import { type FieldValues, type PathValue, useFormContext, useWatch } from 'react-hook-form';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { Option } from '../../types';
import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for MultiSelect controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues, TValue = string>({
  control,
  name,
  disabled = false,
  required = false,
  options,
  max,
  label,
}: ControllerProps<TFieldValues, TValue>): ControllerResult<TValue> => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps } = useFieldAccessibility(control, name, required, isDisabled, label);

  const form = useFormContext<TFieldValues>();
  const fieldValue = useWatch({ control, name }) as TValue[] | undefined;
  const values = fieldValue ?? [];

  // Calculate selected and available options
  const selectedOptions = useMemo(
    () => options.filter(option => values.includes(option.value)),
    [options, values]
  );

  const availableOptions = useMemo(
    () => options.filter(option => !values.includes(option.value)),
    [options, values]
  );

  const canAddMore = !max || values.length < max;

  const updateValue = useCallback(
    (newValues: TValue[]) => {
      form.setValue(name, newValues as PathValue<TFieldValues, typeof name>, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form, name]
  );

  const toggleOption = useCallback(
    (option: Option<TValue>) => {
      if (values.includes(option.value)) {
        updateValue(values.filter(v => v !== option.value));
      } else if (canAddMore) {
        updateValue([...values, option.value]);
      }
    },
    [values, canAddMore, updateValue]
  );

  const removeOption = useCallback(
    (option: Option<TValue>) => {
      updateValue(values.filter(v => v !== option.value));
    },
    [values, updateValue]
  );

  const clearAll = useCallback(() => {
    updateValue([]);
  }, [updateValue]);

  return {
    isDisabled,
    selectedOptions,
    availableOptions,
    canAddMore,
    toggleOption,
    removeOption,
    clearAll,
    ariaProps,
  };
};
