import { useFieldAccessibility, useFieldError, useFieldReset } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';
import type { FieldValues } from 'react-hook-form';

/**
 * Hook for FieldWrapper controller logic
 *
 * @template TFieldValues - Type of the form values
 *
 * @param props - Controller props
 * @returns Controller result with reset functionality and ARIA props
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  showReset = true,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const { isDifferentFromDefault, handleReset, currentValue } = useFieldReset(control, name);
  const { hasError, errorMessage } = useFieldError(control, name);
  const { labelProps, descriptionProps, errorProps } = useFieldAccessibility(control, name);

  return {
    isDifferentFromDefault: showReset ? isDifferentFromDefault : false,
    handleReset,
    currentValue,
    hasError,
    errorMessage,
    labelProps,
    descriptionProps,
    errorProps,
  };
};
