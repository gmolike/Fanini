import { useCallback, useEffect, useState } from 'react';
import { type FieldPath, type FieldValues, type PathValue, useWatch } from 'react-hook-form';

import { format, isValid, parse, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for DatePicker controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  required,
  dateFormat = 'dd.MM.yyyy',
  min,
  max,
  locale = de,
  label,
}: ControllerProps<TFieldValues>): ControllerResult<TFieldValues> => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps } = useFieldAccessibility(control, name, required, isDisabled, label);

  const value = useWatch({ control, name });
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Reset input value when field value is cleared
  useEffect(() => {
    if (value === null || value === undefined || value === '') {
      setInputValue('');
    }
  }, [value]);

  const formatDate = useCallback(
    (date: Date | string | null | undefined): string => {
      if (date === null || date === undefined) return '';

      try {
        const dateObj = typeof date === 'string' ? parseISO(date) : date;
        return isValid(dateObj) ? format(dateObj, dateFormat, { locale }) : '';
      } catch {
        return '';
      }
    },
    [dateFormat, locale]
  );

  const formattedValue = formatDate(value);

  const isDateDisabled = useCallback(
    (date: Date) => Boolean((min && date < min) ?? (max && date > max)),
    [min, max]
  );

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setInputValue('');
    }
  }, []);

  const handleInputChange = useCallback(
    (input: string, onChange: (date: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void) => {
      setInputValue(input);

      if (!input) {
        onChange(undefined as PathValue<TFieldValues, FieldPath<TFieldValues>>);
        return;
      }

      const parsedDate = parse(input, dateFormat, new Date(), { locale });
      if (isValid(parsedDate) && !isDateDisabled(parsedDate)) {
        onChange(parsedDate.toISOString() as PathValue<TFieldValues, FieldPath<TFieldValues>>);
      }
    },
    [dateFormat, locale, isDateDisabled]
  );

  const handleCalendarSelect = useCallback(
    (
      date: Date | undefined,
      onChange: (selectedDate: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
    ) => {
      onChange(
        (date?.toISOString() ?? undefined) as PathValue<TFieldValues, FieldPath<TFieldValues>>
      );
      setOpen(false);
      setInputValue('');
    },
    []
  );

  return {
    isDisabled,
    formattedValue,
    isDateDisabled,
    inputValue,
    setInputValue,
    open,
    setOpen: handleOpenChange,
    handleInputChange,
    handleCalendarSelect,
    ariaProps,
  };
};
