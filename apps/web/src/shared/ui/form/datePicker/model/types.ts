import type { BaseFieldProps } from '../../input/model/types';
import type { Locale } from 'date-fns';
import type { Control, FieldPath, FieldValues, PathValue } from 'react-hook-form';

/**
 * Props for the DatePicker controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  min?: Date;
  max?: Date;
  locale?: Locale;
  label?: string;
};

/**
 * Return value of the DatePicker controller hook
 */
export type ControllerResult<TFieldValues extends FieldValues = FieldValues> = {
  isDisabled: boolean;
  formattedValue: string;
  isDateDisabled: (date: Date) => boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  handleInputChange: (
    value: string,
    onChange: (date: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
  ) => void;
  handleCalendarSelect: (
    date: Date | undefined,
    onChange: (date: PathValue<TFieldValues, FieldPath<TFieldValues>>) => void
  ) => void;
  ariaProps: Record<string, unknown>;
};

/**
 * Props for the DatePicker component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Date format string
   * @default 'dd.MM.yyyy'
   */
  dateFormat?: string;

  /**
   * Whether to show time selection
   * @default false
   */
  showTime?: boolean;

  /**
   * Minimum allowed date
   */
  min?: Date;

  /**
   * Maximum allowed date
   */
  max?: Date;

  /**
   * Locale for date formatting
   * @default de
   */
  locale?: Locale;

  /**
   * Whether to show clear button
   * @default true
   */
  showClear?: boolean;

  /**
   * Whether to allow manual input
   * @default true
   */
  allowInput?: boolean;
};
