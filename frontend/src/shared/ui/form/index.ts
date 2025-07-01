/**
 * Form Components Library
 *
 * A comprehensive set of form components built on React Hook Form
 * with Zod validation and shadcn/ui styling
 *
 * @module shared/ui/form
 */

// Core Form component
export { Form } from './form/Form';

// Form utilities and hooks
export * from './constants';
export * from './hooks';
export * from './types';
export * from './utils';

// Form field wrapper
export { FormFieldWrapper } from './fieldWrapper';

// Re-export React Hook Form utilities
export type {
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
  PathValue,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
export { FormProvider, useForm, useFormContext } from 'react-hook-form';

// Input components
export { Checkbox as FormCheckbox } from './checkbox';
export { Combobox as FormCombobox } from './combobox';
export { DatePicker as FormDatePicker } from './datePicker';
export { DateRange as FormDateRange } from './dateRange';
export { DialogButton as FormDialogButton } from './dialogButton';
export { FileUpload as FormFileUpload } from './fileUpload';
export { Input as FormInput } from './input';
export { MultiSelect as FormMultiSelect } from './multiSelect';
export { Select as FormSelect } from './select';
export { TextArea as FormTextArea } from './textarea';

// Layout components
export { Footer as FormFooter } from './footer';
export { Header as FormHeader } from './header';

// Export all types
export type * from './checkbox/model/types';

// Export controllers for advanced usage
export { useController as useCheckboxController } from './checkbox/model/useController';
export { useController as useComboboxController } from './combobox/model/useController';
export { useController as useDatePickerController } from './datePicker/model/useController';
export { useController as useDialogButtonController } from './dialogButton/model/useController';
export { useController as useFileUploadController } from './fileUpload/model/useController';
export { useController as useFooterController } from './footer/model/useController';
export { useController as useHeaderController } from './header/model/useController';
export { useController as useInputController } from './input/model/useController';
export { useController as useMultiSelectController } from './multiSelect/model/useController';
export { useController as useSelectController } from './select/model/useController';
export { useController as useTextareaController } from './textarea/model/useController';
