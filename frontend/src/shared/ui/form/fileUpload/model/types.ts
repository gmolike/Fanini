import type { BaseFieldProps } from '../../input/model/types';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

/**
 * File info type
 */
export type FileInfo = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  preview?: string;
};

/**
 * Props for the FileUpload controller hook
 */
export type ControllerProps<TFieldValues extends FieldValues = FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  disabled?: boolean;
  required?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  label?: string;
};

/**
 * Return value of the FileUpload controller hook
 */
export type ControllerResult = {
  isDisabled: boolean;
  files: FileInfo[];
  isDragging: boolean;
  canAddMore: boolean;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  clearAll: () => void;
  ariaProps: Record<string, unknown>;
  inputProps: {
    type: 'file';
    accept?: string;
    multiple?: boolean;
    disabled: boolean;
  };
};

/**
 * Props for the FileUpload component
 */
export type Props<TFieldValues extends FieldValues = FieldValues> = BaseFieldProps<TFieldValues> & {
  /**
   * Accepted file types
   * @example "image/*,application/pdf"
   */
  accept?: string;

  /**
   * Maximum file size in bytes
   * @default 10MB
   */
  maxSize?: number;

  /**
   * Maximum number of files
   * @default 1
   */
  maxFiles?: number;

  /**
   * Whether multiple files can be selected
   * @default false
   */
  multiple?: boolean;

  /**
   * Whether to show file previews (for images)
   * @default true
   */
  showPreview?: boolean;

  /**
   * Whether to show file size
   * @default true
   */
  showSize?: boolean;
};
