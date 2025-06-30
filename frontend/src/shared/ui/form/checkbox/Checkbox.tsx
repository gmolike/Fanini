import { memo } from 'react';

import { X } from 'lucide-react';

import {
  Button,
  Checkbox as ShadcnCheckbox,
  FormControl as ShadCnFormControl,
  FormDescription as ShadCnFormDescription,
  FormField as ShadCnFormField,
  FormItem as ShadCnFormItem,
  FormLabel as ShadCnFormLabel,
  FormMessage as ShadCnFormMessage,
} from '@/shared/shadcn';

import { useFieldReset } from '../hooks';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Checkbox Component - Checkbox input with flexible label positioning
 *
 * @template TFieldValues - Type of the form values
 *
 * @example
 * ```tsx
 * // Simple checkbox
 * <FormCheckbox
 *   control={form.control}
 *   name="acceptTerms"
 *   label="I accept the terms and conditions"
 *   required
 * />
 *
 * // With headline and description
 * <FormCheckbox
 *   control={form.control}
 *   name="newsletter"
 *   headline="Newsletter Preferences"
 *   label="Send me weekly updates"
 *   description="You can unsubscribe at any time"
 *   side="right"
 * />
 *
 * // With reset functionality
 * <FormCheckbox
 *   control={form.control}
 *   name="rememberMe"
 *   label="Remember me"
 *   showReset
 *   showClear
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  headline,
  description,
  required,
  disabled,
  className,
  side = 'right',
  showReset = true,
  showClear = false,
  testId,
}: Props<TFieldValues>) => {
  const { isDisabled, groupClasses, ariaProps, labelProps } = useController({
    control,
    name,
    disabled,
    required,
    side,
    label,
  });

  const { isDifferentFromDefault, handleReset, handleClear } = useFieldReset(control, name);

  return (
    <ShadCnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <ShadCnFormItem className={className}>
          <div className="flex items-center justify-between">
            {headline ? <ShadCnFormLabel required={required}>{headline}</ShadCnFormLabel> : null}
            <div className="flex items-center gap-1">
              {showClear && field.value ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => { handleClear(); }}
                  className="size-6"
                  aria-label="Clear selection"
                >
                  <X className="size-3" />
                </Button>
              ) : null}
              {showReset && isDifferentFromDefault ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  className="size-6"
                  aria-label="Reset to default"
                >
                  <RotateCcw className="size-3" />
                </Button>
              ) : null}
            </div>
          </div>

          <div className={groupClasses}>
            <ShadCnFormControl>
              <ShadcnCheckbox
                {...ariaProps}
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={isDisabled}
                data-testid={testId}
                className="cursor-pointer"
              />
            </ShadCnFormControl>

            {label ? (
              <ShadCnFormLabel
                {...labelProps}
                required={required}
                className="cursor-pointer font-normal"
              >
                {label}
              </ShadCnFormLabel>
            ) : null}
          </div>

          {description ? <ShadCnFormDescription>{description}</ShadCnFormDescription> : null}
          <ShadCnFormMessage />
        </ShadCnFormItem>
      )}
    />
  );
};

export const Checkbox = memo(Component) as typeof Component;
