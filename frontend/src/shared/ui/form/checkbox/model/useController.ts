import { useMemo } from 'react';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';
import type { FieldValues } from 'react-hook-form';

/**
 * Hook for Checkbox controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled = false,
  required = false,
  side = 'right',
  label,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps, labelProps } = useFieldAccessibility(
    control,
    name,
    required,
    isDisabled,
    label
  );

  // Determine layout classes based on side
  const groupClasses = useMemo(() => {
    switch (side) {
      case 'top':
        return 'flex flex-col-reverse gap-2';
      case 'left':
        return 'flex flex-row-reverse justify-end gap-2';
      case 'bottom':
        return 'flex flex-col gap-2';
      default:
        return 'flex items-center space-x-2';
    }
  }, [side]);

  return {
    isDisabled,
    groupClasses,
    ariaProps,
    labelProps,
  };
};
