import { memo } from 'react';

import { Check, ChevronsUpDown, Loader2, type  LucideIcon,X  } from 'lucide-react';

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

import { ICON_SIZES, TRANSITIONS } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';
import { useFieldReset } from '../hooks';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * Combobox Component - Searchable dropdown with autocomplete
 *
 * @example
 * ```tsx
 * // Simple combobox
 * <FormCombobox
 *   control={form.control}
 *   name="framework"
 *   label="Framework"
 *   options={frameworks}
 *   placeholder="Select framework..."
 * />
 *
 * // With async search
 * <FormCombobox
 *   control={form.control}
 *   name="user"
 *   label="User"
 *   options={users}
 *   onSearchChange={handleSearch}
 *   loading={isSearching}
 *   debounceDelay={500}
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
  searchPlaceholder = 'Suchen...',
  disabled,
  className,
  options,
  emptyText = 'Keine Ergebnisse gefunden.',
  showReset = true,
  showClear = true,
  onSearchChange,
  loading = false,
  loadingText = 'Wird geladen...',
  debounceDelay,
  testId,
}: Props<TFieldValues, TValue>) => {
  const {
    isDisabled,
    open,
    setOpen,
    searchValue,
    setSearchValue,
    filteredOptions,
    selectedOption,
    handleSelect,
    ariaProps,
  } = useController({
    control,
    name,
    disabled,
    required,
    options,
    onSearchChange,
    loading,
    debounceDelay,
    label,
  });

  const { handleClear } = useFieldReset(control, name);

  const showClearButton = Boolean(showClear && selectedOption);

  return (
    <FormFieldWrapper
      control={control}
      name={name}
      label={label ?? ''}
      description={description ?? ''}
      required={!!required}
      className={className ?? ''}
      showReset={showReset}
      render={field => {
        const Icon = selectedOption?.icon;

        return (
          <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  {...ariaProps}
                  variant="outline"
                  aria-expanded={open}
                  className={cn(
                    'flex-1 justify-between font-normal',
                    !selectedOption && 'text-muted-foreground',
                    TRANSITIONS.default
                  )}
                  disabled={isDisabled}
                  type="button"
                  data-testid={testId}
                >
                  <span className="flex items-center gap-2 truncate">
                    {Icon ? <Icon className={ICON_SIZES.default} /> : null}
                    <span>{selectedOption?.label ?? placeholder}</span>
                  </span>
                  {loading === true ? (
                    <Loader2 className={cn(ICON_SIZES.default, 'animate-spin opacity-50')} />
                  ) : (
                    <ChevronsUpDown className={cn(ICON_SIZES.default, 'shrink-0 opacity-50')} />
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onValueChange={setSearchValue}
                    disabled={Boolean(loading)}
                  />
                  <CommandList>
                    {loading === true && (
                      <CommandEmpty>
                        <Loader2 className={cn(ICON_SIZES.default, 'animate-spin')} />
                        <span className="ml-2">{loadingText}</span>
                      </CommandEmpty>
                    )}
                    {!loading && filteredOptions.length === 0 && (
                      <CommandEmpty>{emptyText}</CommandEmpty>
                    )}
                    {!loading && filteredOptions.length > 0 && (
                      <CommandGroup>
                        {filteredOptions.map(option => {
                          const value = String(option.value);
                          const isSelected = selectedOption?.value === option.value;
                          const OptionIcon = option.icon;

                          return (
                            <CommandItem
                              key={value}
                              value={value}
                              onSelect={() => { handleSelect(option, field.onChange); }}
                              disabled={option.disabled ?? false}
                            >
                              <Check
                                className={cn(
                                  'mr-2',
                                  ICON_SIZES.default,
                                  isSelected ? 'opacity-100' : 'opacity-0'
                                )}
                              />
                              {OptionIcon ? (
                                <OptionIcon className={cn('mr-2', ICON_SIZES.default)} />
                              ) : null}
                              <div className="flex-1">
                                <div>{option.label}</div>
                                {option.description ? (
                                  <div className="text-muted-foreground text-xs">
                                    {option.description}
                                  </div>
                                ) : null}
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {showClearButton ? (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => { handleClear(); }}
                aria-label="Auswahl löschen"
                className="shrink-0"
              >
                <X className={ICON_SIZES.default} />
              </Button>
            ) : null}
          </div>
        );
      }}
    />
  );
};

export const Combobox = memo(Component) as typeof Component;
