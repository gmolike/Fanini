import * as React from 'react'

import { cn } from '@/shared/lib'

type ButtonGroupProps = {
  children: React.ReactNode
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

/**
 * ButtonGroup Komponente
 * @description Gruppiert mehrere Buttons visuell
 */
export const ButtonGroup = ({
  children,
  className,
  orientation = 'horizontal',
}: ButtonGroupProps) => {
  return (
    <div
      role="group"
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row -space-x-px' : 'flex-col -space-y-px',
        '[&>*]:rounded-none',
        '[&>*:first-child]:rounded-l-md',
        '[&>*:last-child]:rounded-r-md',
        orientation === 'vertical' && [
          '[&>*:first-child]:rounded-t-md [&>*:first-child]:rounded-l-none',
          '[&>*:last-child]:rounded-b-md [&>*:last-child]:rounded-r-none',
        ],
        className,
      )}
    >
      {children}
    </div>
  )
}
