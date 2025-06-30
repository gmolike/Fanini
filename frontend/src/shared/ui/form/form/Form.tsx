import { memo, useId } from 'react';

import { cn } from '@/shared/lib';
import { Form as ShadCnForm } from '@/shared/shadcn';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Form Component - Flexible form wrapper with Zod validation
 *
 * Supports two usage patterns:
 * 1. Simple: Pass schema and let Form create the form instance
 * 2. Advanced: Pass your own form instance for full control
 *
 * Features:
 * - Automatic form instance creation with Zod validation
 * - Support for external form instances
 * - Render prop pattern for flexible content
 * - Built-in error handling
 * - Accessibility attributes
 *
 * @template TFieldValues - Type of the form values
 *
 * @example
 * ```tsx
 * // Simple usage - Form creates the instance
 * <Form
 *   schema={userSchema}
 *   defaultValues={{ name: '', email: '' }}
 *   onSubmit={handleSubmit}
 * >
 *   {(form) => (
 *     <>
 *       <FormInput control={form.control} name="name" label="Name" />
 *       <FormInput control={form.control} name="email" label="Email" />
 *       <FormFooter />
 *     </>
 *   )}
 * </Form>
 *
 * // Advanced usage - External form instance
 * const form = useForm({
 *   resolver: zodResolver(userSchema),
 *   defaultValues: { name: '', email: '' }
 * });
 *
 * // Use form methods outside component
 * const handleExternalReset = () => {
 *   form.reset();
 * };
 *
 * <Form form={form} onSubmit={handleSubmit}>
 *   <FormInput control={form.control} name="name" label="Name" />
 *   <FormInput control={form.control} name="email" label="Email" />
 *   <FormFooter form={form} />
 * </Form>
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  form: externalForm,
  schema,
  defaultValues,
  onSubmit,
  onError,
  mode,
  reValidateMode,
  criteriaMode,
  resetOptions,
  shouldFocusError,
  shouldUnregister,
  shouldUseNativeValidation,
  progressive,
  delayError,
  children,
  className,
  id: providedId,
  noValidate = true,
  onReset,
}: Props<TFieldValues>) => {
  const generatedId = useId();
  const formId = providedId ?? generatedId;

  const { form } = useController({
    form: externalForm,
    schema,
    defaultValues,
    mode,
    reValidateMode,
    criteriaMode,
    resetOptions,
    shouldFocusError,
    shouldUnregister,
    shouldUseNativeValidation,
    progressive,
    delayError,
  });

  const handleSubmit = form.handleSubmit(onSubmit, onError);

  const handleFormReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.reset();
    onReset?.();
  };

  const content = typeof children === 'function' ? children(form) : children;

  // Extract schema description if available
  const ariaLabel =
    schema && '_def' in schema ? (schema._def as { description?: string }).description : undefined;

  return (
    <ShadCnForm {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit}
        onReset={onReset ? handleFormReset : undefined}
        className={cn('space-y-6', className)}
        noValidate={noValidate}
        aria-label={ariaLabel}
      >
        {content}
      </form>
    </ShadCnForm>
  );
};

export const Form = memo(Component) as typeof Component;
