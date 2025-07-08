import { type FieldValues, useWatch } from 'react-hook-form';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for TextArea controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled = false,
  required = false,
  rows = 3,
  maxLength,
  label,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps } = useFieldAccessibility(control, name, required, isDisabled, label);

  const value = useWatch({ control, name });
  const currentLength = String(value ?? '').length;

  return {
    isDisabled,
    rows,
    ariaProps,
    currentLength,
    maxLength: maxLength ?? 0,
  };
};
