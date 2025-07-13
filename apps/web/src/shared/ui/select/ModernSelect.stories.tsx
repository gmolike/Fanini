// frontend/src/shared/ui/select/ModernSelect.stories.tsx
import React,{ useState } from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { Check } from 'lucide-react';

import { cn } from '@/shared/lib';

import { ModernSelect, ModernSelectContent,ModernSelectTrigger } from './ModernSelect';

import type { Meta, StoryObj } from '@storybook/react';

/**
 * @description Moderne Select-Komponente ohne überflüssige Borders
 */
const meta: Meta = {
  title: 'modernSelect',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Helper Select Item Component
const SelectItem = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-none select-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = 'SelectItem';

/**
 * @description Standard Select
 */
const DefaultComponent = () => {
  const [value, setValue] = useState('apple');

  return (
    <ModernSelect value={value} onValueChange={setValue}>
      <ModernSelectTrigger className="w-[200px]">
        <SelectPrimitive.Value placeholder="Wähle eine Frucht" />
      </ModernSelectTrigger>
      <ModernSelectContent>
        <SelectItem value="apple">Apfel</SelectItem>
        <SelectItem value="banana">Banane</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="grape">Traube</SelectItem>
        <SelectItem value="strawberry">Erdbeere</SelectItem>
      </ModernSelectContent>
    </ModernSelect>
  );
};

export const Default: Story = {
  render: () => <DefaultComponent />,
};

/**
 * @description Select mit Gruppen
 */
const WithGroupsComponent = () => {
  const [value, setValue] = useState('');

  return (
    <ModernSelect value={value} onValueChange={setValue}>
      <ModernSelectTrigger className="w-[250px]">
        <SelectPrimitive.Value placeholder="Wähle ein Land" />
      </ModernSelectTrigger>
      <ModernSelectContent>
        <SelectPrimitive.Group>
          <SelectPrimitive.Label className="text-muted-foreground px-2 py-1.5 text-sm font-semibold">
            Europa
          </SelectPrimitive.Label>
          <SelectItem value="de">Deutschland</SelectItem>
          <SelectItem value="fr">Frankreich</SelectItem>
          <SelectItem value="es">Spanien</SelectItem>
        </SelectPrimitive.Group>

        <SelectPrimitive.Separator className="bg-muted my-1 h-px" />

        <SelectPrimitive.Group>
          <SelectPrimitive.Label className="text-muted-foreground px-2 py-1.5 text-sm font-semibold">
            Amerika
          </SelectPrimitive.Label>
          <SelectItem value="us">USA</SelectItem>
          <SelectItem value="ca">Kanada</SelectItem>
          <SelectItem value="mx">Mexiko</SelectItem>
        </SelectPrimitive.Group>
      </ModernSelectContent>
    </ModernSelect>
  );
};

export const WithGroups: Story = {
  render: () => <WithGroupsComponent />,
};

/**
 * @description Disabled Select
 */
export const Disabled: Story = {
  render: () => (
    <ModernSelect disabled>
      <ModernSelectTrigger className="w-[200px]" disabled>
        <SelectPrimitive.Value placeholder="Deaktiviert" />
      </ModernSelectTrigger>
      <ModernSelectContent>
        <SelectItem value="1">Option 1</SelectItem>
      </ModernSelectContent>
    </ModernSelect>
  ),
};

/**
 * @description Verschiedene Größen
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-muted-foreground mb-2 text-sm">Klein</p>
        <ModernSelect>
          <ModernSelectTrigger className="h-8 w-[150px] text-sm">
            <SelectPrimitive.Value placeholder="Klein" />
          </ModernSelectTrigger>
          <ModernSelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </ModernSelectContent>
        </ModernSelect>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Standard</p>
        <ModernSelect>
          <ModernSelectTrigger className="w-[200px]">
            <SelectPrimitive.Value placeholder="Standard" />
          </ModernSelectTrigger>
          <ModernSelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </ModernSelectContent>
        </ModernSelect>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-sm">Groß</p>
        <ModernSelect>
          <ModernSelectTrigger className="h-12 w-[250px] text-lg">
            <SelectPrimitive.Value placeholder="Groß" />
          </ModernSelectTrigger>
          <ModernSelectContent>
            <SelectItem value="1">Option 1</SelectItem>
            <SelectItem value="2">Option 2</SelectItem>
          </ModernSelectContent>
        </ModernSelect>
      </div>
    </div>
  ),
};
