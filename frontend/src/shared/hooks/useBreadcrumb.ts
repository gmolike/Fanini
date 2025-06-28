import { useContext } from 'react'
import { BreadcrumbContext_Internal } from '@/shared/providers/Breadcrumb/Breadcrumb'

/**
 * Breadcrumb Hook
 * @description Zugriff auf Breadcrumb-State und -Funktionen
 */
export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext_Internal)

  if (!context) {
    throw new Error('useBreadcrumb must be used within BreadcrumbProvider')
  }

  return context
}
