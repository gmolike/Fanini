import type { ReactNode, ElementType } from 'react'

export type ContainerSize = 'sm' | 'default' | 'lg' | 'full'

export type ContainerProps = {
  children: ReactNode
  size?: ContainerSize
  className?: string
  as?: ElementType
}
