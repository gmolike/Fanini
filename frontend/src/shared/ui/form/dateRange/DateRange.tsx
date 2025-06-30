import { memo } from 'react';
import { type  FieldValues,useWatch  } from 'react-hook-form';

import { cn } from '@/shared/lib';
import { FormDescription, FormLabel } from '@/shared/shadcn';

import { DatePicker } from '../datePicker';

import type { Props } from './model/types';

/**
 * DateRange Component - Two date pickers for selecting a date range
 *
 * @example
 * ```tsx
 * <FormDateRange
 *   control={form.control}
 *   startName="startDate"
 *   endName="endDate"
 *   label="Project Duration"
 *   startLabel="Start Date"
 *   endLabel="End Date"
 *   required
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  startName,
  endName,
  label,
  startLabel = 'Von',
  endLabel = 'Bis',
  description,
  required,
  disabled,
  className,
  dateFormat,
  locale,
  minDate,
  maxDate,
  showClear = true,
  showReset = true,
}: Props<TFieldValues>) => {
  // Watch start date to use as min for end date
  const startDate = useWatch({ control, name: startName });
  const startDateObj = startDate ? new Date(startDate) : undefined;

  // Watch end date to use as max for start date
  const endDate = useWatch({ control, name: endName });
  const endDateObj = endDate ? new Date(endDate) : undefined;

  return (
    <div className={cn('space-y-3', className)}>
      {label ? (
        <FormLabel>
          {label}
          {required ? <span className="text-destructive ml-1">*</span> : null}
        </FormLabel>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          control={control}
          name={startName}
          label={startLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
          min={minDate}
          max={endDateObj ?? maxDate}
          showClear={showClear}
          showReset={showReset}
          required={required}
        />

        <DatePicker
          control={control}
          name={endName}
          label={endLabel}
          disabled={disabled}
          dateFormat={dateFormat}
          locale={locale}
          min={startDateObj ?? minDate}
          max={maxDate}
          showClear={showClear}
          showReset={showReset}
          required={required}
        />
      </div>

      {description ? <FormDescription>{description}</FormDescription> : null}
    </div>
  );
};

export const DateRange = memo(Component) as typeof Component;
