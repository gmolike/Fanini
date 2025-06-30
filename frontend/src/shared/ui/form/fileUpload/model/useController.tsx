import { useCallback, useMemo,useState } from 'react';
import { type  FieldValues,type  PathValue,useFormContext,useWatch  } from 'react-hook-form';

import { useFieldAccessibility, useFormFieldState } from '../../hooks';

import type { ControllerProps, ControllerResult, FileInfo } from './types';

/**
 * Convert File to FileInfo
 */
const fileToInfo = async (file: File): Promise<FileInfo> => {
  const info: FileInfo = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  // Generate preview for images
  if (file.type.startsWith('image/')) {
    info.preview = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => { resolve(reader.result as string); };
      reader.readAsDataURL(file);
    });
  }

  return info;
};

/**
 * Hook for FileUpload controller logic
 */
export const useController = <TFieldValues extends FieldValues = FieldValues>({
  control,
  name,
  disabled,
  required,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 1,
  multiple = false,
  label,
}: ControllerProps<TFieldValues>): ControllerResult => {
  const { isDisabled } = useFormFieldState(control, disabled);
  const { ariaProps } = useFieldAccessibility(control, name, required, isDisabled, label);

  const form = useFormContext<TFieldValues>();
  const fieldValue = useWatch({ control, name }) as FileInfo[] | undefined;
  const files = useMemo(() => fieldValue ?? [], [fieldValue]);

  const [isDragging, setIsDragging] = useState(false);

  const canAddMore = files.length < maxFiles;

  const updateFiles = useCallback(
    (newFiles: FileInfo[]) => {
      form.setValue(name, newFiles as PathValue<TFieldValues, typeof name>, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [form, name]
  );

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const validFiles: File[] = [];

      for (const file of fileList) {
        if (file.size > maxSize) {
          console.warn(`File ${file.name} exceeds max size`);
          continue;
        }

        if (files.length + validFiles.length >= maxFiles) {
          break;
        }

        validFiles.push(file);
      }

      // Convert to FileInfo
      const fileInfos = await Promise.all(validFiles.map(fileToInfo));
      updateFiles([...files, ...fileInfos]);
    },
    [files, maxSize, maxFiles, updateFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (!isDisabled && canAddMore) {
        void processFiles(e.dataTransfer.files);
      }
    },
    [isDisabled, canAddMore, processFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!isDisabled && canAddMore) {
        setIsDragging(true);
      }
    },
    [isDisabled, canAddMore]
  );

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && !isDisabled && canAddMore) {
        void processFiles(e.target.files);
      }
    },
    [isDisabled, canAddMore, processFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      updateFiles(files.filter((_, i) => i !== index));
    },
    [files, updateFiles]
  );

  const clearAll = useCallback(() => {
    updateFiles([]);
  }, [updateFiles]);

  const inputProps = {
    type: 'file' as const,
    accept,
    multiple: multiple && maxFiles > 1,
    disabled: isDisabled || !canAddMore,
  };

  return {
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
  };
};
