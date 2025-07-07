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
  disabled,
  required,
  side = 'right',
  label,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled ?? false);
  const { ariaProps, labelProps } = useFieldAccessibility(
    control,
    name,
    required ?? false,
    isDisabled,
    label ?? ''
  );
  // Rest des Codes bleibt gleich

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
