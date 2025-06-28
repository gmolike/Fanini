import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { ConnectedBreadcrumb } from '@/shared/ui/navigation'
import { Footer } from '@/widgets/Navigation/Footer'
import { Header } from '@/widgets/Navigation/Header'
import { Sidebar } from '@/widgets/Navigation/Sidebar'
import * as React from 'react'
import { BreadcrumbProvider } from '../Breadcrumb'
import { LayoutConfig } from './types'

const LayoutContext = React.createContext<{
  config: LayoutConfig
  updateConfig: (config: Partial<LayoutConfig>) => void
}>({
  config: { type: 'public' },
  updateConfig: () => {},
})

/**
 * Layout Provider
 * @description Zentrale Layout-Verwaltung mit automatischen Breadcrumbs
 */
export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = React.useState<LayoutConfig>({ type: 'public' })

  // Automatische Breadcrumb-Generierung

  const updateConfig = React.useCallback((newConfig: Partial<LayoutConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }, [])

  return (
    <BreadcrumbProvider>
      <LayoutContext.Provider value={{ config, updateConfig }}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          {config.showHeader !== false && <Header />}

          <div className="flex flex-1">
            {config.showSidebar && <Sidebar />}

            <main className={config.showSidebar ? 'flex-1' : 'flex-1'}>
              {config.showPageHeader !== false && config.pageHeader && (
                <PageHeader
                  {...config.pageHeader}
                  breadcrumb={config.showBreadcrumb !== false ? <ConnectedBreadcrumb /> : undefined}
                />
              )}

              <div className={config.showSidebar ? 'p-6' : ''}>{children}</div>
            </main>
          </div>

          {config.showFooter !== false && <Footer />}
        </div>
      </LayoutContext.Provider>
    </BreadcrumbProvider>
  )
}

export const useLayout = () => React.useContext(LayoutContext)
