import { type ReactNode, useCallback, useState } from 'react';

import { useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';
import type { FieldValues } from 'react-hook-form';

/**
 * Hook for DialogButton controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  disabled,
  placeholder = 'Auswählen...',
  children,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const [dialogOpen, setDialogOpen] = useState(false);

  const hasValue = useCallback(
    (value: unknown): boolean => value !== null && value !== undefined && value !== '',
    []
  );

  const getDisplayContent = useCallback(
    (value: unknown): ReactNode => {
      if (typeof children === 'function') {
        const result = children(value);
        // If the function returns empty/null/undefined and no value, show placeholder
        if ((result === null || result === undefined || result === '') && !hasValue(value)) {
          return placeholder;
        }
        return result ?? placeholder;
      }

      return hasValue(value) ? children : placeholder;
    },
    [children, placeholder, hasValue]
  );

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      setDialogOpen(true);
    }
  }, [isDisabled]);

  return {
    isDisabled,
    dialogOpen,
    setDialogOpen,
    handleClick,
    getDisplayContent,
    hasValue,
  };
};
