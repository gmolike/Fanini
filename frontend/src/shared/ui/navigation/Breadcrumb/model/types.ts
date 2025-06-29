import type { ComponentType } from 'react'

/**
 * Breadcrumb Item
 */
export type BreadcrumbItem = {
  /**
   * Angezeigter Text
   */
  label: string

  /**
   * URL - wenn undefined, ist es der aktuelle/letzte Schritt
   */
  href?: string

  /**
   * Optionales Icon
   */
  icon?: ComponentType<{ className?: string }>
}

/**
 * Breadcrumb Varianten
 */
export type BreadcrumbVariant = 'default' | 'compact' | 'large'

/**
 * Breadcrumb Props
 */
export type BreadcrumbProps = {
  /**
   * Breadcrumb Items
   */
  items: BreadcrumbItem[]

  /**
   * CSS Klassen
   */
  className?: string

  /**
   * Separator zwischen Items
   * @default ChevronRight
   */
  separator?: ComponentType<{ className?: string }>

  /**
   * Zeige Home Icon beim ersten Item
   * @default true
   */
  showHomeIcon?: boolean

  /**
   * Variante
   * @default 'default'
   */
  variant?: BreadcrumbVariant
}

/**
 * Route Breadcrumb Config
 */
export type BreadcrumbConfig = {
  /**
   * Titel für die Route
   */
  title: string

  /**
   * Optionaler Custom Label
   */
  label?: string

  /**
   * Icon für den Breadcrumb
   */
  icon?: ComponentType<{ className?: string }>

  /**
   * Soll angezeigt werden?
   * @default true
   */
  show?: boolean
}
