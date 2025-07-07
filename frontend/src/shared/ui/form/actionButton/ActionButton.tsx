// frontend/src/form/actionButton/ActionButton.tsx
import { memo } from 'react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

import { ICON_SIZES, TRANSITIONS } from '../constants';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * ActionButton Component - Form-aware button with field value access
 *
 * Provides a button that can access and modify form values.
 * Useful for custom actions like calculations, field clearing, or conditional logic.
 *
 * @template TFieldValues - Type of the form values
 *
 * @example
 * ```tsx
 * // Simple action button
 * <FormActionButton
 *   control={form.control}
 *   onClick={() => console.log('Clicked')}
 *   variant="outline"
 * >
 *   Calculate Total
 * </FormActionButton>
 *
 * // Button with form value access
 * <FormActionButton
 *   control={form.control}
 *   onClick={(formValues) => {
 *     const total = formValues.price * formValues.quantity;
 *     form.setValue('total', total);
 *   }}
 *   startIcon={Calculator}
 * >
 *   Calculate
 * </FormActionButton>
 *
 * // Conditional button based on form state
 * <FormActionButton
 *   control={form.control}
 *   watchFields={['acceptTerms']}
 *   onClick={() => handleSpecialAction()}
 *   disabled={(values) => !values.acceptTerms}
 * >
 *   Special Action
 * </FormActionButton>
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  onClick,
  children,
  variant = 'outline',
  size = 'default',
  disabled,
  className,
  startIcon: StartIcon,
  endIcon: EndIcon,
  iconSize = 'default',
  watchFields,
  loading,
  loadingText = 'Processing...',
  fullWidth = false,
  testId,
  type = 'button',
}: Props<TFieldValues>) => {
  const { isDisabled, isLoading, handleClick, ariaProps, formValues, hasWatchedFieldsChanged } =
    useController({
      control,
      onClick,
      disabled,
      loading,
      watchFields,
    });

  const iconSizeClass = ICON_SIZES[iconSize];

  return (
    <Button
      {...ariaProps}
      type={type}
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        fullWidth && 'w-full',
        TRANSITIONS.default,
        hasWatchedFieldsChanged && 'ring-primary ring-2 ring-offset-2',
        className
      )}
      data-testid={testId}
    >
      {isLoading ? (
        <>
          <span className={cn(iconSizeClass, 'animate-spin')}>⟳</span>
          {loadingText}
        </>
      ) : (
        <>
          {typeof StartIcon === 'function' ? <StartIcon className={iconSizeClass} /> : null}
          {typeof children === 'function' ? children(formValues) : children}
          {typeof EndIcon === 'function' ? <EndIcon className={iconSizeClass} /> : null}
        </>
      )}
    </Button>
  );
};

export const ActionButton = memo(Component) as typeof Component;
