import type { ComponentType } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ComponentType<{ className?: string }>
}

export type BreadcrumbVariant = 'default' | 'compact' | 'large'

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: ComponentType<{ className?: string }>
  showHomeIcon?: boolean
  variant?: BreadcrumbVariant
}

export interface BreadcrumbContextValue {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  resetToAuto: () => void
}
