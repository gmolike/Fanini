import { memo } from 'react';

import { RotateCcw } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Button,
  FormControl as ShadCnFormControl,
  FormDescription as ShadCnFormDescription,
  FormField as ShadCnFormField,
  FormItem as ShadCnFormItem,
  FormLabel as ShadCnFormLabel,
  FormMessage as ShadCnFormMessage,
} from '@/shared/shadcn';

import { ICON_SIZES, TRANSITIONS } from '../constants';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * FormFieldWrapper Component - Wrapper with reset functionality
 *
 * Provides consistent layout and behavior for all form fields:
 * - Label with required indicator
 * - Reset button when value differs from default
 * - Description text
 * - Error messages
 * - ARIA attributes
 *
 * @template TFieldValues - Type of the form values
 *
 * @example
 * ```tsx
 * <FormFieldWrapper
 *   control={form.control}
 *   name="email"
 *   label="Email"
 *   description="We'll never share your email"
 *   required
 *   render={(field) => (
 *     <Input {...field} type="email" placeholder="Enter email" />
 *   )}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  showReset = true,
  render,
}: Props<TFieldValues>) => {
  const {
    isDifferentFromDefault,
    handleReset,
    hasError,
    labelProps,
    descriptionProps,
    errorProps,
  } = useController({
    control,
    name,
    showReset,
  });

  return (
    <ShadCnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <ShadCnFormItem className={cn('space-y-2', className)}>
          {/* Label and Reset Button */}
          <div className="flex items-center justify-between">
            {label ? (
              <ShadCnFormLabel {...labelProps} className="text-sm font-medium">
                {label}
                {required ? (
                  <span className="text-destructive ml-1" aria-label="erforderlich">
                    *
                  </span>
                ) : null}
              </ShadCnFormLabel>
            ) : null}

            {/* Reset Button Container - Fixed width to prevent layout shift */}
            <div className="h-6 w-6">
              {showReset && isDifferentFromDefault ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn('h-6 w-6 rounded-sm', TRANSITIONS.default, 'hover:bg-muted')}
                  onClick={handleReset}
                  aria-label="Auf Standardwert zurücksetzen"
                >
                  <RotateCcw className={cn(ICON_SIZES.sm, 'text-muted-foreground')} />
                </Button>
              ) : null}
            </div>
          </div>

          {/* Field Content */}
          <ShadCnFormControl>{render(field)}</ShadCnFormControl>

          {/* Description */}
          {description ? (
            <ShadCnFormDescription {...descriptionProps} className="text-muted-foreground text-xs">
              {description}
            </ShadCnFormDescription>
          ) : null}

          {/* Error Message */}
          {hasError ? (
            <div {...errorProps}>
              <ShadCnFormMessage className="text-xs font-medium" />
            </div>
          ) : null}
        </ShadCnFormItem>
      )}
    />
  );
};

export const FieldWrapper = memo(Component) as typeof Component;
