import type { Locale } from 'date-fns';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * Props for the DateRange component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  startName: FieldPath<TFieldValues>;
  endName: FieldPath<TFieldValues>;
  label?: string;
  startLabel?: string;
  endLabel?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  dateFormat?: string;
  locale?: Locale;
  minDate?: Date;
  maxDate?: Date;
  showClear?: boolean;
  showReset?: boolean;
};
