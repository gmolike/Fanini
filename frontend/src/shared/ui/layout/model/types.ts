/**
 * Layout Komponenten Types
 */
export interface NavigationItem {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface HeaderProps {
  className?: string
  showMobileMenu?: boolean
}

export interface FooterProps {
  className?: string
}

export interface NavigationProps {
  items: NavigationItem[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}
