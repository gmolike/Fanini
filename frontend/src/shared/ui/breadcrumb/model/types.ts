import type { ComponentType } from 'react'

export type BreadcrumbContextValue = {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  resetToAuto: () => void
}

export type BreadcrumbItem = {
  label: string
  href?: string
  icon?: ComponentType<{ className?: string }>
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
  separator?: ComponentType<{ className?: string }>
  showHomeIcon?: boolean
  variant?: BreadcrumbVariant
}

export type BreadcrumbVariant = 'default' | 'compact' | 'large'
