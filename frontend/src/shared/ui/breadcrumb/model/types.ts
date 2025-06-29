import type { ComponentType } from 'react'

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ComponentType<{ className?: string }>
}

export type BreadcrumbVariant = 'default' | 'compact' | 'large'

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
  separator?: ComponentType<{ className?: string }>
  showHomeIcon?: boolean
  variant?: BreadcrumbVariant
}

export type BreadcrumbContextValue = {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  resetToAuto: () => void
}
