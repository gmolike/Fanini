import React from 'react';

import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/shared/lib';

/**
 * ModernSelect Component
 * @description Moderne Select-Komponente ohne überflüssige Borders
 */
export const ModernSelect = SelectPrimitive.Root;

export const ModernSelectTrigger = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'bg-background flex h-10 w-full items-center justify-between rounded-md px-3 py-2',
      'text-sm transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[placeholder]:text-muted-foreground',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
ModernSelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const ModernSelectContent = React.forwardRef<
  React.ComponentRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden',
        'bg-popover text-popover-foreground rounded-md shadow-lg',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
ModernSelectContent.displayName = SelectPrimitive.Content.displayName;
