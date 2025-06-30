import type { ElementType,ReactNode } from 'react'

export type ContainerProps = {
  children: ReactNode
  size?: ContainerSize
  className?: string
  as?: ElementType
}

export type ContainerSize = 'sm' | 'default' | 'lg' | 'full'
