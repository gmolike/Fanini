import type { ReactNode } from 'react'

export type PageHeaderVariant = 'default' | 'hero' | 'minimal'

export type PageHeaderProps = {
  /**
   * Seitentitel
   */
  title: string

  /**
   * Optionale Beschreibung unter dem Titel
   */
  description?: string

  /**
   * Breadcrumb-Navigation Komponente
   */
  breadcrumb?: ReactNode

  /**
   * Action-Buttons oder andere Komponenten rechts
   */
  actions?: ReactNode

  /**
   * Styling-Variante des Headers
   * @default 'default'
   */
  variant?: PageHeaderVariant

  /**
   * Zusätzliche CSS-Klassen
   */
  className?: string
}
