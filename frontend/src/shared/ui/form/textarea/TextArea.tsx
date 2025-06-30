import { memo, useEffect,useRef } from 'react';

import { cn } from '@/shared/lib';
import { Textarea as ShadcnTextarea } from '@/shared/shadcn';

import { FormFieldWrapper } from '../fieldWrapper';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * TextArea Component - Multi-line text input
 *
 * @example
 * ```tsx
 * // Simple textarea
 * <FormTextArea
 *   control={form.control}
 *   name="description"
 *   label="Description"
 *   rows={5}
 * />
 *
 * // With character count
 * <FormTextArea
 *   control={form.control}
 *   name="bio"
 *   label="Bio"
 *   maxLength={500}
 *   showCount
 * />
 *
 * // Auto-resizing
 * <FormTextArea
 *   control={form.control}
 *   name="notes"
 *   label="Notes"
 *   autoResize
 *   minRows={3}
 *   maxRows={10}
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
  disabled,
  className,
  rows = 3,
  maxLength,
  showCount = false,
  autoResize = false,
  minRows = 3,
  maxRows = 10,
  showReset = true,
  testId,
}: Props<TFieldValues>) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    isDisabled,
    rows: controllerRows,
    ariaProps,
    currentLength,
  } = useController({
    control,
    name,
    disabled,
    required,
    rows,
    maxLength,
    label,
  });

  // Auto-resize effect
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';

      const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
      const minHeight = minRows * lineHeight;
      const maxHeight = maxRows * lineHeight;

      const {scrollHeight} = textarea;
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

      textarea.style.height = `${newHeight}px`;
    }
  }, [autoResize, minRows, maxRows]);

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={field => (
        <div className="space-y-1">
          <ShadcnTextarea
            {...field}
            {...ariaProps}
            ref={el => {
              field.ref(el);
              if (el && textareaRef.current !== el) {
                textareaRef.current = el;
              }
            }}
            value={field.value ?? ''}
            placeholder={placeholder}
            disabled={isDisabled}
            rows={autoResize ? minRows : controllerRows}
            maxLength={maxLength}
            data-testid={testId}
            className={cn(showReset && 'pr-10', autoResize && 'resize-none overflow-hidden')}
            onChange={e => {
              field.onChange(e);

              // Trigger resize on change
              if (autoResize && textareaRef.current) {
                const textarea = textareaRef.current;
                textarea.style.height = 'auto';

                const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
                const minHeight = minRows * lineHeight;
                const maxHeight = maxRows * lineHeight;

                const {scrollHeight} = textarea;
                const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

                textarea.style.height = `${newHeight}px`;
              }
            }}
          />

          {showCount && maxLength ? (
            <div className="text-muted-foreground text-right text-xs">
              {currentLength} / {maxLength}
            </div>
          ) : null}
        </div>
      )}
    />
  );
};

export const TextArea = memo(Component) as typeof Component;
