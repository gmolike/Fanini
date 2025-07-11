import { memo } from 'react';

import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Footer Component - Form footer with error/success messages
 * Button order is always: Reset -> Cancel -> Submit
 *
 * @template TFieldValues - Type of the form values
 *
 * @param form - React Hook Form instance (optional, will use context if not provided)
 * @param onSubmit - Submit handler (form submission is handled automatically)
 * @param onCancel - Cancel handler
 * @param onReset - Reset handler (in addition to form reset)
 * @param showReset - Whether to show reset button
 * @param showCancel - Whether to show cancel button
 * @param submitText - Text for submit button
 * @param cancelText - Text for cancel button
 * @param resetText - Text for reset button
 * @param error - Error message to display
 * @param success - Success message to display
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <FormFooter
 *   form={form}
 *   showReset={true}
 *   showCancel={true}
 *   onCancel={handleCancel}
 *   submitText="Speichern"
 *   error={submitError}
 *   success={submitSuccess}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onCancel,
  onReset,
  showReset = false,
  showCancel = false,
  submitText = 'Speichern',
  cancelText = 'Abbrechen',
  resetText = 'Zurücksetzen',
  showResetText = true,
  error,
  success,
  className,
}: Props<TFieldValues>) => {
  const { formState, handleReset, handleCancel } = useController({
    form,
    onReset,
    onCancel,
  });

  const { isSubmitting, isDirty, isValid } = formState;

  return (
    <div className={cn('space-y-4 pt-6', className)}>
      {/* Error Message */}
      {error ? (
        <div className="bg-destructive/10 text-destructive flex items-center gap-2 rounded-md p-3 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {/* Success Message */}
      {success ? (
        <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-600">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{success}</span>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2">
        {/* Reset Button - always first */}
        {showCancel ? (
          <Button
            type="button"
            variant="destructive"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ArrowLeft className="size-4" />
            {cancelText}
          </Button>
        ) : null}

        {/* Cancel Button - always second */}
        {showReset ? (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isSubmitting}
          >
            <RotateCcw className="size-4" />
            {showResetText ? resetText : undefined}
          </Button>
        ) : null}

        {/* Submit Button - always last */}
        <Button type="submit" disabled={isSubmitting || !isValid} onClick={onSubmit}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              {submitText}
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export const Footer = memo(Component) as typeof Component;
