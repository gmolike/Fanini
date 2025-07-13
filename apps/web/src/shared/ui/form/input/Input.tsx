import { memo } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Input as InputShadcn } from '@/shared/shadcn';

import { ICON_SIZES } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';
import { useFieldReset } from '../hooks';
import { formatPhoneNumber, parseNumber } from '../utils';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues, PathValue } from 'react-hook-form';

/**
 * Input Component - Form input field with comprehensive features
 *
 * @template TFieldValues - Type of the form values
 *
 * @example
 * ```tsx
 * // Simple text input
 * <FormInput
 *   control={form.control}
 *   name="email"
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   startIcon={Mail}
 * />
 *
 * // Number input with formatting
 * <FormInput
 *   control={form.control}
 *   name="salary"
 *   label="Salary"
 *   type="number"
 *   min={0}
 *   step={1000}
 *   startIcon={Euro}
 * />
 *
 * // Phone input with formatting
 * <FormInput
 *   control={form.control}
 *   name="phone"
 *   label="Phone"
 *   type="tel"
 *   startIcon={Phone}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  className,
  inputClassName,
  wrapperClassName,
  startIcon: StartIcon,
  endIcon: EndIcon,
  iconSize = 'default',
  disabled,
  type,
  min,
  max,
  step,
  pattern,
  showReset = true,
  showClear = false,
  testId,
  ...inputProps
}: Props<TFieldValues>) => {
  const { isDisabled, ariaProps, inputType, hasError } = useController({
    control,
    name,
    disabled: !!disabled,
    required: !!required,
    ...(type !== undefined ? { type } : {}),
    ...(label !== undefined ? { label } : {}),
  });

  const { handleClear } = useFieldReset(control, name);

  const iconSizeClass = ICON_SIZES[iconSize];

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
        // Format display value based on type
        let displayValue = field.value ?? '';

        if (inputType === 'tel' && displayValue) {
          displayValue = formatPhoneNumber(displayValue);
        }

        return (
          <div className={cn('relative', wrapperClassName)}>
            {StartIcon ? (
              <div className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
                <StartIcon className={iconSizeClass} />
              </div>
            ) : null}

            <InputShadcn
              {...inputProps}
              {...ariaProps}
              onChange={e => {
                const { value }: { value: string } = e.target;

                // Handle number input
                if (inputType === 'number' && value !== '') {
                  const parsed = parseNumber(value);
                  if (parsed !== null) {
                    field.onChange(String(parsed) as PathValue<TFieldValues, typeof name>);
                    return;
                  }
                }

                field.onChange(e.target.value as PathValue<TFieldValues, typeof name>);
              }}
              onBlur={field.onBlur}
              name={field.name}
              value={displayValue}
              ref={field.ref}
              type={inputType}
              placeholder={placeholder}
              disabled={isDisabled}
              min={min}
              max={max}
              step={step}
              pattern={pattern}
              data-testid={testId}
              className={cn(
                StartIcon && 'pl-10',
                EndIcon && 'pr-10',
                !EndIcon && showClear && 'pr-10',
                hasError && 'border-destructive focus-visible:ring-destructive',
                inputClassName
              )}
            />

            {(() => {
              let content = null;
              if (showClear && Boolean(field.value)) {
                content = (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      handleClear();
                    }}
                    className="absolute top-1/2 right-1 size-8 -translate-y-1/2"
                    aria-label="Clear"
                  >
                    <X className="size-3" />
                  </Button>
                );
              } else if (EndIcon) {
                content = (
                  <div className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                    <EndIcon className={iconSizeClass} />
                  </div>
                );
              }
              return content;
            })()}
          </div>
        );
      }}
    />
  );
};

export const Input = memo(Component) as typeof Component;
