import { memo } from 'react';

import {
  Checkbox as ShadcnCheckbox,
  ShadCnFormControl,
  ShadCnFormDescription,
  ShadCnFormField,
  ShadCnFormItem,
  ShadCnFormLabel,
  ShadCnFormMessage,
} from '@/shared/shadcn';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Checkbox Component - Checkbox input with label positioning options
 *
 * @template TFieldValues - Type of the form values
 *
 * @param control - React Hook Form control object
 * @param name - Field name in the form (must be a valid path in TFieldValues)
 * @param label - Label text to display with the checkbox
 * @param description - Helper text to display below the checkbox
 * @param required - Whether the field is required
 * @param disabled - Whether the checkbox is disabled
 * @param className - Additional CSS classes for the form item container
 * @param side - Position of the label relative to the checkbox
 *
 * @example
 * ```tsx
 * const form = useForm<FormData>();
 *
 * <Checkbox
 *   control={form.control}
 *   name="acceptTerms"
 *   label="I accept the terms and conditions"
 *   required
 *   side="right"
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
}: Props<TFieldValues>) => {
  const { isDisabled, groupClasses } = useController({
    control,
    name,
    disabled,
    required,
    side,
  });

  return (
    <ShadCnFormField
      control={control}
      name={name}
      render={({ field }) => (
        <ShadCnFormItem className={className}>
          <div className="flex items-center justify-between">
            {headline ? <ShadCnFormLabel required={required}>{headline}</ShadCnFormLabel> : null}
          </div>
          <div className={groupClasses}>
            <ShadCnFormControl>
              <ShadcnCheckbox
                checked={field.value ?? false}
                onCheckedChange={field.onChange}
                disabled={isDisabled}
                aria-required={required}
                className="cursor-pointer"
              />
            </ShadCnFormControl>
            {label ? <ShadCnFormLabel required={required} className="font-normal">
                {label}
              </ShadCnFormLabel> : null}
          </div>
          {description ? <ShadCnFormDescription>{description}</ShadCnFormDescription> : null}
          <ShadCnFormMessage />
        </ShadCnFormItem>
      )}
    />
  );
};

export const Checkbox = memo(Component) as typeof Component;
