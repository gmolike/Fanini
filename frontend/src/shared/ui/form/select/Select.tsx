import { memo } from 'react';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn';

import { ICON_SIZES } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';
import { useFieldReset } from '../hooks';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Select Component - Dropdown with search and clear functionality
 *
 * @example
 * ```tsx
 * // Simple select
 * <FormSelect
 *   control={form.control}
 *   name="country"
 *   label="Country"
 *   options={[
 *     { value: 'de', label: 'Germany' },
 *     { value: 'us', label: 'United States' },
 *   ]}
 *   placeholder="Select a country"
 * />
 *
 * // With icons
 * <FormSelect
 *   control={form.control}
 *   name="status"
 *   label="Status"
 *   options={[
 *     { value: 'active', label: 'Active', icon: CheckCircle },
 *     { value: 'inactive', label: 'Inactive', icon: XCircle },
 *   ]}
 * />
 * ```
 */
const Component = <TFieldValues extends FieldValues = FieldValues, TValue = string>({
  control,
  name,
  label,
  description,
  required,
  placeholder = 'Auswählen...',
  disabled,
  className,
  options,
  showReset = true,
  showClear = true,
  testId,
}: Props<TFieldValues, TValue>) => {
  const { isDisabled, normalizedValue, displayValue, open, setOpen, onValueChange, ariaProps } =
    useController({
      control,
      name,
      disabled,
      required,
      options,
      placeholder,
      label,
    });

  const { handleClear } = useFieldReset(control, name);
  const selectedOption = options.find(opt => String(opt.value) === normalizedValue);
  const SelectedIcon = selectedOption?.icon;

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
        <div className="flex items-center gap-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                {...ariaProps}
                variant="outline"
                role="combobox"
                className={cn(
                  'flex-1 justify-between font-normal',
                  !normalizedValue && 'text-muted-foreground'
                )}
                disabled={isDisabled}
                type="button"
                data-testid={testId}
              >
                <span className="flex items-center gap-2">
                  {SelectedIcon ? <SelectedIcon className={ICON_SIZES.default} /> : null}
                  <span className="truncate">{displayValue}</span>
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Suchen..." />
                <CommandList>
                  <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
                  <CommandGroup>
                    {options.map(option => {
                      const value = String(option.value);
                      const Icon = option.icon;

                      return (
                        <CommandItem
                          key={value}
                          value={value}
                          onSelect={() => {
                            onValueChange(value, field.onChange);
                          }}
                          disabled={!!option.disabled}
                        >
                          <Check
                            className={cn(
                              'mr-2 size-4',
                              normalizedValue === value ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          {Icon ? <Icon className="mr-2 size-4" /> : null}
                          <span>{option.label}</span>
                          {option.description ? (
                            <span className="text-muted-foreground ml-auto text-xs">
                              {option.description}
                            </span>
                          ) : null}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {showClear && normalizedValue ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                handleClear();
              }}
              aria-label="Auswahl löschen"
              className="shrink-0"
            >
              <X className="size-4" />
            </Button>
          ) : null}
        </div>
      )}
    />
  );
};

export const Select = memo(Component) as typeof Component;
