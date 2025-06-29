import type { ReactNode, ComponentType } from 'react'

import type { LinkProps } from '@tanstack/react-router'

export type NavLinkVariant = 'default' | 'primary' | 'ghost' | 'sidebar'
export type NavLinkSize = 'sm' | 'default' | 'lg'

export type NavLinkProps = LinkProps & {
  /**
   * Link-Inhalt
   */
  children: ReactNode

  /**
   * Styling-Variante
   * @default 'default'
   */
  variant?: NavLinkVariant

  /**
   * Größe des Links
   * @default 'default'
   */
  size?: NavLinkSize

  /**
   * Optionales Icon vor dem Text
   */
  icon?: ComponentType<{ className?: string }>

  /**
   * Badge-Text rechts vom Link
   */
  badge?: string | number

  /**
   * Ob es ein externer Link ist (öffnet in neuem Tab)
   * @default false
   */
  isExternal?: boolean

  /**
   * Zusätzliche CSS-Klassen
   */
  className?: string
}
