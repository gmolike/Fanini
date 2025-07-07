import { memo } from 'react';

import { CalendarIcon, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Calendar, Input, Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn';

import { ICON_SIZES, TRANSITIONS } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';
import { useFieldReset } from '../hooks';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * DatePicker Component - Date selection with calendar and input
 *
 * @example
 * ```tsx
 * // Simple date picker
 * <FormDatePicker
 *   control={form.control}
 *   name="birthDate"
 *   label="Birth Date"
 *   max={new Date()}
 * />
 *
 * // With custom format
 * <FormDatePicker
 *   control={form.control}
 *   name="eventDate"
 *   label="Event Date"
 *   dateFormat="yyyy-MM-dd"
 *   min={new Date()}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Datum auswählen',
  disabled,
  className,
  dateFormat = 'dd.MM.yyyy',
  showTime = false,
  min,
  max,
  locale,
  showReset = true,
  showClear = true,
  allowInput = true,
  testId,
}: Props<TFieldValues>) => {
  const {
    isDisabled,
    formattedValue,
    isDateDisabled,
    inputValue,
    setInputValue,
    open,
    setOpen,
    handleInputChange,
    handleCalendarSelect,
    ariaProps,
  } = useController({
    control,
    name,
    disabled: disabled ?? false,
    required: required ?? false,
    dateFormat,
    ...(min ? { min } : {}),
    ...(max ? { max } : {}),
    ...(locale ? { locale } : {}),
    label: label ?? '',
  });

  const { handleClear } = useFieldReset(control, name);

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={field => {
        const dateValue =
          field.value !== null && field.value !== undefined
            ? new Date(field.value as string | Date)
            : undefined;
        const hasValue = Boolean(field.value);

        return (
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  {...ariaProps}
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start text-left font-normal',
                    !hasValue && 'text-muted-foreground',
                    TRANSITIONS.default
                  )}
                  disabled={isDisabled}
                  type="button"
                  data-testid={testId}
                >
                  {formattedValue || placeholder}
                  <CalendarIcon className={cn('ml-auto', ICON_SIZES.default, 'opacity-50')} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-3">
                  {allowInput ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Datum eingeben ({dateFormat})</label>
                      <Input
                        type="text"
                        placeholder={dateFormat}
                        value={inputValue || formattedValue}
                        onChange={e => {
                          handleInputChange(e.target.value, field.onChange);
                        }}
                        onBlur={() => {
                          if (inputValue && !hasValue) {
                            setInputValue('');
                          }
                        }}
                        autoFocus
                      />
                    </div>
                  ) : null}

                  <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={date => {
                      handleCalendarSelect(date, field.onChange);
                    }}
                    disabled={isDateDisabled}
                    autoFocus={!allowInput}
                  />

                  {showTime ? (
                    <div className="border-t pt-3">
                      <p className="text-muted-foreground text-sm">
                        Zeit-Auswahl wird in zukünftiger Version hinzugefügt
                      </p>
                    </div>
                  ) : null}
                </div>
              </PopoverContent>
            </Popover>

            {showClear && hasValue ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  handleClear();
                }}
                aria-label="Datum löschen"
                className="shrink-0"
              >
                <X className={ICON_SIZES.default} />
              </Button>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export const DatePicker = memo(Component) as typeof Component;
