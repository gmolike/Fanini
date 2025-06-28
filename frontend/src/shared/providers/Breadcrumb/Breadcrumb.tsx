import * as React from 'react'
import { useMatches } from '@tanstack/react-router'
import type {
  BreadcrumbItem,
  BreadcrumbConfig,
} from '@/shared/ui/navigation/Breadcrumb/model/types'

type BreadcrumbContextValue = {
  /**
   * Aktuelle Breadcrumb-Items
   */
  items: BreadcrumbItem[]

  /**
   * Breadcrumb-Items manuell setzen
   */
  setItems: (items: BreadcrumbItem[]) => void

  /**
   * Zurück zu automatischen Breadcrumbs
   */
  resetToAuto: () => void
}

const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  items: [],
  setItems: () => {},
  resetToAuto: () => {},
})

/**
 * Breadcrumb Provider
 * @description Verwaltet Breadcrumb-State und automatische Generierung
 */
export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [manualItems, setManualItems] = React.useState<BreadcrumbItem[] | null>(null)
  const matches = useMatches()

  // Automatische Breadcrumb-Generierung
  const automaticItems = React.useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = []

    // Home hinzufügen (außer auf Homepage)
    const isHomePage = matches.length === 1 && matches[0]?.pathname === '/'
    if (!isHomePage) {
      items.push({
        label: 'Home',
        href: '/',
      })
    }

    // Route-basierte Items
    matches.forEach((match, index) => {
      if (match.routeId === '__root__') return

      const staticData = match.staticData as { breadcrumb?: BreadcrumbConfig } | undefined
      const breadcrumbConfig = staticData?.breadcrumb

      // Skip wenn explizit disabled
      if (breadcrumbConfig?.show === false) return

      // Label bestimmen
      let label = breadcrumbConfig?.label || breadcrumbConfig?.title

      // Fallback: aus Pathname ableiten
      if (!label) {
        const pathSegments = match.pathname.split('/').filter(Boolean)
        const lastSegment = pathSegments[pathSegments.length - 1]
        if (lastSegment) {
          label = lastSegment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        } else {
          label = 'Home'
        }
      }

      const isLast = index === matches.length - 1

      items.push({
        label,
        href: isLast ? undefined : match.pathname,
        icon: breadcrumbConfig?.icon,
      })
    })

    return items
  }, [matches])

  // Items (manual override oder automatic)
  const currentItems = manualItems ?? automaticItems

  const setItems = React.useCallback((items: BreadcrumbItem[]) => {
    setManualItems(items)
  }, [])

  const resetToAuto = React.useCallback(() => {
    setManualItems(null)
  }, [])

  const value: BreadcrumbContextValue = {
    items: currentItems,
    setItems,
    resetToAuto,
  }

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>
}

export const BreadcrumbContext_Internal = BreadcrumbContext
