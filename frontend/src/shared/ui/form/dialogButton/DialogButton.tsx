import { memo } from 'react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

import { ICON_SIZES } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * DialogButton Component - Button that opens a dialog
 *
 * @example
 * ```tsx
 * <FormDialogButton
 *   control={form.control}
 *   name="selectedUser"
 *   label="Select User"
 *   startIcon={User}
 *   endIcon={ChevronDown}
 *   dialog={({ open, onOpenChange, value, onChange }) => (
 *     <UserPickerDialog
 *       open={open}
 *       onOpenChange={onOpenChange}
 *       value={value}
 *       onSelect={onChange}
 *     />
 *   )}
 * >
 *   {(value) => value?.name || 'No user selected'}
 * </FormDialogButton>
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder,
  disabled,
  className,
  children,
  additionalContent,
  variant = 'outline',
  size = 'default',
  startIcon: StartIcon,
  endIcon: EndIcon,
  iconSize = 'default',
  dialog,
  buttonClassName,
  fullWidth = true,
  showReset = true,
  testId,
}: Props<TFieldValues>) => {
  const { isDisabled, dialogOpen, setDialogOpen, handleClick, getDisplayContent, hasValue } =
    useController({
      control,
      disabled,
      placeholder,
      children,
    });

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
        const displayContent = getDisplayContent(field.value);
        const isEmpty = !hasValue(field.value);

        const additionalContentNode =
          typeof additionalContent === 'function'
            ? additionalContent(field.value)
            : additionalContent;

        return (
          <>
            <div className="space-y-1">
              <Button
                type="button"
                variant={variant}
                size={size}
                onClick={handleClick}
                disabled={isDisabled}
                data-testid={testId}
                className={cn(
                  fullWidth && 'w-full',
                  'justify-start',
                  isEmpty && 'text-muted-foreground',
                  buttonClassName
                )}
              >
                {StartIcon ? <StartIcon className={iconSizeClass} /> : null}

                <span className={cn('flex-1', isEmpty ? 'font-normal' : 'font-medium')}>
                  {displayContent}
                </span>

                {EndIcon ? <EndIcon className={cn('ml-2', iconSizeClass, 'opacity-50')} /> : null}
              </Button>

              {additionalContentNode ? <div className="px-1">{additionalContentNode}</div> : null}
            </div>

            {dialog({
              open: dialogOpen,
              onOpenChange: setDialogOpen,
              value: field.value,
              onChange: field.onChange,
              name: name as string,
            })}
          </>
        );
      }}
    />
  );
};

export const DialogButton = memo(Component) as typeof Component;
