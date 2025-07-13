import { memo } from 'react';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import {
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/shadcn';

import { ICON_SIZES } from '../constants';
import { FormFieldWrapper } from '../fieldWrapper';

import { useController } from './model/useController';

import type { Props } from './model/types';
import type { FieldValues } from 'react-hook-form';

/**
 * MultiSelect Component - Multiple selection dropdown
 *
 * @example
 * ```tsx
 * <FormMultiSelect
 *   control={form.control}
 *   name="tags"
 *   label="Tags"
 *   options={[
 *     { value: 'react', label: 'React' },
 *     { value: 'typescript', label: 'TypeScript' },
 *     { value: 'nextjs', label: 'Next.js' },
 *   ]}
 *   max={3}
 *   placeholder="Select tags..."
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
  max,
  showCount = true,
  showClearAll = true,
  showReset = true,
  testId,
}: Props<TFieldValues, TValue>) => {
  const {
    isDisabled,
    selectedOptions,
    availableOptions,
    canAddMore,
    toggleOption,
    removeOption,
    clearAll,
    ariaProps,
  } = useController({
    control,
    name,
    disabled,
    required,
    options,
    max,
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
        <div className="space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                {...ariaProps}
                variant="outline"
                className={cn(
                  'w-full justify-between font-normal',
                  selectedOptions.length === 0 && 'text-muted-foreground'
                )}
                disabled={isDisabled}
                type="button"
                data-testid={testId}
              >
                <span className="truncate">
                  {selectedOptions.length > 0
                    ? `${String(selectedOptions.length)} ausgewählt`
                    : placeholder}
                  {showCount && max !== undefined ? ` (max. ${String(max)})` : ''}
                </span>
                <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Suchen..." />
                <CommandList>
                  <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>

                  {selectedOptions.length > 0 ? (
                    <>
                      <CommandGroup heading="Ausgewählt">
                        {selectedOptions.map(option => {
                          const Icon = option.icon;
                          return (
                            <CommandItem
                              key={String(option.value)}
                              onSelect={() => {
                                toggleOption(option);
                              }}
                            >
                              <Check className="mr-2 size-4 opacity-100" />
                              {Icon ? <Icon className="mr-2 size-4" /> : null}
                              <span>{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  ) : null}

                  <CommandGroup heading="Verfügbar">
                    {availableOptions.map(option => {
                      const Icon = option.icon;
                      return (
                        <CommandItem
                          key={String(option.value)}
                          onSelect={() => {
                            toggleOption(option);
                          }}
                          disabled={option.disabled ?? !canAddMore}
                        >
                          <Check className="mr-2 size-4 opacity-0" />
                          {Icon ? <Icon className="mr-2 size-4" /> : null}
                          <span>{option.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedOptions.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map(option => {
                const Icon = option.icon;
                return (
                  <Badge key={String(option.value)} variant="secondary" className="gap-1">
                    {Icon ? <Icon className={ICON_SIZES.sm} /> : null}
                    <span>{option.label}</span>
                    <button
                      type="button"
                      onClick={() => {
                        removeOption(option);
                      }}
                      className="ring-offset-background hover:bg-secondary focus:ring-ring ml-1 rounded-full transition-colors outline-none focus:ring-2 focus:ring-offset-2"
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className={ICON_SIZES.sm} />
                    </button>
                  </Badge>
                );
              })}

              {showClearAll ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="h-6 px-2 text-xs"
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

export const MultiSelect = memo(Component) as typeof Component;
