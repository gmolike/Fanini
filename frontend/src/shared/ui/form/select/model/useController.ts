import { useCallback, useState } from 'react';
import { type  FieldPath,type  FieldValues,type  PathValue,useWatch  } from 'react-hook-form';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Select controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues, TValue = string>({
  control,
  name,
  disabled,
  required,
  options,
  placeholder,
  label,
}: ControllerProps<TFieldValues, TValue>): ControllerResult<TFieldValues> => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps } = useFieldAccessibility(control, name, required, isDisabled, label);

  const fieldValue = useWatch({ control, name });
  const [open, setOpen] = useState(false);

  const normalizedValue = String(fieldValue ?? '');

  // Find display value
  const selectedOption = options.find(opt => String(opt.value) === normalizedValue);
  const displayValue = selectedOption?.label ?? placeholder;

  const onValueChange = useCallback(
    (
      value: string,
      onChange: (newValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
    ) => {
      const option = options.find(opt => String(opt.value) === value);
      if (option) {
        onChange(option.value as PathValue<TFieldValues, FieldPath<TFieldValues>>);
      }
      setOpen(false);
    },
    [options]
  );

  return {
    isDisabled,
    normalizedValue,
    displayValue,
    open,
    setOpen,
    onValueChange,
    ariaProps,
  };
};
