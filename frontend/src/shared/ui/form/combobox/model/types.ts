import type { BaseFieldProps } from '../../input/model/types';
import type { LoadingState, Option } from '../../types';
import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

/**
 * Props for the Combobox controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues, TValue = string> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  options: Option<TValue>[];
  onSearchChange?: (search: string) => void;
  loading?: boolean;
  debounceDelay?: number;
  label?: string;
};

/**
 * Return value of the Combobox controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues, TValue = string> = {
  isDisabled: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filteredOptions: Option<TValue>[];
  selectedOption: Option<TValue> | undefined;
  handleSelect: (
    option: Option<TValue>,
    onChange: (newValue: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
  ) => void;
  ariaProps: Record<string, unknown>;
  labelProps: {
    id: string;
    htmlFor: string;
  };
};

/**
 * Props for the Combobox component
 */
export type Props<
  TFieldValues extends FieldValues = FieldValues,
  TValue = string,
> = BaseFieldProps<TFieldValues> &
  LoadingState & {
    /**
     * Array of options to display
     */
    options: Option<TValue>[];

    /**
     * Placeholder for search input
     * @default 'Suchen...'
     */
    searchPlaceholder?: string;

    /**
     * Text when no options match
     * @default 'Keine Ergebnisse gefunden.'
     */
    emptyText?: string;

    /**
     * Whether to show clear button
     * @default true
     */
    showClear?: boolean;

    /**
     * Callback when search value changes
     */
    onSearchChange?: (search: string) => void;

    /**
     * Debounce delay for search in ms
     * @default 300
     */
    debounceDelay?: number;
  };
