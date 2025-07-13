import { useCallback, useEffect, useMemo, useState } from 'react';
import { type FieldPath, type FieldValues, type PathValue, useWatch } from 'react-hook-form';

import { DEFAULT_DEBOUNCE_DELAY } from '../../constants';
import { useDebounce, useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { Option } from '../../types';
import type { ControllerProps, ControllerResult } from './types';

/**
 * Hook for Combobox controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues, TValue = string>(
  props: ControllerProps<TFieldValues, TValue>
): ControllerResult<TFieldValues, TValue> => {
  const {
    control,
    name,
    disabled = false,
    required = false,
    options,
    onSearchChange,
    loading = false,
    debounceDelay = DEFAULT_DEBOUNCE_DELAY,
    label = '',
  } = props;

  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps, labelProps } = useFieldAccessibility(
    control,
    name,
    required,
    isDisabled,
    label
  );

  const fieldValue = useWatch({ control, name });
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Find selected option
  const selectedOption = useMemo(
    () => options.find(option => option.value === fieldValue),
    [options, fieldValue]
  );

  // Filter options based on search
  const filteredOptions = useMemo(() => {
    if (!searchValue) return options;

    const search = searchValue.toLowerCase();
    return options.filter(
      option =>
        option.label.toLowerCase().includes(search) ||
        option.description?.toLowerCase().includes(search)
    );
  }, [options, searchValue]);

  // Debounced search callback
  const debouncedSearchChange = useDebounce((...args: unknown[]) => {
    const value = args[0] as string;
    onSearchChange?.(value);
  }, debounceDelay);

  // Handle search value change
  useEffect(() => {
    if (searchValue) {
      debouncedSearchChange(searchValue);
    }
  }, [searchValue, debouncedSearchChange]);

  // Reset search when closing
  useEffect(() => {
    if (!open) {
      setSearchValue('');
    }
  }, [open]);

  const handleSelect = useCallback(
    (
      option: Option<TValue>,
      onChange: (selectedValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
    ) => {
      onChange(option.value as PathValue<TFieldValues, FieldPath<TFieldValues>>);
      setOpen(false);
      setSearchValue('');
    },
    []
  );

  return {
    isDisabled: isDisabled || loading,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    filteredOptions,
    selectedOption,
    handleSelect,
    ariaProps,
    labelProps,
  };
};
