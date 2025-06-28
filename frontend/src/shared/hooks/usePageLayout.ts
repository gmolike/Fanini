import { useEffect } from 'react'
import { useLayout } from '@/shared/providers/Layout'
import type { LayoutConfig } from '@/shared/providers/Layout/types'

/**
 * Page Layout Hook
 * @description Konfiguriert Layout für die aktuelle Page
 */
export const usePageLayout = (config: Partial<LayoutConfig>) => {
  const { updateConfig } = useLayout()

  useEffect(() => {
    // Default-Werte setzen
    const configWithDefaults: Partial<LayoutConfig> = {
      showBreadcrumb: true,
      ...config,
    }

    updateConfig(configWithDefaults)

    // Cleanup when component unmounts
    return () => {
      updateConfig({ type: 'public' })
    }
  }, [config, updateConfig])
}
