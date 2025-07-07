import { memo, useRef } from 'react';

import { FileIcon, Upload, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/shadcn';

import { ICON_SIZES } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Format file size for display
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

  // String() explizit verwenden
  return `${String(size)} ${sizes[i] ?? 'Bytes'}`;
};

/**
 * FileUpload Component - File upload with drag and drop
 *
 * @example
 * ```tsx
 * // Single file upload
 * <FormFileUpload
 *   control={form.control}
 *   name="avatar"
 *   label="Profile Picture"
 *   accept="image/*"
 *   maxSize={5 * 1024 * 1024} // 5MB
 * />
 *
 * // Multiple files
 * <FormFileUpload
 *   control={form.control}
 *   name="documents"
 *   label="Documents"
 *   accept=".pdf,.doc,.docx"
 *   multiple
 *   maxFiles={5}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Dateien hier ablegen oder klicken zum Auswählen',
  disabled,
  className,
  accept,
  maxSize = 10 * 1024 * 1024,
  maxFiles = 1,
  multiple = false,
  showPreview = true,
  showSize = true,
  showReset = true,
  testId,
}: Props<TFieldValues>) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isDisabled,
    files,
    isDragging,
    canAddMore,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileSelect,
    removeFile,
    clearAll,
    ariaProps,
    inputProps,
  } = useController({
    control,
    name,
    disabled,
    required,
    accept,
    maxSize,
    maxFiles,
    multiple,
    label,
  });

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      className={className}
      showReset={showReset}
      render={() => (
        <div className="space-y-4">
          {/* Dropzone */}
          <div
            role="button"
            tabIndex={isDisabled ? -1 : 0}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => {
              if (!isDisabled && canAddMore) {
                inputRef.current?.click();
              }
            }}
            onKeyDown={e => {
              if (!isDisabled && canAddMore && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={cn(
              'relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
              isDragging && 'border-primary bg-primary/5',
              !isDragging && 'border-muted-foreground/25 hover:border-muted-foreground/50',
              isDisabled && 'cursor-not-allowed opacity-50'
            )}
            {...ariaProps}
            data-testid={testId}
          >
            <input ref={inputRef} {...inputProps} onChange={handleFileSelect} className="sr-only" />

            <Upload className="text-muted-foreground mx-auto h-12 w-12" />
            <p className="text-muted-foreground mt-2 text-sm">{placeholder}</p>

            {accept || maxSize ? (
              <p className="text-muted-foreground mt-1 text-xs">
                {accept ? `Erlaubt: ${accept}` : ''}
                {accept && maxSize ? ' • ' : ''}
                {maxSize ? `Max: ${formatFileSize(maxSize)}` : ''}
              </p>
            ) : null}
          </div>

          {/* File list */}
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${String(file.lastModified)}-${String(index)}`}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {/* Preview or icon */}
                  {showPreview && file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="size-10 rounded object-cover"
                    />
                  ) : (
                    <FileIcon className="text-muted-foreground size-10" />
                  )}

                  {/* File info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    {showSize ? (
                      <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                    ) : null}
                  </div>

                  {/* Remove button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeFile(index);
                    }}
                    className="size-8 shrink-0"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className={ICON_SIZES.default} />
                  </Button>
                </div>
              ))}

              {/* Clear all button */}
              {files.length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="w-full"
                >
                  Alle entfernen
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      )}
    />
  );
};

export const FileUpload = memo(Component) as typeof Component;
