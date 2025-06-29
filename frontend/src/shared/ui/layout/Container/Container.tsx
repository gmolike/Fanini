import * as React from 'react'

import { cn } from '@/shared/lib'

import type { ContainerProps } from './model/types'

/**
 * Container Komponente
 * @description Responsive Container mit max-width und Padding
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'default',
  className,
  as: Component = 'div',
}) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <Component className={cn('mx-auto px-4 sm:px-6 lg:px-8', sizeClasses[size], className)}>
      {children}
    </Component>
  )
}
