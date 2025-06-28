import type { PageHeaderProps } from '@/shared/ui/layout/PageHeader/model/types'

export type LayoutType = 'public' | 'app' | 'auth' | 'minimal'

export type LayoutConfig = {
  type: LayoutType
  showHeader?: boolean
  showFooter?: boolean
  showSidebar?: boolean
  showPageHeader?: boolean
  showBreadcrumb?: boolean // ✅ Diese Property fehlte!
  pageHeader?: Omit<PageHeaderProps, 'breadcrumb'>
}

export type RouteLayoutConfig = {
  layout?: {
    type?: LayoutType
    breadcrumb?: {
      label: string
    }
    pageHeader?: Omit<PageHeaderProps, 'breadcrumb'>
  }
}
