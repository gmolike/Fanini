
export type BreadcrumbItem = {
  label: string
  href?: string
}


export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}


export type FooterProps = {
  className?: string
}


export type HeaderProps = {
  className?: string
  showMobileMenu?: boolean
}

/**
 * Layout Komponenten Types
 */
export type NavigationItem = {
  label: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  badge?: string
}

export type NavigationProps = {
  items: NavigationItem[]
  className?: string
  orientation?: 'horizontal' | 'vertical'
}
