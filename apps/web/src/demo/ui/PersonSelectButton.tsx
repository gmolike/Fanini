// src/demo/ui/PersonSelectButton.tsx
import { memo, useState } from 'react';

import { ChevronDown,UserPlus } from 'lucide-react';

import { FormDialogButton } from '@/shared/ui/form';

import { PersonSelectDialog } from './PersonSelectDialog';

import type { PersonInfo } from '../model/types';
import type { Control, FieldValues, Path } from 'react-hook-form';

/**
 * Props for PersonSelectButton
 */
type PersonSelectButtonProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  personInfo?: PersonInfo;
  onPersonChange?: (person: PersonInfo | undefined) => void;
};

/**
 * Button component for selecting a responsible person
 * Displays person info and manages selection through dialog
 *
 * @component
 */
const Component = <TFieldValues extends FieldValues>({
  control,
  name,
  label = 'Verantwortliche Person',
  description,
  required,
  disabled,
  personInfo,
  onPersonChange,
}: PersonSelectButtonProps<TFieldValues>) => {
  // Local state for person info
  const [localPersonInfo, setLocalPersonInfo] = useState<PersonInfo | undefined>(personInfo);

  const handlePersonSelect = (person: PersonInfo) => {
    setLocalPersonInfo(person);
    onPersonChange?.(person);
  };

  const displayContent = localPersonInfo
    ? `${localPersonInfo.vorname} ${localPersonInfo.nachname} (${localPersonInfo.gremium})`
    : undefined;

  return (
    <FormDialogButton
      control={control}
      name={name}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      placeholder="Person auswählen..."
      startIcon={UserPlus}
      endIcon={ChevronDown}
      dialog={({ open, onOpenChange, value, onChange }) => (
        <PersonSelectDialog
          open={open}
          onOpenChange={onOpenChange}
          currentPersonId={value as string}
          onSelect={person => {
            onChange(person.id);
            handlePersonSelect(person);
          }}
        />
      )}
    >
      {displayContent}
    </FormDialogButton>
  );
};

export const PersonSelectButton = memo(Component) as typeof Component;
